import { createEnemy, scoreFromEnemy } from "./entities";
import {
  addEntity,
  killAllEntities,
  killEntity,
  removeDeadEntities,
} from "./state";
import { Enemy, Entity, GameState } from "./types";
import { createLevel, levelBackgrounds } from "./levels";
import { bonusScore } from "./constants";
import { getSnakePosition } from "./utils";

/**
 * The main update function. Runs during each animation frame, runs the whole game play loop
 * and updates entites on screen.
 */
export function update(state: GameState, updateTime: number) {
  // The updateTime is basically how many seconds since the user opened the game URL.
  // This can be useful for some things. For others it's more useful to have a delta
  // since the last update.
  const delta = updateTime - state.lastUpdateTime;
  state.lastUpdateTime = updateTime;

  // Check if there's a new enemy spawning.
  checkSpawn(state, updateTime);

  // Update the rotation of the barrel.
  updateBarrel(state);

  // Move all entities.
  updateEntities(state, updateTime, delta);

  // Check if there are collisions, either between entities (shots and enemies) or between entities
  // and the screen boundaries.
  checkCollisions(state);

  // Update some misc UI elements.
  updateUI(state, delta);
}

/**
 * Check if it's time to spawn a new enemy.
 *
 * Each level has a queue of enemySpawns which we spawn in order. Each EnemySpawn can specify its
 * own delay after the previous spawn.
 */
function checkSpawn(state: GameState, updateTime: number) {
  // Don't spawn anything when modals are open.
  if (state.modalTime > 0) {
    return;
  }
  const { enemySpawns, lastSpawnTime } = state;
  const enemySpawn = enemySpawns[0];

  // Is it time yet?
  if (enemySpawn && updateTime - lastSpawnTime > enemySpawn.delay) {
    // Yes it is!
    state.lastSpawnTime = updateTime;
    enemySpawns.shift();

    addEntity(state, createEnemy(enemySpawn, updateTime));
  }
}

/**
 * Update the barrel rotation.
 * @param state
 */
function updateBarrel(state: GameState) {
  if (state.barrelEl) {
    state.barrelEl.style.transform = `rotate(${
      state.barrelAngle + Math.PI / 2
    }rad)`;
  }
}

/**
 * Move each entity according to their movement rules.
 */
function updateEntities(state: GameState, updateTime: number, delta: number) {
  state.entities.forEach((entity) => {
    // Shots go in a straight direction based on their velocity.
    const prevStyles = window.getComputedStyle(entity.el);
    if (entity.type === "shot") {
      const newPos = {
        x: parseFloat(prevStyles.left) + entity.velocity.x * delta,
        y: parseFloat(prevStyles.top) + entity.velocity.y * delta,
      };
      entity.el.style.left = `${newPos.x}px`;
      entity.el.style.top = `${newPos.y}px`;
    } else if (entity.type === "enemy") {
      // Enemies move differently based on their variant.
      const { speed, variant } = entity.enemySpawn;

      // Normal and "sine" enemies generally move down according to some speed.
      if (variant === "normal" || variant === "sine") {
        const newY =
          parseFloat(prevStyles.top) +
          window.innerHeight * entity.enemySpawn.speed * delta;
        entity.el.style.top = `${newY}px`;
      }

      // Additionally, "sine" enemies move in a sine wave pattern.
      if (variant === "sine") {
        const newX =
          entity.enemySpawn.position.x +
          Math.sin(
            (updateTime * entity.enemySpawn.sineSpeed * window.innerHeight) /
              100
          ) *
            entity.enemySpawn.sineRadius;
        entity.el.style.left = `${newX}px`;
      }

      // Finally, "snake" enemies move according to predefined lines across the screen.
      if (variant === "snake") {
        const newPos = getSnakePosition(
          entity.enemySpawn.lines,
          updateTime - entity.spawnTime,
          speed
        );
        entity.el.style.left = `${newPos.x}px`;
        entity.el.style.top = `${newPos.y}px`;
      }
    }
  });
}

/**
 * Collision detection. How fun!
 */
