import { useModal } from "@/components/modal-context";
import { ThemedView } from "@/components/ThemedView";
import { Button, ViewStyle } from "react-native";

export default function Home() {
  const { showModal } = useModal();

  const handlePress = () => {
    showModal<string>("/modal")
      .then((res) => {
        alert("Modal response " + res);
      })
      .catch((err) => {
        alert(err);
      });
  };

  return (
    <ThemedView style={container}>
      <Button title="Show Modal" onPress={handlePress}></Button>
    </ThemedView>
  );
}

const container: ViewStyle = {
  flex: 1,
  justifyContent: "center",
  alignItems: "center",
};
