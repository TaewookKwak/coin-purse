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

import SplashScreen from "@/components/splash-screen";
import { useColorScheme } from "@/hooks/useColorScheme";
import * as Updates from "expo-updates";
import { Alert, Linking, View } from "react-native";
import DeviceInfo from "react-native-device-info";
import versionCompare from "@/utils/versionCompare";
import LoopSplashScreen from "@/components/loop-splash-screen";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreenApi.preventAutoHideAsync();

function RootLayout() {
  const colorScheme = useColorScheme();
  const [showSplash, setShowSplash] = useState(false);
  const [mustUpdate, setMustUpdate] = useState(false);

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

  useEffect(() => {
    const checkStoreVersion = async () => {
      try {
        // const res = await fetch("https://example.com/version"); // 버전 정보 API
        // const { latestVersion, forceUpdate, storeUrl } = await res.json();

        const latestVersion = "1.0.0";
        const storeUrl = "https://github.com/taewookkwak";
        const forceUpdate = true;

        const currentVersion = DeviceInfo.getVersion(); // e.g., "1.0.1"

        const needsUpdate = versionCompare(currentVersion, latestVersion) < 0;

        if (needsUpdate && forceUpdate) {
          setMustUpdate(true);

          Alert.alert(
            "업데이트 필요",
            `현재 버전(${currentVersion})에서 계속 사용하려면 최신 버전(${latestVersion})으로 업데이트해야 합니다.`,
            [
              {
                text: "업데이트 하기",
                onPress: () => {
                  Linking.openURL(storeUrl);
                },
              },
            ],
            { cancelable: false }
          );
        }
      } catch (e) {
        console.log("버전 체크 실패", e);
      }
    };

    checkStoreVersion();
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
