import { MIDDLE_MARGIN } from "@/constants";
import { useTheme } from "@react-navigation/native";
import { Text, View } from "react-native";

const ListFooterComponent = ({ imageLength }: { imageLength: number }) => {
  const theme = useTheme();
  return (
    <View
      style={{
        justifyContent: "center",
        alignItems: "center",
        paddingVertical: 2 * MIDDLE_MARGIN,
      }}
    >
      <Text
        style={{
          textAlign: "center",
          color: theme.colors.text,
          fontSize: 13,
          fontWeight: "600",
        }}
      >
        {imageLength} Wallpapers
      </Text>
    </View>
  );
};

export default ListFooterComponent;
