import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Animated,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface GameOverScreenProps {
  score: number;
  highScore: number;
  onRestart: () => void;
}

export default function GameOverScreen({
  score,
  highScore,
  onRestart,
}: GameOverScreenProps) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(40)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  const isNewHighScore = score >= highScore && score > 0;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: false,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 400,
        useNativeDriver: false,
      }),
    ]).start(() => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.06,
            duration: 700,
            useNativeDriver: false,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 700,
            useNativeDriver: false,
          }),
        ])
      ).start();
    });
  }, []);

  return (
    <Animated.View style={[styles.overlay, { opacity: fadeAnim }]}>
      <Animated.View
        style={[
          styles.content,
          { transform: [{ translateY: slideAnim }] },
        ]}
      >
        {/* Crash icon */}
        <View style={styles.iconContainer}>
          <Ionicons name="skull" size={48} color="#ff2244" />
        </View>

        <Text style={styles.gameOverText}>GAME OVER</Text>

        {isNewHighScore && (
          <View style={styles.newRecordBadge}>
            <Ionicons name="trophy" size={14} color="#ffd700" />
            <Text style={styles.newRecordText}> NEW BEST!</Text>
          </View>
        )}

        <View style={styles.scoreContainer}>
          <View style={styles.scoreBox}>
            <Text style={styles.scoreLabel}>SCORE</Text>
            <Text style={styles.scoreValue}>{score}</Text>
          </View>
          <View style={styles.scoreDivider} />
          <View style={styles.scoreBox}>
            <Text style={styles.scoreLabel}>BEST</Text>
            <Text style={styles.highScoreValue}>{highScore}</Text>
          </View>
        </View>

        <TouchableOpacity onPress={onRestart} activeOpacity={0.8}>
          <Animated.View
            style={[
              styles.restartButton,
              { transform: [{ scale: pulseAnim }] },
            ]}
          >
            <Ionicons name="refresh" size={18} color="#00e8ff" />
            <Text style={styles.restartText}>PLAY AGAIN</Text>
          </Animated.View>
        </TouchableOpacity>

        <Text style={styles.hint}>Tap anywhere to restart</Text>
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "#03050fee",
    alignItems: "center",
    justifyContent: "center",
  },
  content: {
    alignItems: "center",
    paddingHorizontal: 32,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#1a0008",
    borderWidth: 1.5,
    borderColor: "#ff224444",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  gameOverText: {
    fontSize: 42,
    fontFamily: "Inter_700Bold",
    color: "#ff2244",
    letterSpacing: 4,
    textShadowColor: "#ff0022",
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 16,
    marginBottom: 12,
  },
  newRecordBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1a1200",
    borderWidth: 1,
    borderColor: "#ffd70044",
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 5,
    marginBottom: 20,
  },
  newRecordText: {
    color: "#ffd700",
    fontFamily: "Inter_700Bold",
    fontSize: 12,
    letterSpacing: 2,
  },
  scoreContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#060d1f",
    borderWidth: 1,
    borderColor: "#0e2040",
    borderRadius: 16,
    paddingVertical: 20,
    paddingHorizontal: 32,
    marginBottom: 32,
    gap: 24,
  },
  scoreBox: {
    alignItems: "center",
  },
  scoreDivider: {
    width: 1,
    height: 40,
    backgroundColor: "#0e2040",
  },
  scoreLabel: {
    fontSize: 10,
    color: "#5a8099",
    fontFamily: "Inter_600SemiBold",
    letterSpacing: 3,
    marginBottom: 4,
  },
  scoreValue: {
    fontSize: 36,
    color: "#00e8ff",
    fontFamily: "Inter_700Bold",
    textShadowColor: "#00c8ff",
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 8,
  },
  highScoreValue: {
    fontSize: 36,
    color: "#ffd700",
    fontFamily: "Inter_700Bold",
    textShadowColor: "#ffaa00",
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 8,
  },
  restartButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    borderWidth: 1.5,
    borderColor: "#00c8ff",
    borderRadius: 30,
    paddingVertical: 14,
    paddingHorizontal: 36,
    backgroundColor: "#00c8ff18",
    marginBottom: 16,
  },
  restartText: {
    fontSize: 16,
    color: "#00e8ff",
    fontFamily: "Inter_700Bold",
    letterSpacing: 3,
  },
  hint: {
    fontSize: 12,
    color: "#5a8099",
    fontFamily: "Inter_400Regular",
  },
});
