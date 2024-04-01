import { Button, Text, Image } from "react-native";

import { Stack, useRouter } from "expo-router";
import React from "react";

// function LogoTitle() {
//   return (
//     <Image style={{ width: 50, height: 50 }} source={"https://expo.dev/"} />
//   );
// }
export default function Home() {
  const [count, setCount] = React.useState(0);
  const router = useRouter();
  const handleDismissAll = () => {
    router.dismissAll();
  };
  return (
    <>
      <Stack.Screen
        options={{
          //   headerTitle: (props) => <LogoTitle />,
          headerRight: () => (
            <Button
              onPress={() => {
                handleDismissAll();
                setCount((c) => c + 1);
              }}
              title="Updateffff count"
            />
          ),
        }}
      />
      <Text>Count: {count}</Text>
    </>
  );
}
