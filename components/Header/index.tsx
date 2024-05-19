import React, { useState } from "react";
import {
  Pressable,
  StyleSheet,
  View,
  Text,
  ViewStyle,
  useColorScheme,
  useWindowDimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import Animated, {
  FadeIn,
  FadeOut,
  LinearTransition,
} from "react-native-reanimated";
import { HEADER_PROPS } from "@/types";

const HeaderButton = ({
  containerStyle,
  children,
  onPress,
}: {
  containerStyle?: ViewStyle;
  children: React.ReactNode;
  onPress?: () => void;
}) => {
  const tint = useColorScheme() || undefined;
  return (
    <Pressable onPress={onPress}>
      <View style={containerStyle || {}}>
        <BlurView tint={tint} intensity={100} style={StyleSheet.absoluteFill} />
        {children}
      </View>
    </Pressable>
  );
};

const Header = ({ tintColor, canSelect, toggleCanSelect }: HEADER_PROPS) => {
  const { width } = useWindowDimensions();
  return (
    <View
      style={{
        width: width / 2,
      }}
    >
      <Animated.View
        layout={LinearTransition.duration(300)}
        style={styles.headerContainer}
      >
        <Animated.View
          layout={LinearTransition.duration(300)}
          entering={FadeIn}
          exiting={FadeOut}
          style={styles.elevation}
        >
          <HeaderButton
            onPress={() => toggleCanSelect()}
            containerStyle={styles.headerButtonContainer}
          >
            <Text style={[styles.text, { color: tintColor }]}>
              {canSelect ? "Cancel" : "Select"}
            </Text>
          </HeaderButton>
        </Animated.View>
        {!canSelect && (
          <Animated.View
            layout={LinearTransition.duration(300)}
            entering={FadeIn.delay(100)}
            exiting={FadeOut}
          >
            <HeaderButton containerStyle={styles.buttonContainer}>
              <Ionicons
                name="ellipsis-horizontal"
                size={20}
                color={tintColor}
              />
            </HeaderButton>
          </Animated.View>
        )}
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: "row",
    gap: 5,
    justifyContent: "flex-end",
    alignItems: "center",
  },
  elevation: {
    zIndex: 1,
  },
  headerButtonContainer: {
    backgroundColor: "rgba(100, 100, 100, 0.2)",
    borderRadius: 20,
    overflow: "hidden",
    height: 28,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 10,
  },
  buttonContainer: {
    backgroundColor: "rgba(100, 100, 100, 0.2)",
    borderRadius: 20,
    overflow: "hidden",
    height: 28,
    aspectRatio: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontSize: 14,
    fontWeight: "500",
  },
});

export default Header;
