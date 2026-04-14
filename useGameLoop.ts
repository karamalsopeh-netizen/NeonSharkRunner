import { useRef, useCallback, useEffect } from "react";
import { Platform } from "react-native";

export function useGameLoop(
  callback: (dt: number) => void,
  isRunning: boolean
) {
  const callbackRef = useRef(callback);
  const lastTimeRef = useRef<number | null>(null);
  const rafIdRef = useRef<number | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  useEffect(() => {
    if (!isRunning) {
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current);
        rafIdRef.current = null;
      }
      if (intervalRef.current !== null) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      lastTimeRef.current = null;
      return;
    }

    if (Platform.OS === "web") {
      // Use requestAnimationFrame on web
      const loop = (time: number) => {
        if (lastTimeRef.current === null) {
          lastTimeRef.current = time;
        }
        const dt = Math.min((time - lastTimeRef.current) / 1000, 0.05);
        lastTimeRef.current = time;
        callbackRef.current(dt);
        rafIdRef.current = requestAnimationFrame(loop);
      };
      rafIdRef.current = requestAnimationFrame(loop);
    } else {
      // Use setInterval on native (60fps)
      const targetFPS = 60;
      const interval = 1000 / targetFPS;
      intervalRef.current = setInterval(() => {
        const now = Date.now();
        if (lastTimeRef.current === null) {
          lastTimeRef.current = now;
        }
        const dt = Math.min((now - lastTimeRef.current) / 1000, 0.05);
        lastTimeRef.current = now;
        callbackRef.current(dt);
      }, interval);
    }

    return () => {
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current);
        rafIdRef.current = null;
      }
      if (intervalRef.current !== null) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      lastTimeRef.current = null;
    };
  }, [isRunning]);
}
