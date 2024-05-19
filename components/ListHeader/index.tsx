import { useHeaderHeight } from "@react-navigation/elements";
import { LinearGradient } from "expo-linear-gradient";
import Animated, {
  Extrapolation,
  SharedValue,
  interpolate,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";

const ListHeaderComponent = ({
  translationY,
}: {
  translationY: SharedValue<T>;
}) => {
  const headerSize = useHeaderHeight();
  const animatedStyle = useAnimatedStyle(() => {
    let translateValue = interpolate(
      translationY.value,
      [-125, -130],
      [1, 0],
      Extrapolation.CLAMP
    );
    return {
      opacity: withTiming(translateValue),
    };
  });

  return (
    <Animated.View
      pointerEvents={"none"}
      style={[
        {
          pointerEvents: "none",
          width: "100%",
          height: 2 * headerSize,
          position: "absolute",
          zIndex: 1,
        },
        animatedStyle,
      ]}
    >
      <LinearGradient
        colors={["rgba(0,0,0,0.8)", "transparent"]}
        style={{ flex: 1, height: 2 * headerSize }}
      />
    </Animated.View>
  );
};

export default ListHeaderComponent;
