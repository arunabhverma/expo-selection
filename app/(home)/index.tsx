import React, { memo, useEffect, useState } from "react";
import {
  FlatList,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { Image } from "expo-image";
import Animated, {
  LinearTransition,
  ZoomIn,
  ZoomOut,
  useSharedValue,
} from "react-native-reanimated";

interface IMAGE_TYPE {
  author: string;
  download_url: string;
  height: number;
  id: string;
  url: string;
  width: number;
}

interface STATE_TYPE {
  imageData: IMAGE_TYPE[];
  refreshing: boolean;
  activeIndex: number[];
  isStarted: boolean;
}
const AnimatedImage = Animated.createAnimatedComponent(Image);

const Home = () => {
  const { bottom } = useSafeAreaInsets();
  const { width } = useWindowDimensions();

  const [state, setState] = useState<STATE_TYPE>({
    imageData: [],
    refreshing: false,
    activeIndex: [],
    isStarted: false,
  });

  const COLUMN_SIZE = width / 3;
  const MIDDLE_MARGIN = 5;
  const EDGE_MARGIN = 5;
  const IMAGE_SPACING = (2 * MIDDLE_MARGIN + 2 * EDGE_MARGIN) / 3;
  const IMAGE_WIDTH = COLUMN_SIZE - IMAGE_SPACING;
  const COLUMNS = 3;

  useEffect(() => {
    getImages();
  }, []);

  const onRefresh = () => {
    getImages();
  };

  const getImages = () => {
    setState((prev) => ({ ...prev, refreshing: true }));
    fetch("https://picsum.photos/v2/list?page=5&limit=50")
      .then((res) => res.json())
      .then((res) =>
        setState((prev) => ({ ...prev, imageData: res, refreshing: false }))
      );
  };

  const selectImage = (id: number) => {
    if (state.activeIndex.includes(id)) {
      setState((prev) => ({
        ...prev,
        activeIndex: prev.activeIndex.filter((i) => i !== id),
      }));
    } else {
      setState((prev) => ({
        ...prev,
        activeIndex: [...prev.activeIndex, id],
      }));
    }
  };

  const renderItem = ({ item, index }: { item: IMAGE_TYPE; index: number }) => {
    const isActive = state.activeIndex.includes(index);
    const findIndex = state.activeIndex.indexOf(index);

    return (
      <Pressable onPressIn={() => selectImage(index)}>
        <View
          style={{
            backgroundColor: "whitesmoke",
            width: IMAGE_WIDTH,
            aspectRatio: 1,
            position: "relative",
          }}
        >
          {isActive && (
            <Animated.View
              entering={ZoomIn.duration(150)}
              exiting={ZoomOut.duration(50)}
              style={{
                right: 5,
                top: 5,
                backgroundColor: "red",
                position: "absolute",
                zIndex: 1,
                minWidth: 25,
                height: 25,
                borderRadius: 50,
                borderWidth: 2,
                borderColor: "whitesmoke",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text style={{ color: "white", fontSize: 13, fontWeight: "500" }}>
                {findIndex + 1}
              </Text>
            </Animated.View>
          )}
          <AnimatedImage
            layout={LinearTransition.duration(150)}
            source={{ uri: item.download_url }}
            contentFit={"cover"}
            style={{
              width: IMAGE_WIDTH,
              aspectRatio: 1,
              flex: 1,
              margin: isActive ? 15 : 0,
              borderRadius: isActive ? 10 : 0,
            }}
          />
        </View>
      </Pressable>
    );
  };

  return (
    <SafeAreaView style={{ flex: 1 }} edges={["right", "left"]}>
      <FlatList
        numColumns={COLUMNS}
        data={state.imageData}
        renderItem={renderItem}
        columnWrapperStyle={{ gap: MIDDLE_MARGIN }}
        contentContainerStyle={{
          padding: EDGE_MARGIN,
          paddingBottom: bottom,
          gap: MIDDLE_MARGIN,
        }}
        keyExtractor={(val) => val.id}
        refreshControl={
          <RefreshControl refreshing={state.refreshing} onRefresh={onRefresh} />
        }
      />
    </SafeAreaView>
  );
};

export default memo(Home);

const styles = StyleSheet.create({
  containerStyle: {},
});
