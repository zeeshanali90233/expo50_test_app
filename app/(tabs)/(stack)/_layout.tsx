import { Stack } from "expo-router/stack";

export default function Layout() {
  return (
    <Stack
      initialRouteName="hello"
      screenOptions={{
        headerStyle: {
          backgroundColor: "#f4511e",
        },
        headerTintColor: "#fff",
        headerTitleStyle: {
          fontWeight: "bold",
        },
      }}
    >
      <Stack.Screen
        name="hello"
        options={{}}
        getId={({ params }) => String(Date.now())}
      />
      <Stack.Screen
        name="h"
        options={{}}
        getId={({ params }) => String(Date.now())}
      />
      <Stack.Screen
        name="model"
        options={{ presentation: "modal" }}
        getId={({ params }) => String(Date.now())}
      />
    </Stack>
  );
}
