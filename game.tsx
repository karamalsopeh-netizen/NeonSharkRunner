import React, { useEffect, useCallback, useState } from "react";
import {
  View,
  StyleSheet,
  Dimensions,
  Pressable,
  Platform,
  Image,
} from "react-native";
import Svg from "react-native-svg";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useGameState } from "@/hooks/useGameState";
import { useGameLoop } from "@/hooks/useGameLoop";
import {
  Background,
  Ground,
  ObstacleSpike,
  GoldCoin,
} from "@/components/GameEngine";
import StartScreen from "@/components/StartScreen";
import GameOverScreen from "@/components/GameOverScreen";
import HUD from "@/components/HUD";
import NBBSplash from "@/components/NBBSplash";

const ASPECT_RATIO = 9 / 16;
const GROUND_HEIGHT = 80;

// NBB logo image (loaded once)
const NBB_LOGO = require("../assets/images/nbb-logo.png");

export default function GameScreen() {
  const insets = useSafeAreaInsets();
  const windowDims = Dimensions.get("window");
  const [showSplash, setShowSplash] = useState(true);

  const screenW = windowDims.width;
  const screenH = windowDims.height;

  let canvasW: number;
  let canvasH: number;
  if (screenW / screenH < ASPECT_RATIO) {
    canvasW = screenW;
    canvasH = screenW / ASPECT_RATIO;
  } else {
    canvasH = screenH;
    canvasW = screenH * ASPECT_RATIO;
  }

  const groundY = canvasH - GROUND_HEIGHT;

  const { gameDataRef, renderTick, jump, update, loadHighScore } =
    useGameState(canvasW, canvasH);

  useEffect(() => {
    loadHighScore();
  }, []);

  const g = gameDataRef.current;
  const isRunning = g.isRunning;
  useGameLoop(update, isRunning);

  const webTopInset = Platform.OS === "web" ? Math.max(insets.top, 44) : 0;
  const webBottomInset = Platform.OS === "web" ? 34 : 0;

  // Logo size — square, slightly larger than old shark hitbox
  const logoSize = 60;

  return (
    <Pressable
      onPress={jump}
      style={[
        styles.container,
        { paddingTop: webTopInset, paddingBottom: webBottomInset },
      ]}
    >
      <View style={[styles.canvasContainer, { width: canvasW, height: canvasH }]}>
        {/* SVG game world */}
        <Svg
          width={canvasW}
          height={canvasH}
          viewBox={`0 0 ${canvasW} ${canvasH}`}
          style={StyleSheet.absoluteFillObject}
        >
          <Background
            width={canvasW}
            height={canvasH}
            groundY={groundY}
            scrollX={g.scrollX}
          />
          <Ground
            width={canvasW}
            height={canvasH}
            groundY={groundY}
            scrollX={g.scrollX}
          />
          {g.obstacles.map((obs) => (
            <ObstacleSpike key={obs.id} obs={obs} />
          ))}
          {g.coins.map((coin) => (
            <GoldCoin
              key={coin.id}
              coin={coin}
              bobOffset={0}
            />
          ))}
        </Svg>

        {/* NBB Logo as the player character — absolutely positioned over SVG */}
        {!g.isStartScreen && (
          <Image
            source={NBB_LOGO}
            style={[
              styles.playerLogo,
              {
                width: logoSize,
                height: logoSize,
                left: g.shark.x,
                top: g.shark.y - (logoSize - g.shark.height) / 2,
              },
            ]}
            resizeMode="contain"
          />
        )}

        {/* HUD */}
        {g.isRunning && !g.isGameOver && (
          <HUD score={g.score} highScore={g.highScore} speed={g.speed} />
        )}

        {/* Start Screen */}
        {g.isStartScreen && (
          <StartScreen highScore={g.highScore} onStart={jump} />
        )}

        {/* Game Over Screen */}
        {g.isGameOver && (
          <GameOverScreen
            score={g.score}
            highScore={g.highScore}
            onRestart={jump}
          />
        )}

        {/* NBB GAMES™ Brand Splash — shown on very first load */}
        {showSplash && (
          <NBBSplash onFinish={() => setShowSplash(false)} />
        )}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#03050f",
    alignItems: "center",
    justifyContent: "center",
  },
  canvasContainer: {
    overflow: "hidden",
    position: "relative",
    backgroundColor: "#03050f",
  },
  playerLogo: {
    position: "absolute",
  },
});
