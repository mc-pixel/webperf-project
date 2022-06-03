import { createLevel } from "./levels";
import { Entity, GameState } from "./types";

/**
 * Create the initial game state.
 */
export const initialState = (): GameState => {
  const level = 1;
  const enemySpawns = createLevel(level);
  return {
    entityContainerEl: null,
    barrelEl: null,
    statusEl: null,
    modalEl: null,
    levelBgEl: null,
    barrelAngle: 0,
    entities: [],
    lastUpdateTime: 0,
    lives: 3,
    level,
    score: 0,
    shotCount: 0,
    enemyCount: enemySpawns.length,
    enemySpawns,
    lastSpawnTime: 0,
    modalTime: 0,
    isGameOver: false,
  };
};

/**
 * Reset the game state without nulling elements.
 * Wait 1 second before starting.
 */
export const restartGame = (state: GameState) => {
  const {
    level,
    score,
    enemySpawns,
    lives,
    shotCount,
    enemyCount,
    isGameOver,
  } = initialState();
  Object.assign(state, {
    level,
    score,
    enemySpawns,
    lives,
    shotCount,
    enemyCount,
    isGameOver,
    modalTime: 1,
  });
};

/**
 * Adds an entity to the game state and UI.
 */
export function addEntity(state: GameState, entity: Entity) {
  if (!state.entityContainerEl) {
    return;
  }

  state.entityContainerEl.appendChild(entity.el);
  state.entities.push(entity);
}

/**
 * Removes an entities from the scene and marks it for future cleanup.
 * @param entity
 */
export function killEntity(entity: Entity) {
  entity.dead = true;
  entity.el.remove();
}

/**
 * Remove all entities from the scene.
 */
export function killAllEntities(state: GameState) {
  state.entities.forEach((entity) => {
    killEntity(entity);
  });
}

/**
 * Clean up all "dead" entities from the game state.
 */
export function removeDeadEntities(state: GameState) {
  state.entities = state.entities.reduce<Entity[]>(
    (array, item) => (item.dead ? array : [...array, item]),
    []
  );
}
