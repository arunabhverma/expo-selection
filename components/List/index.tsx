import { IMAGE_WIDTH } from "@/constants";
import { IMAGE_TYPE, LIST_PROPS } from "@/types";
import { useTheme } from "@react-navigation/native";
import { Image } from "expo-image";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Animated, {
  LinearTransition,
  ZoomIn,
  ZoomOut,
} from "react-native-reanimated";

const AnimatedImage = Animated.createAnimatedComponent(Image);

const List = ({ item, selectImage, activeImageIndex }: LIST_PROPS) => {
  const theme = useTheme();
  const isActive = activeImageIndex.includes(item);
  const findIndex = activeImageIndex.indexOf(item);

  return (
    <Pressable onPress={() => selectImage(item)}>
      <View
        style={[styles.itemContainer, { backgroundColor: theme.colors.border }]}
      >
        {isActive && (
          <Animated.View
            entering={ZoomIn.duration(150)}
            exiting={ZoomOut.duration(50)}
            style={[styles.closeIcon, { borderColor: theme.colors.border }]}
          >
            <Text style={[styles.numberStyle, { color: theme.colors.border }]}>
              {findIndex + 1}
            </Text>
          </Animated.View>
        )}
        <AnimatedImage
          layout={LinearTransition.duration(150)}
          source={{ uri: item.download_url }}
          contentFit={"cover"}
          style={[
            styles.imageStyle,
            {
              margin: isActive ? 15 : 0,
              borderRadius: isActive ? 10 : 0,
            },
          ]}
        />
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  itemContainer: {
    aspectRatio: 1,
    position: "relative",
    width: IMAGE_WIDTH,
  },
  closeIcon: {
    right: 5,
    top: 5,
    backgroundColor: "dodgerblue",
    position: "absolute",
    zIndex: 1,
    minWidth: 25,
    height: 25,
    borderRadius: 50,
    borderWidth: 2,
    justifyContent: "center",
    alignItems: "center",
  },
  numberStyle: {
    fontSize: 13,
    fontWeight: "500",
  },
  imageStyle: {
    width: IMAGE_WIDTH,
    aspectRatio: 1,
    flex: 1,
  },
});

export default List;
