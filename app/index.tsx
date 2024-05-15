import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { Link } from "expo-router";
import { useTheme } from "@react-navigation/native";

const Home = () => {
  const theme = useTheme();
  return (
    <View style={styles.container}>
      <Link style={{ color: theme.colors.text }} href={"/home"}>
        Album
      </Link>
      <Text style={{ color: theme.colors.text }}>Home</Text>
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
