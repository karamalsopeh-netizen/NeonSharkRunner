import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Image,
  Dimensions,
} from "react-native";

interface NBBSplashProps {
  onFinish: () => void;
}

export default function NBBSplash({ onFinish }: NBBSplashProps) {
  const logoScale = useRef(new Animated.Value(0.6)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const textOpacity = useRef(new Animated.Value(0)).current;
  const taglineOpacity = useRef(new Animated.Value(0)).current;
  const screenOpacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Logo appears first
    Animated.parallel([
      Animated.timing(logoOpacity, {
        toValue: 1,
        duration: 600,
        useNativeDriver: false,
      }),
      Animated.timing(logoScale, {
        toValue: 1,
        duration: 700,
        useNativeDriver: false,
      }),
    ]).start(() => {
      // Then brand name fades in
      Animated.timing(textOpacity, {
        toValue: 1,
        duration: 500,
        useNativeDriver: false,
      }).start(() => {
        // Then tagline
        Animated.timing(taglineOpacity, {
          toValue: 1,
          duration: 400,
          useNativeDriver: false,
        }).start(() => {
          // Hold for a moment, then fade out the whole screen
          setTimeout(() => {
            Animated.timing(screenOpacity, {
              toValue: 0,
              duration: 600,
              useNativeDriver: false,
            }).start(() => {
              onFinish();
            });
          }, 900);
        });
      });
    });
  }, []);

  return (
    <Animated.View style={[styles.container, { opacity: screenOpacity }]}>
      <View style={styles.content}>
        {/* Logo */}
        <Animated.View
          style={[
            styles.logoWrapper,
            {
              opacity: logoOpacity,
              transform: [{ scale: logoScale }],
            },
          ]}
        >
          <Image
            source={require("../assets/images/nbb-logo.png")}
            style={styles.logo}
            resizeMode="contain"
          />
        </Animated.View>

        {/* Brand name */}
        <Animated.View style={{ opacity: textOpacity }}>
          <Text style={styles.brandTop}>NBB</Text>
          <Text style={styles.brandBottom}>GAMES</Text>
          <Text style={styles.trademark}>™</Text>
        </Animated.View>

        {/* Tagline */}
        <Animated.View style={[styles.taglineContainer, { opacity: taglineOpacity }]}>
          <View style={styles.divider} />
          <Text style={styles.tagline}>PRESENTS</Text>
        </Animated.View>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "#0a0000",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 999,
  },
  content: {
    alignItems: "center",
  },
  logoWrapper: {
    marginBottom: 20,
  },
  logo: {
    width: 100,
    height: 100,
  },
  brandTop: {
    fontSize: 58,
    fontFamily: "Inter_700Bold",
    color: "#8b0000",
    letterSpacing: 6,
    textAlign: "center",
    lineHeight: 62,
  },
  brandBottom: {
    fontSize: 44,
    fontFamily: "Inter_700Bold",
    color: "#cc0000",
    letterSpacing: 4,
    textAlign: "center",
    lineHeight: 48,
  },
  trademark: {
    fontSize: 14,
    fontFamily: "Inter_400Regular",
    color: "#cc000088",
    textAlign: "right",
    marginTop: -4,
  },
  taglineContainer: {
    alignItems: "center",
    marginTop: 20,
  },
  divider: {
    width: 60,
    height: 1,
    backgroundColor: "#8b000066",
    marginBottom: 12,
  },
  tagline: {
    fontSize: 12,
    fontFamily: "Inter_400Regular",
    color: "#8b0000aa",
    letterSpacing: 8,
  },
});
