// components/RollingNumber.tsx
import React, { useEffect } from "react";
import { View, StyleSheet, Text } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  interpolate,
  Easing,
  withSpring,
} from "react-native-reanimated";

interface RollingDigitProps {
  digit: number;
  duration: number;
  fontSize: number;
  color: string;
}

function RollingDigit({ digit, duration, fontSize, color }: RollingDigitProps) {
  const animatedValue = useSharedValue(0);

  useEffect(() => {
    animatedValue.value = withTiming(digit, {
      duration,
      easing: Easing.out(Easing.cubic),
    });
  }, [digit]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: interpolate(
            animatedValue.value,
            [0, 9],
            [0, -9 * fontSize * 1.2]
          ),
        },
      ],
    };
  });

  const digits = Array.from({ length: 10 }, (_, i) => i);

  return (
    <View
      style={{
        height: fontSize * 1.2,
        overflow: "hidden",
        width: fontSize * 0.65,
      }}
    >
      <Animated.View style={animatedStyle}>
        {digits.map((num) => (
          <View key={num} style={{ height: fontSize * 1.2 }}>
            <Animated.Text
              style={{
                fontSize,
                color,
                textAlign: "center",
                fontWeight: "bold",
              }}
            >
              {num}
            </Animated.Text>
          </View>
        ))}
      </Animated.View>
    </View>
  );
}

interface RollingNumberProps {
  value: number;
  duration?: number;
  fontSize?: number;
  color?: string;
  currencySymbol?: string;
  showComma?: boolean;
}

export default function RollingNumber({
  value,
  duration = 800,
  fontSize = 40,
  color = "#fff",
  currencySymbol = "",
  showComma = true,
}: RollingNumberProps) {
  const formatted = showComma
    ? value.toLocaleString().split("") // 쉼표 포함
    : value.toString().split(""); // 쉼표 미포함

  return (
    <View style={styles.container}>
      {currencySymbol ? (
        <Text style={[styles.symbol, { fontSize, color }]}>
          {currencySymbol}
        </Text>
      ) : null}

      {formatted.map((char, index) => {
        if (char === ",") {
          return (
            <Text
              key={`comma-${index}`}
              style={[styles.comma, { fontSize: fontSize * 0.8, color }]}
            >
              ,
            </Text>
          );
        }
        return (
          <RollingDigit
            key={`digit-${index}`}
            digit={parseInt(char)} // 문자열을 숫자로 변환
            duration={duration}
            fontSize={fontSize}
            color={color}
          />
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
  },
  symbol: {
    marginRight: 4,
    fontWeight: "bold",
  },
  comma: {
    paddingHorizontal: 2,
  },
});
