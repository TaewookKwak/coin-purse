import { View } from "react-native";

export default function LayoutWithTabPadding({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <View style={{ flex: 1, paddingBottom: 60, backgroundColor: "#121212" }}>
      {children}
    </View>
  );
}
