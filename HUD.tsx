import React from "react";
import { View, Text, StyleSheet } from "react-native";

interface HUDProps {
  score: number;
  highScore: number;
  speed: number;
}

export default function HUD({ score, highScore, speed }: HUDProps) {
  const speedLevel = Math.floor((speed - 250) / 40) + 1;

  return (
    <View style={styles.container} pointerEvents="none">
      <View style={styles.left}>
        <Text style={styles.label}>SCORE</Text>
        <Text style={styles.scoreValue}>{score}</Text>
      </View>
      <View style={styles.right}>
        <Text style={styles.label}>BEST</Text>
        <Text style={styles.highScoreValue}>{highScore}</Text>
      </View>
      <View style={styles.speedBadge}>
        <Text style={styles.speedText}>LVL {speedLevel}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 16,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    paddingHorizontal: 20,
  },
  left: {
    alignItems: "flex-start",
  },
  right: {
    alignItems: "flex-end",
  },
  label: {
    fontSize: 10,
    color: "#5a8099",
    fontFamily: "Inter_600SemiBold",
    letterSpacing: 2,
  },
  scoreValue: {
    fontSize: 28,
    color: "#00e8ff",
    fontFamily: "Inter_700Bold",
    textShadowColor: "#00c8ff",
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 8,
  },
  highScoreValue: {
    fontSize: 28,
    color: "#ffd700",
    fontFamily: "Inter_700Bold",
    textShadowColor: "#ffaa00",
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 8,
  },
  speedBadge: {
    position: "absolute",
    top: 0,
    left: "50%",
    transform: [{ translateX: -24 }],
    backgroundColor: "#0a1a3a",
    borderWidth: 1,
    borderColor: "#00c8ff44",
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  speedText: {
    fontSize: 10,
    color: "#00c8ff",
    fontFamily: "Inter_600SemiBold",
    letterSpacing: 1,
  },
});
