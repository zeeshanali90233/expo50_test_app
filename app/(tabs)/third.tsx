import { Text, View } from "@/components/Themed";
import React from "react";
import { StyleSheet } from "react-native";


const third = () => {
  return (
    <View style={styles.container}>
      <Text>Hello</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "red",
  },
});
export default third;
