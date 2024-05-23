import React, { useEffect, useRef, useState } from "react";
import { LayoutChangeEvent, Pressable, StyleSheet } from "react-native";
import { useTheme } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Animated, {
  FadeIn,
  FadeOut,
  LinearTransition,
  ZoomOut,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { IMAGE_TYPE } from "@/types";
import { LinearGradient } from "expo-linear-gradient";
import { Image } from "expo-image";

const ITEM_GAP = 10;
const CONTAINER_MARGIN = 20;
const BORDER_RADIUS = 10;

const FooterComponent = ({
  activeImageIndex,
  toggleImage,
}: {
  activeImageIndex: IMAGE_TYPE[];
  toggleImage: (item: string) => void;
}) => {
  const scrollViewRef = useRef<Animated.ScrollView | null>(null);
  const previousContentWidth = useRef(0);
  const itemWidth = useSharedValue(0);
  const { colors } = useTheme();
  const { bottom } = useSafeAreaInsets();
  const scrollViewPadding = useSharedValue(10);
  const [data, setData] = useState<IMAGE_TYPE[]>([]);

  useEffect(() => {
    if (data.length !== activeImageIndex.length) {
      setData(activeImageIndex);
      if (data.length > activeImageIndex.length) {
        scrollViewPadding.value += itemWidth.value + ITEM_GAP;
      }
    }
  }, [activeImageIndex]);

  useEffect(() => {
    scrollViewPadding.value = withTiming(10);
  }, [data]);

  const onLayout = (e: LayoutChangeEvent) => {
    const { width } = e.nativeEvent.layout;
    itemWidth.value = width;
  };

  const animatedPadding = useAnimatedStyle(() => ({
    marginRight: scrollViewPadding.value,
  }));

  return (
    <Animated.View
      layout={LinearTransition.duration(300)}
      style={[styles.mainContainer, { paddingBottom: bottom }]}
      entering={FadeIn}
      exiting={FadeOut}
    >
      <LinearGradient
        colors={["transparent", "rgba(0,0,0,0.8)"]}
        style={StyleSheet.absoluteFill}
      />
      <Animated.ScrollView
        ref={scrollViewRef}
        layout={LinearTransition}
        showsHorizontalScrollIndicator={false}
        onContentSizeChange={(contentWidth) => {
          if (contentWidth > previousContentWidth.current) {
            scrollViewRef.current?.scrollToEnd({ animated: true });
          }
          previousContentWidth.current = contentWidth;
        }}
        horizontal
        contentContainerStyle={styles.flexGrow}
      >
        <Animated.View
          layout={LinearTransition}
          style={[styles.rowContainer, animatedPadding]}
        >
          {data.map((item) => (
            <Animated.View
              key={item.id}
              entering={FadeIn}
              exiting={ZoomOut}
              layout={LinearTransition}
              onLayout={onLayout}
            >
              <Pressable onPress={() => toggleImage(item.id)}>
                <Image
                  source={{ uri: item.download_url }}
                  style={[styles.imageStyle, { borderColor: colors.border }]}
                />
              </Pressable>
            </Animated.View>
          ))}
        </Animated.View>
      </Animated.ScrollView>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    zIndex: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.51,
    shadowRadius: 13.16,
    elevation: 20,
  },
  flexGrow: {
    flexGrow: 1,
  },
  rowContainer: {
    gap: ITEM_GAP,
    margin: CONTAINER_MARGIN,
    flexDirection: "row",
  },
  imageStyle: {
    width: 50,
    aspectRatio: 1,
    borderWidth: 1,
    borderRadius: BORDER_RADIUS,
  },
});

export default FooterComponent;
