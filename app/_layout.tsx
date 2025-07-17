import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { Stack } from "expo-router";
import * as SplashScreenApi from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import "react-native-reanimated";
import LoopSplashScreen from "@/components/loop-splash-screen";
import SplashScreen from "@/components/splash-screen";
import { useCheckStoreVersion } from "@/hooks/useCheckStoreVersion";
import { useColorScheme } from "@/hooks/useColorScheme";
import * as Updates from "expo-updates";
import { View } from "react-native";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreenApi.preventAutoHideAsync();

function RootLayout() {
  const colorScheme = useColorScheme();
  const [showSplash, setShowSplash] = useState(false);
  const mustUpdate = useCheckStoreVersion();

  useEffect(() => {
    SplashScreenApi.hideAsync().then(() => {
      setShowSplash(true);
    });
  }, []);

  useEffect(() => {
    const checkUpdates = async () => {
      try {
        const update = await Updates.checkForUpdateAsync();

        if (update.isAvailable) {
          await Updates.fetchUpdateAsync();
        }
      } catch (e) {
        console.log("Update check failed", e);
      }
    };

    checkUpdates();
  }, []);

  if (mustUpdate) {
    return <LoopSplashScreen />;
  } else if (showSplash) {
    return (
      <View style={{ flex: 1, backgroundColor: "#000000" }}>
        <SplashScreen onFinish={() => setShowSplash(false)} />
      </View>
    );
  }

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <View style={{ flex: 1, backgroundColor: "#000000" }}>
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
            name="(modals)/currency-modal"
            options={{
              presentation: "card",
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="(modals)/reset-modal"
            options={{
              presentation: "card",
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="(modals)/info-modal"
            options={{
              presentation: "card",
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="(modals)/history-modal"
            options={{
              presentation: "modal",
              headerShown: false,
            }}
          />
        </Stack>

        <StatusBar style="auto" />
      </View>
    </ThemeProvider>
  );
}

export default RootLayout;

// export default CodePush({
//   checkFrequency: CodePush.CheckFrequency.ON_APP_RESUME,
// })(RootLayout);
