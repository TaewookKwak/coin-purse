import { useEffect, useState } from "react";
import { Platform, Alert, Linking } from "react-native";
import DeviceInfo from "react-native-device-info";
import Config from "react-native-config";
import versionCompare from "@/utils/versionCompare";

interface AppVersionRow {
  platform: string;
  latest_version: string;
  min_supported_version: string;
  force_update: boolean;
  release_notes?: string;
}

const STORE_URL = "https://github.com/taewookkwak"; // TODO: 실제 스토어 URL로 변경

async function fetchAppVersion(
  platform: string
): Promise<AppVersionRow | null> {
  const url = `https://${Config.SUPABASE_PROJECT_ID}.supabase.co/rest/v1/app_versions?platform=eq.${platform}&select=*`;
  const headers = new Headers({
    apikey: Config.SUPABASE_ANON_KEY || "",
    Authorization: `Bearer ${Config.SUPABASE_ANON_KEY || ""}`,
  });
  try {
    const res = await fetch(url, { headers });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data: AppVersionRow[] = await res.json();
    return data.find((row) => row.platform === platform) || null;
  } catch (e) {
    console.log("버전 정보 fetch 실패", e);
    return null;
  }
}

function showUpdateAlert(
  currentVersion: string,
  latestVersion: string,
  releaseNotes?: string
) {
  Alert.alert(
    "업데이트 필요",
    `현재 버전(${currentVersion})에서 계속 사용하려면 최신 버전(${latestVersion})으로 업데이트해야 합니다.\n\n${
      releaseNotes || ""
    }`,
    [
      {
        text: "업데이트 하기",
        onPress: () => {
          Linking.openURL(STORE_URL);
        },
      },
    ],
    { cancelable: false }
  );
}

export function useCheckStoreVersion(): boolean {
  const [mustUpdate, setMustUpdate] = useState(false);
  useEffect(() => {
    const checkStoreVersion = async () => {
      const platform = Platform.OS === "ios" ? "ios" : "android";
      const versionInfo = await fetchAppVersion(platform);
      if (!versionInfo) return;
      const { latest_version, force_update, release_notes } = versionInfo;
      const currentVersion = DeviceInfo.getVersion();
      const needsUpdate = versionCompare(currentVersion, latest_version) < 0;
      console.log("needsUpdate", needsUpdate, force_update);
      if (needsUpdate) {
        setMustUpdate(true);
        showUpdateAlert(currentVersion, latest_version, release_notes);
      }
    };
    checkStoreVersion();
  }, []);
  return mustUpdate;
}
