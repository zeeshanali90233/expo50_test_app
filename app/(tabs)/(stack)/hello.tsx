import { Button, Text, Image, StyleSheet, AppState } from "react-native";

import { Link, Stack, useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import { View } from "@/components/Themed";
import { useAuth } from "@clerk/clerk-expo";

// function LogoTitle() {
//   return (
//     <Image style={{ width: 50, height: 50 }} source={"https://expo.dev/"} />
//   );
// }
export default function Home() {
  const [count, setCount] = React.useState(0);
  const router = useRouter();
  const isSignedIn = useAuth();
  const appState = useRef(AppState.currentState);
  const [appStateVisible, setAppStateVisible] = useState(appState.current);

  useEffect(() => {
    const subscription = AppState.addEventListener("change", (nextAppState) => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === "active"
      ) {
        console.log("App has come to the foreground!");
      }

      appState.current = nextAppState;
      setAppStateVisible(appState.current);
      console.log("AppState", appState.current);
    });

    return () => {
      subscription.remove();
    };
  }, []);
  console.log(isSignedIn);
  return (
    <View style={styles.container}>
      <Text>Current state is: {appStateVisible}</Text>
      <Stack.Screen
        options={{
          //   headerTitle: (props) => <LogoTitle />,
          headerRight: () => (
            <Button
              onPress={() => {
                router.push("/h");
                setCount((c) => c + 1);
              }}
              title="Update count"
            />
          ),
        }}
      />

      <Link href="/modal">Present modal</Link>
      <Text>Count: {count}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "red",
  },
});
