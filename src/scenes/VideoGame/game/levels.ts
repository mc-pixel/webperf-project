import { enemyHeight, enemyWidth, scenePadding } from "./constants";
import { EnemySpawn, Vector } from "./types";
import { getRandomSnakeLines } from "./utils";
import times from "lodash/times";

/**
 * Generate a random position for an enemy. Tries to responsively account for enemy widths and padding.
 */
export const getRandomSpawnPosition = (enemyWidth: number): Vector => {
  const padding = scenePadding + enemyWidth / 2;
  return {
    x: Math.random() * (window.innerWidth - padding * 2) + padding,
    y: -enemyHeight,
  };
};

const levelCreators: Array<() => EnemySpawn[]> = [
  // Level 1
  () => {
    return times<EnemySpawn>(10, () => ({
      variant: "normal",
      style: "Red",
      delay: 2,
      position: getRandomSpawnPosition(enemyWidth),
      speed: 0.1,
    }));
  },
  // Level 2
  () => {
    return times<EnemySpawn>(15, (i) =>
      i % 5
        ? {
            variant: "normal",
            style: "Red",
            delay: 1.5,
            position: getRandomSpawnPosition(enemyWidth),
            speed: 0.1,
          }
        : {
            variant: "sine",
            style: "Purple",
            delay: 2,
            position: getRandomSpawnPosition(300),
            speed: 0.06,
            sineRadius: 150,
            sineSpeed: 0.1,
          }
    );
  },
  // Level 3
  () => {
    return [
      ...times<EnemySpawn>(3, () => ({
        variant: "normal",
        style: "Red",
        delay: 0,
        position: getRandomSpawnPosition(enemyWidth),
        speed: 0.1,
      })),
      {
        variant: "normal",
        style: "Red",
        delay: 3,
        position: getRandomSpawnPosition(enemyWidth),
        speed: 0.1,
      },
      ...times<EnemySpawn>(4, () => ({
        variant: "normal",
        style: "Red",
        delay: 0,
        position: getRandomSpawnPosition(enemyWidth),
        speed: 0.1,
      })),
      {
        variant: "normal",
        style: "Red",
        delay: 4,
        position: getRandomSpawnPosition(enemyWidth),
        speed: 0.1,
      },
      ...times<EnemySpawn>(6, () => ({
        variant: "normal",
        style: "Red",
        delay: 0,
        position: getRandomSpawnPosition(enemyWidth),
        speed: 0.1,
      })),
    ];
  },
  // Level 4
  () => {
    return [
      ...times<EnemySpawn>(12, () => ({
        variant: "normal",
        style: "Green",
        delay: 1.5,
        position: getRandomSpawnPosition(enemyWidth),
        speed: 0.18,
      })),
    ];
  },
  // Level 5
  () => {
    return [
      ...times<EnemySpawn>(10, () => ({
        variant: "sine",
        style: "Purple",
        delay: 2,
        position: getRandomSpawnPosition(400 + enemyWidth),
        speed: 0.1,
        sineRadius: 200,
        sineSpeed: 0.1,
      })),
    ];
  },
  // Level 6
  () => {
    return [
      ...times<EnemySpawn>(50, () => ({
        variant: "snake",
        style: "Blue",
        delay: 0.3,
        position: getRandomSpawnPosition(enemyWidth),
        lines: getRandomSnakeLines(true),
        speed: 0.4,
      })),
    ];
  },
  // Level 7
  () => {
    return times<EnemySpawn>(50, () => {
      switch (Math.floor(Math.random() * 4)) {
        case 0:
          return {
            variant: "sine",
            style: "Purple",
            delay: 1 + Math.random() * 1,
            position: getRandomSpawnPosition(500 + enemyWidth),
            speed: 0.12,
            sineRadius: 250,
            sineSpeed: 0.05 + Math.random() * 0.3,
          };
        case 1:
          return {
            variant: "snake",
            style: "Blue",
            delay: 0.3 + Math.random() * 1,
            position: getRandomSpawnPosition(enemyWidth),
            lines: getRandomSnakeLines(Math.random() > 0.5 ? true : false),
            speed: 0.4,
          };
        default:
          return {
            variant: "normal",
            style: "Green",
            delay: 1 + Math.random() * 1,
            position: getRandomSpawnPosition(enemyWidth),
            speed: 0.18,
          };
      }
    });
  },
];

export function createLevel(level: number) {
  if (levelCreators[level - 1]) {
    return levelCreators[level - 1]();
  }
  return [];
}

export const levelBackgrounds = [
  "hsla(0, 100%, 50%, 0.15)",
  "hsla(40, 100%, 50%, 0.15)",
  "hsla(80, 100%, 50%, 0.15)",
  "hsla(120, 100%, 50%, 0.15)",
  "hsla(200, 100%, 50%, 0.15)",
  "hsla(280, 100%, 50%, 0.15)",
  "hsla(0, 100%, 50%, 0.3)",
  "hsla(0, 100%, 100%, 0.5)",
  "hsla(0, 100%, 50%, 0)",
];
