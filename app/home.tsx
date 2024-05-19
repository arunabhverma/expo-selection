import React, {
  memo,
  useCallback,
  useEffect,
  useLayoutEffect,
  useState,
} from "react";
import { RefreshControl, StyleSheet } from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import Animated, {
  Extrapolation,
  interpolate,
  runOnJS,
  useAnimatedScrollHandler,
  useDerivedValue,
  useSharedValue,
} from "react-native-reanimated";
import { useNavigation } from "expo-router";
import { COLUMNS, MIDDLE_MARGIN, EDGE_MARGIN } from "@/constants";
import ListHeaderComponent from "@/components/ListHeader";
import ListFooterComponent from "@/components/ListFooter";
import FooterComponent from "@/components/Footer";
import Header from "@/components/Header";
import List from "@/components/List";
import { IMAGE_TYPE, STATE_TYPE } from "@/types";

const Home = () => {
  const navigation = useNavigation();
  const translationY = useSharedValue(-130);

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

  const [state, setState] = useState<STATE_TYPE>({
    imageData: [],
    refreshing: false,
    activeIndex: [],
    canSelect: false,
  });

  useLayoutEffect(() => {
    navigation.setOptions({
      title: "Wallpaper",
      headerRight: (props: { canGoBAck: boolean; tintColor: string }) => (
        <Header
          {...props}
          canSelect={state.canSelect}
          toggleCanSelect={() =>
            setState((prev) => ({
              ...prev,
              canSelect: !prev.canSelect,
              activeIndex: [],
            }))
          }
        />
      ),
    });
  }, [navigation, state.canSelect]);

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
    if (state.canSelect) {
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
    }
  };

  const renderItem = useCallback(
    (props: { item: IMAGE_TYPE; index: number }) => {
      return (
        <List
          {...props}
          activeImageIndex={state.activeIndex}
          selectImage={selectImage}
        />
      );
    },
    [state.activeIndex, state.canSelect]
  );

  const listFooter = useCallback(() => {
    return <ListFooterComponent imageLength={state.imageData.length} />;
  }, [state.imageData]);

  return (
    <SafeAreaView style={styles.flexOne} edges={["right", "left"]}>
      <ListHeaderComponent translationY={translationY} />
      {state.imageData?.length > 0 && (
        <Animated.FlatList
          numColumns={COLUMNS}
          onScroll={scrollHandler}
          contentInsetAdjustmentBehavior="automatic"
          ListFooterComponent={listFooter}
          data={state.imageData}
          renderItem={renderItem}
          columnWrapperStyle={styles.gap}
          contentContainerStyle={[
            styles.listContainerStyle,
            { paddingBottom: bottom },
          ]}
          keyExtractor={(val) => val.id}
          refreshControl={
            <RefreshControl
              refreshing={state.refreshing}
              onRefresh={onRefresh}
            />
          }
        />
      )}
      {state.canSelect && (
        <FooterComponent
          activeImageIndex={state.activeIndex}
          toggleImage={(id) =>
            setState((prev) => ({
              ...prev,
              activeIndex: prev.activeIndex.filter((item) => item.id !== id),
            }))
          }
        />
      )}
    </SafeAreaView>
  );
};

export default memo(Home);

const styles = StyleSheet.create({
  flexOne: {
    flex: 1,
  },
  listContainerStyle: {
    padding: EDGE_MARGIN,
    gap: MIDDLE_MARGIN,
  },
  gap: {
    gap: MIDDLE_MARGIN,
  },
});
