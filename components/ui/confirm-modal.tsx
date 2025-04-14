// components/ConfirmModal.tsx
import React from "react";
import { Modal, View, Text, StyleSheet, TouchableOpacity } from "react-native";

interface Props {
  visible: boolean;
  title: string;
  confirmText?: string;
  cancelText?: string;
  onCancel: () => void;
  onConfirm: () => void;
  children?: React.ReactNode;
}

export default function ConfirmModal({
  visible,
  title,
  confirmText = "확인",
  cancelText = "취소",
  onCancel,
  onConfirm,
  children,
}: Props) {
  return (
    <Modal visible={visible} animationType="fade" transparent>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>{title}</Text>

          <View style={{ marginTop: 12 }}>{children}</View>

          <View style={styles.modalButtonRow}>
            <TouchableOpacity
              style={[styles.modalButton, styles.modalCancel]}
              onPress={onCancel}
            >
              <Text style={styles.modalButtonText}>{cancelText}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.modalButton, styles.modalConfirm]}
              onPress={onConfirm}
            >
              <Text style={styles.modalButtonText}>{confirmText}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  modalContent: {
    backgroundColor: "#1f1f1f",
    borderRadius: 16,
    padding: 24,
    width: "100%",
    maxHeight: "80%",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
  },
  modalButtonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 24,
    gap: 12,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
  },
  modalConfirm: {
    backgroundColor: "#1e3a8a",
  },
  modalCancel: {
    backgroundColor: "#333",
  },
  modalButtonText: {
    color: "#fff",
    fontSize: 16,
  },
});