function checkCollisions(state: GameState) {
  state.entities.forEach((entityA) => {
    // Ignore "dead" entities ... (we'll clean them up right after).
    if (entityA.dead) {
      return;
    }

    // Check if the entity is colliding with the screen boundaries.
    const rectA = entityA.el.getBoundingClientRect();
    const outsideBounds =
      entityA.type === "shot"
        ? // Shots collide with all boundaries.
          rectA.top > window.innerHeight ||
          rectA.bottom < 0 ||
          rectA.left > window.innerWidth ||
          rectA.right < 0
        : // Enemies only collide with bottom of screen.
          rectA.top > window.innerHeight;

    if (outsideBounds) {
      if (entityA.type === "enemy") {
        // Oh no!
        loseLive(state);
      } else {
        // Basically a shot hitting the edge... Nothing dramatic.
        killEntity(entityA);
      }
    } else {
      // Check if the entity is colliding with other entities.
      state.entities.forEach((entityB) => {
        if (entityB.dead) {
          return;
        }
        const rectB = entityB.el.getBoundingClientRect();

        // Such simple code, but still capable of causing a migraine. 🙃
        const hit = !(
          rectB.left > rectA.right ||
          rectB.right < rectA.left ||
          rectB.top > rectA.bottom ||
          rectB.bottom < rectA.top
        );

        // Hardcoding entityA=shot and entityB=enemy since we're checking every combination anyways. 😇
        const shotVsEnemy = entityA.type === "shot" && entityB.type === "enemy";
        if (hit && shotVsEnemy) {
          // Yay!
          killEntity(entityA);
          killEntity(entityB);
          state.score += scoreFromEnemy(entityB);

          checkEndLevel(state);
        }
      });
    }
  });

  // Filter dead entities.
  removeDeadEntities(state);
}

/**
 * Update misc UI elements.
 */
function updateUI(state: GameState, delta: number) {
  // Update the gameplay status UI.
  if (state.statusEl) {
    state.statusEl.innerText = `Level: ${state.level}\nLives: ${state.lives}\nScore: ${state.score}`;
  }

  // Show and hide the modal.
  if (state.modalEl) {
    state.modalEl.style.opacity = state.modalTime ? "1" : "0";
  }

  // Counting down while a modal is open until the game starts again. Note, the end-game modals have
  // a modalTime of Number.MAX_VALUE. It's fine! :D
  if (state.modalTime) {
    state.modalTime = Math.max(0, state.modalTime - delta);
  }
}

/**
 * Oh no, an enemy has hit the bottom of the screen.
 * @param state
 */
function loseLive(state: GameState) {
  // A life has been lost. :(
  state.lives--;

  // Maybe even game over?
  if (state.lives === 0) {
    state.enemySpawns = [];
    state.isGameOver = true;
    showModal(
      state,
      `<h1>Game Over!</h1><p>Score: ${state.score}</p><p>Click to play again :)</p>`,
      Number.MAX_VALUE
    );
  } else {
    showModal(state, `<h1>Whoops!</h1>`, 2);

    // "reload" the same level with all of the remaining enemies.
    const activeEnemies = state.entities
      .filter((entity) => entity.type === "enemy" && !entity.dead)
      .map((entity) => (entity as Enemy).enemySpawn);

    state.enemySpawns = [...activeEnemies, ...state.enemySpawns];
  }

  killAllEntities(state);
}

/**
 * Check if we've reached the end of the level. This function is run immediately after a shot hits an enemy.
 */
function checkEndLevel(state: GameState) {
  const enemiesRemaining =
    state.enemySpawns.length ||
    state.entities.some((entity) => entity.type === "enemy" && !entity.dead);

  // Nah, still some enemies to be killed. Keep playing!
  if (enemiesRemaining) {
    return;
  }

  // Calculate some stats for the modal.
  const accuracy = state.enemyCount / state.shotCount;
  const accuracyPretty = Math.round(accuracy * 100);
  const bonus = Math.round(bonusScore * accuracy);
  showModal(
    state,
    `<h1>Level ${state.level} finished!</h1><p>Shot accuracy: ${accuracyPretty}%</p><p>Bonus points: ${bonus}</p>`
  );

  // Clean up the previous level.
  killAllEntities(state);
  state.score += bonus;
  state.shotCount = 0;

  // Load the next level.
  state.level++;
  state.enemySpawns = createLevel(state.level);
  state.enemyCount = state.enemySpawns.length;
  if (state.levelBgEl) {
    state.levelBgEl.style.backgroundColor = levelBackgrounds[state.level];
  }

  // Or end the game.
  if (state.enemySpawns.length === 0) {
    showModal(
      state,
      `<h1>Congratulations!</h1><p>You won the game!</p><p>Total score: ${state.score}</p><p>Click to play again :)</p>`,
      Number.MAX_VALUE
    );
    state.isGameOver = true;
  }
}

/**
 * Shows a modal. This HTML is put into a modal which fades in and out after `time` seconds.
 */
function showModal(state: GameState, html: string, time = 5) {
  if (state.modalEl) {
    state.modalEl.innerHTML = html;
  }
  state.modalTime = time;
}
