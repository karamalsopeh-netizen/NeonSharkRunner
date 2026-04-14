import { useRef, useCallback, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const GROUND_HEIGHT = 80;
const SHARK_WIDTH = 70;
const SHARK_HEIGHT = 45;
const GRAVITY = 1800;
const JUMP_VELOCITY = -580;
const BASE_SPEED = 250;
const SPEED_INCREMENT = 40;
const SPEED_INTERVAL = 10; // seconds

const COIN_SIZE = 28;
const OBSTACLE_WIDTH = 32;
const OBSTACLE_HEIGHT = 48;
const HIGH_SCORE_KEY = "neon_shark_high_score";

export interface SharkState {
  x: number;
  y: number;
  width: number;
  height: number;
  velocityY: number;
  isJumping: boolean;
}

export interface GameObject {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface GameData {
  shark: SharkState;
  obstacles: GameObject[];
  coins: GameObject[];
  score: number;
  highScore: number;
  speed: number;
  gameTime: number;
  scrollX: number;
  isRunning: boolean;
  isGameOver: boolean;
  isStartScreen: boolean;
}

export function useGameState(canvasWidth: number, canvasHeight: number) {
  const groundY = canvasHeight - GROUND_HEIGHT;
  const sharkStartX = 60;
  const sharkStartY = groundY - SHARK_HEIGHT;

  const gameDataRef = useRef<GameData>({
    shark: {
      x: sharkStartX,
      y: sharkStartY,
      width: SHARK_WIDTH,
      height: SHARK_HEIGHT,
      velocityY: 0,
      isJumping: false,
    },
    obstacles: [],
    coins: [],
    score: 0,
    highScore: 0,
    speed: BASE_SPEED,
    gameTime: 0,
    scrollX: 0,
    isRunning: false,
    isGameOver: false,
    isStartScreen: true,
  });

  const [renderTick, setRenderTick] = useState(0);
  const obstacleTimerRef = useRef(0);
  const coinTimerRef = useRef(0);
  const obstacleIdRef = useRef(0);
  const coinIdRef = useRef(0);
  const nextObstacleDelay = useRef(getObstacleDelay(BASE_SPEED));
  const nextCoinDelay = useRef(getCoinDelay());

  function getObstacleDelay(speed: number) {
    return 1.2 + Math.random() * (2.5 - speed * 0.003);
  }

  function getCoinDelay() {
    return 0.8 + Math.random() * 1.5;
  }

  const loadHighScore = useCallback(async () => {
    try {
      const stored = await AsyncStorage.getItem(HIGH_SCORE_KEY);
      if (stored) {
        gameDataRef.current.highScore = parseInt(stored, 10);
        setRenderTick((t) => t + 1);
      }
    } catch {}
  }, []);

  const saveHighScore = useCallback(async (score: number) => {
    try {
      await AsyncStorage.setItem(HIGH_SCORE_KEY, score.toString());
    } catch {}
  }, []);

  const startGame = useCallback(() => {
    const groundY = canvasHeight - GROUND_HEIGHT;
    const g = gameDataRef.current;
    g.shark = {
      x: sharkStartX,
      y: groundY - SHARK_HEIGHT,
      width: SHARK_WIDTH,
      height: SHARK_HEIGHT,
      velocityY: 0,
      isJumping: false,
    };
    g.obstacles = [];
    g.coins = [];
    g.score = 0;
    g.speed = BASE_SPEED;
    g.gameTime = 0;
    g.scrollX = 0;
    g.isRunning = true;
    g.isGameOver = false;
    g.isStartScreen = false;
    obstacleTimerRef.current = 0;
    coinTimerRef.current = 0;
    nextObstacleDelay.current = getObstacleDelay(BASE_SPEED);
    nextCoinDelay.current = getCoinDelay();
    setRenderTick((t) => t + 1);
  }, [canvasHeight, canvasWidth]);

  const jump = useCallback(() => {
    const g = gameDataRef.current;
    if (g.isStartScreen) {
      startGame();
      return;
    }
    if (g.isGameOver) {
      startGame();
      return;
    }
    if (g.isRunning && !g.shark.isJumping) {
      g.shark.velocityY = JUMP_VELOCITY;
      g.shark.isJumping = true;
    }
  }, [startGame]);

  const update = useCallback(
    (dt: number) => {
      const g = gameDataRef.current;
      if (!g.isRunning) return;

      const groundY = canvasHeight - GROUND_HEIGHT;

      // Time
      g.gameTime += dt;
      g.scrollX += g.speed * dt;

      // Speed increase every 10 seconds
      const speedLevel = Math.floor(g.gameTime / SPEED_INTERVAL);
      g.speed = BASE_SPEED + speedLevel * SPEED_INCREMENT;

      // Score (based on distance)
      g.score = Math.floor(g.scrollX / 10);

      // Shark physics
      g.shark.velocityY += GRAVITY * dt;
      g.shark.y += g.shark.velocityY * dt;

      const floorY = groundY - g.shark.height;
      if (g.shark.y >= floorY) {
        g.shark.y = floorY;
        g.shark.velocityY = 0;
        g.shark.isJumping = false;
      }

      // Spawn obstacles
      obstacleTimerRef.current += dt;
      if (obstacleTimerRef.current >= nextObstacleDelay.current) {
        obstacleTimerRef.current = 0;
        nextObstacleDelay.current = getObstacleDelay(g.speed);
        g.obstacles.push({
          id: `obs_${obstacleIdRef.current++}`,
          x: canvasWidth + 20,
          y: groundY - OBSTACLE_HEIGHT,
          width: OBSTACLE_WIDTH,
          height: OBSTACLE_HEIGHT,
        });
      }

      // Spawn coins
      coinTimerRef.current += dt;
      if (coinTimerRef.current >= nextCoinDelay.current) {
        coinTimerRef.current = 0;
        nextCoinDelay.current = getCoinDelay();
        const coinY = groundY - COIN_SIZE;
        g.coins.push({
          id: `coin_${coinIdRef.current++}`,
          x: canvasWidth + 20,
          y: coinY,
          width: COIN_SIZE,
          height: COIN_SIZE,
        });
      }

      // Move obstacles
      g.obstacles = g.obstacles
        .map((obs) => ({ ...obs, x: obs.x - g.speed * dt }))
        .filter((obs) => obs.x + obs.width > -10);

      // Move coins
      g.coins = g.coins
        .map((c) => ({ ...c, x: c.x - g.speed * dt }))
        .filter((c) => c.x + c.width > -10);

      // Collision detection - obstacles
      for (const obs of g.obstacles) {
        if (checkCollision(g.shark, obs, 8)) {
          g.isRunning = false;
          g.isGameOver = true;
          if (g.score > g.highScore) {
            g.highScore = g.score;
            saveHighScore(g.score);
          }
          setRenderTick((t) => t + 1);
          return;
        }
      }

      // Collision detection - coins
      const remaining: GameObject[] = [];
      for (const coin of g.coins) {
        if (checkCollision(g.shark, coin, 4)) {
          g.score += 10;
        } else {
          remaining.push(coin);
        }
      }
      g.coins = remaining;

      setRenderTick((t) => t + 1);
    },
    [canvasHeight, canvasWidth, saveHighScore]
  );

  return {
    gameDataRef,
    renderTick,
    startGame,
    jump,
    update,
    loadHighScore,
  };
}

function checkCollision(
  a: { x: number; y: number; width: number; height: number },
  b: { x: number; y: number; width: number; height: number },
  padding: number
) {
  return (
    a.x + padding < b.x + b.width - padding &&
    a.x + a.width - padding > b.x + padding &&
    a.y + padding < b.y + b.height - padding &&
    a.y + a.height - padding > b.y + padding
  );
}
