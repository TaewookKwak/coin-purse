import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Linking,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import Entypo from "@expo/vector-icons/Entypo";
import Config from "react-native-config";
import * as Updates from "expo-updates";
import { useRouter } from "expo-router";
import DeviceInfo from "react-native-device-info";

export default function InfoModal() {
  const router = useRouter();
  const [isUpdateAvailable, setIsUpdateAvailable] = useState<boolean | null>(
    null
  );

  const appInfo = [
    {
      id: "version",
      title: "앱 버전",
      value: DeviceInfo.getVersion(),
      icon: "info-with-circle" as const,
    },
    {
      id: "build",
      title: "빌드 번호",
      value: "1",
      icon: "code" as const,
    },
    {
      id: "environment",
      title: "환경",
      value: Config.ENV || "development",
      icon: "globe" as const,
    },
    {
      id: "runtime",
      title: "런타임 버전",
      value: isUpdateAvailable
        ? "업데이트 있음"
        : Updates.runtimeVersion || "***",
      icon: "cog" as const,
      action: isUpdateAvailable
        ? () => {
            Updates.fetchUpdateAsync();
          }
        : undefined,
    },
  ];

  const developerInfo = [
    {
      id: "developer",
      title: "개발자",
      value: "Taewook Kwak",
      icon: "user" as const,
    },
    {
      id: "email",
      title: "이메일",
      value: "rhkrxodnr@gmail.com",
      icon: "mail" as const,
      action: () => Linking.openURL("mailto:rhkrxodnr@gmail.com"),
    },
    {
      id: "github",
      title: "GitHub",
      value: "github.com/taewookkwak",
      icon: "github" as const,
      action: () => Linking.openURL("https://github.com/taewookkwak"),
    },
  ];

  useEffect(() => {
    const checkUpdates = async () => {
      try {
        const update = await Updates.checkForUpdateAsync();

        if (update.isAvailable) {
          setIsUpdateAvailable(true);
        }
      } catch (e) {
        console.log("Update check failed", e);
      }
    };

    checkUpdates();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Entypo name="chevron-left" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.title}>앱 정보</Text>
      </View>

      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>앱 정보</Text>
          <View style={styles.infoContainer}>
            {appInfo.map((info) => (
              <TouchableOpacity
                key={info.id}
                style={styles.infoItem}
                onPress={info.action}
                disabled={!info.action}
              >
                <View style={styles.infoLeft}>
                  <View style={styles.iconContainer}>
                    <Entypo name={info.icon} size={20} color="#1e3a8a" />
                  </View>
                  <Text style={styles.infoTitle}>{info.title}</Text>
                </View>
                <Text style={styles.infoValue} numberOfLines={1}>
                  {info.value}
                </Text>
                {info.action && (
                  <Entypo name="chevron-small-right" size={20} color="#666" />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>개발자 정보</Text>
          <View style={styles.infoContainer}>
            {developerInfo.map((info) => (
              <TouchableOpacity
                key={info.id}
                style={styles.infoItem}
                onPress={info.action}
                disabled={!info.action}
              >
                <View style={styles.infoLeft}>
                  <View style={styles.iconContainer}>
                    <Entypo name={info.icon} size={20} color="#1e3a8a" />
                  </View>
                  <Text style={styles.infoTitle}>{info.title}</Text>
                </View>
                <View style={styles.infoRight}>
                  <Text
                    style={styles.infoValue}
                    numberOfLines={1}
                    ellipsizeMode="tail"
                  >
                    {info.value}
                  </Text>
                  {info.action && (
                    <Entypo name="chevron-small-right" size={20} color="#666" />
                  )}
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            동전 지갑은 간단하고 직관적인 동전 관리 앱입니다.
          </Text>
          <Text style={styles.footerText}>
            © 2025 Taewook Kwak. All rights reserved.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
    paddingHorizontal: 24,
    paddingTop: 60,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 32,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#1f1f1f",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#fff",
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 16,
    color: "#fff",
    fontWeight: "600",
    marginBottom: 16,
  },
  infoContainer: {
    gap: 12,
  },
  infoItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 12,
    borderRadius: 12,
    backgroundColor: "#1f1f1f",
    gap: 12,
  },
  infoLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#1e3a8a20",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  infoTitle: {
    fontSize: 16,
    color: "#fff",
    fontWeight: "500",
  },
  infoRight: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    width: "50%",
  },
  infoValue: {
    fontSize: 16,
    color: "#888",
    marginRight: 8,
  },
  footer: {
    marginTop: "auto",
    paddingVertical: 24,
    alignItems: "center",
  },
  footerText: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    lineHeight: 20,
  },
});
