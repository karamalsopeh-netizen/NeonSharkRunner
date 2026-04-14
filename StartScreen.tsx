import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Animated,
  TouchableOpacity,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface StartScreenProps {
  highScore: number;
  onStart: () => void;
}

export default function StartScreen({ highScore, onStart }: StartScreenProps) {
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const floatAnim = useRef(new Animated.Value(0)).current;
  const glowAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.08,
          duration: 800,
          useNativeDriver: false,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: false,
        }),
      ])
    ).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, {
          toValue: -12,
          duration: 1200,
          useNativeDriver: false,
        }),
        Animated.timing(floatAnim, {
          toValue: 0,
          duration: 1200,
          useNativeDriver: false,
        }),
      ])
    ).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: false,
        }),
        Animated.timing(glowAnim, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: false,
        }),
      ])
    ).start();
  }, []);

  return (
    <View style={styles.overlay}>
      <View style={styles.content}>
        {/* Animated NBB logo */}
        <Animated.View
          style={[
            styles.sharkIconContainer,
            { transform: [{ translateY: floatAnim }] },
          ]}
        >
          <View style={styles.sharkIcon}>
            <Image
              source={require("../assets/images/nbb-logo.png")}
              style={styles.logoImage}
              resizeMode="contain"
            />
          </View>
        </Animated.View>

        <Text style={styles.title}>NEON</Text>
        <Text style={styles.titleAccent}>SHARK</Text>
        <Text style={styles.subtitle}>RUNNER</Text>

        <View style={styles.divider} />

        {highScore > 0 && (
          <View style={styles.highScoreContainer}>
            <Text style={styles.highScoreLabel}>BEST</Text>
            <Text style={styles.highScoreValue}>{highScore}</Text>
          </View>
        )}

        <TouchableOpacity onPress={onStart} activeOpacity={0.8}>
          <Animated.View
            style={[
              styles.startButton,
              { transform: [{ scale: pulseAnim }] },
            ]}
          >
            <Text style={styles.startButtonText}>TAP TO START</Text>
          </Animated.View>
        </TouchableOpacity>

        <View style={styles.instructionRow}>
          <Ionicons name="hand-left" size={14} color="#5a8099" />
          <Text style={styles.instruction}> Tap to jump over spikes</Text>
        </View>
        <View style={styles.instructionRow}>
          <Ionicons name="ellipse" size={10} color="#ffd700" />
          <Text style={styles.instruction}> Collect gold coins for bonus points</Text>
        </View>
      </View>
    </View>
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
  sharkIconContainer: {
    marginBottom: 16,
  },
  sharkIcon: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: "#060d1f",
    borderWidth: 2,
    borderColor: "#00c8ff44",
    alignItems: "center",
    justifyContent: "center",
  },
  logoImage: {
    width: 64,
    height: 64,
  },
  title: {
    fontSize: 52,
    fontFamily: "Inter_700Bold",
    color: "#00e0ff",
    letterSpacing: 8,
    textShadowColor: "#00c8ff",
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 20,
    lineHeight: 54,
  },
  titleAccent: {
    fontSize: 64,
    fontFamily: "Inter_700Bold",
    color: "#ffffff",
    letterSpacing: 6,
    textShadowColor: "#00c8ff",
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 16,
    lineHeight: 66,
  },
  subtitle: {
    fontSize: 24,
    fontFamily: "Inter_400Regular",
    color: "#5a8099",
    letterSpacing: 12,
    marginTop: 4,
  },
  divider: {
    width: 60,
    height: 1,
    backgroundColor: "#00c8ff44",
    marginVertical: 24,
  },
  highScoreContainer: {
    alignItems: "center",
    marginBottom: 24,
  },
  highScoreLabel: {
    fontSize: 10,
    color: "#5a8099",
    fontFamily: "Inter_600SemiBold",
    letterSpacing: 3,
  },
  highScoreValue: {
    fontSize: 36,
    color: "#ffd700",
    fontFamily: "Inter_700Bold",
    textShadowColor: "#ffaa00",
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  startButton: {
    borderWidth: 1.5,
    borderColor: "#00c8ff",
    borderRadius: 30,
    paddingVertical: 14,
    paddingHorizontal: 40,
    backgroundColor: "#00c8ff18",
    marginBottom: 28,
  },
  startButtonText: {
    fontSize: 16,
    color: "#00e8ff",
    fontFamily: "Inter_700Bold",
    letterSpacing: 4,
    textShadowColor: "#00c8ff",
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 8,
  },
  instructionRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 4,
  },
  instruction: {
    fontSize: 12,
    color: "#5a8099",
    fontFamily: "Inter_400Regular",
  },
});
