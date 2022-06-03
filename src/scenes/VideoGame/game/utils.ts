import { barrelOffsetY, enemyWidth } from "./constants";
import { Vector } from "./types";

/**
 * Get the position of the barrel.
 */
export const getBarrelPosition = (): Vector => {
  return {
    x: window.innerWidth / 2,
    y: window.innerHeight + barrelOffsetY,
  };
};

/**
 * Create snake lines that either start from the left or the right side of the screen.
 */
export const getRandomSnakeLines = (goingLeft: boolean): Vector[] => {
  let y = 50;
  let x = goingLeft ? window.innerWidth + enemyWidth : -enemyWidth;
  const points = [];
  for (let i = 0; i < 4; i++) {
    points.push({ x, y });
    x = goingLeft ? 100 : window.innerWidth - 100;
    points.push({ x, y });
    y += window.innerHeight * 0.1;
    goingLeft = !goingLeft;
  }
  y = window.innerHeight + 100;
  points.push({ x, y });

  return points;
};

/**
 * Figure out the position of a "snake" enemy by tracing its "age" across a series of points on the screen.
 */
export const getSnakePosition = (
  lines: Vector[],
  age: number,
  speed: number
): Vector => {
  let remainingDistance = age * window.innerHeight * speed;
  let [p1, p2] = lines;
  let i = 1;
  for (let i = 1; i < lines.length; i++) {
    const distance = Math.sqrt(
      Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2)
    );
    if (remainingDistance <= distance) {
      const x = p1.x + (remainingDistance * (p2.x - p1.x)) / distance;
      const y = p1.y + (remainingDistance * (p2.y - p1.y)) / distance;
      return { x, y };
    }
    remainingDistance -= distance;
    p1 = p2;
    p2 = lines[i + 1];
  }
  return lines[lines.length - 1];
};
