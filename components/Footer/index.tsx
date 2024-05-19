import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
  useColorScheme,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Animated, {
  FadeIn,
  FadeOut,
  LinearTransition,
  SlideInDown,
  SlideInLeft,
  SlideOutDown,
  ZoomIn,
  ZoomOut,
} from "react-native-reanimated";
import { BlurView } from "expo-blur";
import { IMAGE_TYPE } from "@/types";
import { LinearGradient } from "expo-linear-gradient";

const FooterComponent = ({
  activeImageIndex,
  toggleImage,
}: {
  activeImageIndex: IMAGE_TYPE[];
}) => {
  const theme = useTheme();
  const tint = useColorScheme();
  const { bottom } = useSafeAreaInsets();

  return (
    <Animated.View
      layout={LinearTransition.duration(300)}
      style={[styles.mainContainer, { paddingBottom: bottom }]}
      entering={FadeIn}
      exiting={FadeOut}
    >
      <BlurView
        tint={tint === "light" ? "systemMaterialLight" : "systemMaterialDark"}
        intensity={100}
        style={StyleSheet.absoluteFill}
      />
      <View style={styles.container}>
        <View style={[styles.containerPart, styles.left]}>
          <Pressable>
            <Ionicons
              name="share-outline"
              size={24}
              color={
                activeImageIndex.length > 0
                  ? theme.colors.primary
                  : "rgba(100, 100, 100 , 0.6)"
              }
            />
          </Pressable>
        </View>
        <View style={styles.middle}>
          <Text style={[styles.countText, { color: theme.colors.text }]}>
            {activeImageIndex?.length > 0
              ? `${activeImageIndex.length} Photo Selected`
              : "Select Items"}
          </Text>
        </View>
        <View style={[styles.containerPart, styles.right]}>
          <Pressable>
            <Ionicons
              name="trash-outline"
              size={24}
              color={
                activeImageIndex.length > 0
                  ? theme.colors.primary
                  : "rgba(100, 100, 100 , 0.5)"
              }
            />
          </Pressable>
          <Pressable>
            <Ionicons
              name="ellipsis-horizontal-circle"
              size={24}
              color={
                activeImageIndex.length > 0
                  ? theme.colors.primary
                  : "rgba(100, 100, 100 , 0.5)"
              }
            />
          </Pressable>
        </View>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    zIndex: 10,

    // shadowColor: "#000",
    // shadowOffset: {
    //   width: 0,
    //   height: 10,
    // },
    // shadowOpacity: 0.51,
    // shadowRadius: 13.16,

    // elevation: 20,
  },
  container: {
    flexDirection: "row",
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  containerPart: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  left: {
    justifyContent: "flex-start",
  },
  right: {
    justifyContent: "flex-end",
  },
  middle: {
    flex: 2,
    justifyContent: "center",
  },
  countText: {
    fontSize: 15,
    textAlign: "center",
  },
});

export default FooterComponent;
