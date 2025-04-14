import React, { useEffect } from "react";
import { StyleSheet, View } from "react-native";
import LottieView from "lottie-react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  runOnJS,
} from "react-native-reanimated";

type SplashProps = {
  onFinish: () => void;
};

export default function SplashScreen({ onFinish }: SplashProps) {
  const opacity = useSharedValue(1);

  useEffect(() => {
    setTimeout(() => {
      opacity.value = withTiming(0, { duration: 600 }, (finished) => {
        if (finished) {
          runOnJS(onFinish)();
        }
      });
    }, 2000);
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return (
    <Animated.View style={[styles.container, animatedStyle]}>
      <LottieView
        source={require("../assets/splash-animation.json")}
        autoPlay
        speed={0.5}
        loop={false}
        style={{ width: 200, height: 200 }}
      />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "#121212",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 100,
  },
});
