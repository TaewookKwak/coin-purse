import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreenApi from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import "react-native-reanimated";

import SplashScreen from "@/components/splash-screen";
import { useColorScheme } from "@/hooks/useColorScheme";
import CodePush from "@revopush/react-native-code-push";
import { View } from "react-native";
import Config from "react-native-config";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreenApi.preventAutoHideAsync();

function RootLayout() {
  console.log("🔑 CodePush Key:", Config.CODEPUSH_KEY);
  const colorScheme = useColorScheme();
  const [showSplash, setShowSplash] = useState(false);

  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  useEffect(() => {
    CodePush.sync({
      updateDialog: true,
      installMode: CodePush.InstallMode.IMMEDIATE,
    });
  }, []);

  useEffect(() => {
    if (loaded) {
      SplashScreenApi.hideAsync().then(() => {
        setShowSplash(true);
      });
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <View style={{ flex: 1, backgroundColor: "#000000" }}>
        {showSplash ? (
          <SplashScreen onFinish={() => setShowSplash(false)} />
        ) : (
          <>
            <Stack
              screenOptions={{
                contentStyle: {
                  backgroundColor: "#121212", // 화면 전환시 배경색
                },
              }}
            >
              {/* 스크린*/}
              <Stack.Screen
                name="(tabs)"
                options={{
                  headerShown: false,
                }}
              />
              <Stack.Screen name="+not-found" />

              {/* 모달 */}
              <Stack.Screen
                name="(modals)/history-modal"
                options={{
                  presentation: "modal",
                  headerShown: false,
                }}
              />
            </Stack>

            <StatusBar style="auto" />
          </>
        )}
      </View>
    </ThemeProvider>
  );
}

export default CodePush({
  checkFrequency: CodePush.CheckFrequency.ON_APP_RESUME,
})(RootLayout);
