import { useModal } from "@/components/modal-context";
import { ThemedView } from "@/components/ThemedView";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Button, TextInput, ViewStyle } from "react-native";

export default function Modal() {
  const router = useRouter();

  const [text, setText] = useState("");
  const { resolveModal, rejectModal } = useModal();

  const params = useLocalSearchParams<{ modalId: string }>();

  const handleClose = () => {
    if (router.canGoBack()) {
      router.back();
    }

    if (params.modalId) {
      rejectModal(params.modalId);
    }
  };

  const handleResolve = () => {
    if (params.modalId) resolveModal(params.modalId, text);
  };

  useEffect(() => {
    return () => {
      if (params.modalId) {
        rejectModal(params.modalId);
      }
    };
  }, []);

  return (
    <ThemedView style={container}>
      <TextInput onChangeText={setText} placeholder="Set Text" />
      <Button title="Resolve Modal" onPress={handleResolve}></Button>
      <Button title="Close" onPress={handleClose}></Button>
    </ThemedView>
  );
}

const container: ViewStyle = {
  flex: 1,
  justifyContent: "center",
  alignItems: "center",
  gap: 16,
};
