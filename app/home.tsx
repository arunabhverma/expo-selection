import React, { memo, useEffect, useLayoutEffect, useState } from "react";
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
import { LinearGradient } from "expo-linear-gradient";
import { Image } from "expo-image";
import Animated, {
  Extrapolation,
  LinearTransition,
  ZoomIn,
  ZoomOut,
  interpolate,
  runOnJS,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import {
  useNavigation,
  useNavigationContainerRef,
  useRootNavigation,
} from "expo-router";
import { useRoute } from "@react-navigation/native";
import { useHeaderHeight } from "@react-navigation/elements";

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
  const headerSize = useHeaderHeight();
  console.log("headerSize", headerSize);
  const navigation = useNavigation();
  const translationY = useSharedValue(-130);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: "Wallpaper",
    });
  }, [navigation]);

  const toggleHeader = (isZero: boolean) => {
    if (isZero) {
      navigation.setOptions({
        headerTintColor: undefined,
      });
    } else {
      navigation.setOptions({
        headerTintColor: "white",
      });
    }
  };

  useDerivedValue(() => {
    let translateValue = interpolate(
      translationY.value,
      [-125, -130],
      [1, 0],
      Extrapolation.CLAMP
    );
    if (translateValue === 0) {
      runOnJS(toggleHeader)(true);
    } else {
      runOnJS(toggleHeader)(false);
    }
  }, []);

  const scrollHandler = useAnimatedScrollHandler((event) => {
    translationY.value = event.contentOffset.y;
  });
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
  const EDGE_MARGIN = 0;
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
    fetch("https://picsum.photos/v2/list?page=10&limit=100")
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
      <Pressable onPress={() => selectImage(index)}>
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
                backgroundColor: "dodgerblue",
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

  const animatedStyle = useAnimatedStyle(() => {
    let translateValue = interpolate(
      translationY.value,
      [-125, -130],
      [0.8, 0],
      Extrapolation.CLAMP
    );
    return {
      opacity: withTiming(translateValue),
    };
  });

  const ListHeaderComponent = () => {
    let translateValue = interpolate(
      translationY.value,
      [-125, -130],
      [0.5, 0],
      Extrapolation.CLAMP
    );
    return (
      <Animated.View
        layout={LinearTransition.springify()}
        style={[
          {
            width: "100%",
            height: headerSize,
            position: "absolute",
            zIndex: 1,
          },
          animatedStyle,
        ]}
      >
        <LinearGradient
          colors={["rgba(0,0,0,0.8)", "transparent"]}
          style={{ flex: 1, height: headerSize }}
        />
      </Animated.View>
    );
  };

  return (
    <SafeAreaView style={{ flex: 1 }} edges={["right", "left"]}>
      <ListHeaderComponent />
      {state.imageData?.length > 0 && (
        <Animated.FlatList
          numColumns={COLUMNS}
          onScroll={scrollHandler}
          contentInsetAdjustmentBehavior="automatic"
          data={state.imageData}
          renderItem={renderItem}
          columnWrapperStyle={{ gap: MIDDLE_MARGIN }}
          contentContainerStyle={{
            padding: EDGE_MARGIN,
            paddingBottom: bottom,
            gap: MIDDLE_MARGIN,
          }}
          keyExtractor={(val) => val.id}
          // refreshControl={
          //   <RefreshControl refreshing={state.refreshing} onRefresh={onRefresh} />
          // }
        />
      )}
    </SafeAreaView>
  );
};

export default memo(Home);

const styles = StyleSheet.create({
  containerStyle: {},
});
