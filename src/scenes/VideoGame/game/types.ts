export interface Vector {
  x: number;
  y: number;
}

/**
 * The main type containing the state for the whole game.
 * Note that this is a mutable state which is mutated all over the place. Not ideal!
 */
export interface GameState {
  entityContainerEl: HTMLElement | null;
  barrelEl: HTMLElement | null;
  statusEl: HTMLElement | null;
  modalEl: HTMLElement | null;
  levelBgEl: HTMLElement | null;
  barrelAngle: number;
  entities: Entity[];
  lastUpdateTime: number;
  lastSpawnTime: number;
  shotCount: number;
  enemyCount: number;
  enemySpawns: EnemySpawn[];
  lives: number;
  level: number;
  score: number;
  modalTime: number;
  isGameOver: boolean;
}

export type EnemyStyle = "Red" | "Green" | "Purple" | "Blue";

/**
 * Different enemy spawn choices, with different properties each.
 */
export interface EnemySpawnBase {
  position: Vector;
  delay: number;
  style: EnemyStyle;
  speed: number; // Percentage of screen height per second.
}

export interface EnemySpawnNormal extends EnemySpawnBase {
  variant: "normal";
}

export interface EnemySpawnSine extends EnemySpawnBase {
  variant: "sine";
  sineRadius: number;
  sineSpeed: number;
}

export interface EnemySpawnSnake extends EnemySpawnBase {
  variant: "snake";
  lines: Vector[];
}

export type EnemySpawn = EnemySpawnNormal | EnemySpawnSine | EnemySpawnSnake;

/**
 * Entities have an HTML element, can be "cleaned up" and have some other properties for gameplay purposes.
 */
interface EntityBase {
  el: HTMLElement;
  dead?: boolean;
}

export interface Enemy extends EntityBase {
  type: "enemy";
  spawnTime: number;
  enemySpawn: EnemySpawn;
}

interface Shot extends EntityBase {
  type: "shot";
  velocity: Vector;
}

export type Entity = Shot | Enemy;
