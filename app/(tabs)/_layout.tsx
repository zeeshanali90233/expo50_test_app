import React, { MouseEvent, ReactNode, useEffect, useRef } from "react";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Link, Tabs } from "expo-router";
import {
  Animated,
  Pressable,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
// import Animated from "react-native-reanimated";
import { BottomTabBarButtonProps } from "@react-navigation/bottom-tabs";

import Colors from "@/constants/Colors";
import { useColorScheme } from "@/components/useColorScheme";
import { useClientOnlyValue } from "@/components/useClientOnlyValue";
import { Text } from "@/components/Themed";

// You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>["name"];
  color: string;
}) {
  return <FontAwesome size={28} style={{ marginBottom: -3 }} {...props} />;
}
interface TabBarInterface extends BottomTabBarButtonProps {
  label: string;
}

function TabBarAnimatedICON(props: TabBarInterface) {
  const isSelected = props.accessibilityState?.selected;
  const scale = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (isSelected) {
      Animated.spring(scale, {
        toValue: 1.2,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.spring(scale, {
        toValue: 1,
        useNativeDriver: true,
      }).start();
    }
  }, [isSelected]);

  return (
    <TouchableOpacity
      onPress={props.onPress}
      style={[styles.container, isSelected ? { top: -15 } : {}]}
    >
      <Animated.View
        style={
          isSelected
            ? {
                borderColor: "white",
                borderWidth: 2,
                borderRadius: 50,
                padding: 10,
              }
            : {}
        }
      >
        <TabBarIcon name="google" color="white" />
      </Animated.View>
      <Animated.Text style={[styles.text, { transform: [{ scale }] }]}>
        {props.label}
      </Animated.Text>
    </TouchableOpacity>
  );
}

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
        // Disable the static render of the header on web
        // to prevent a hydration error in React Navigation v6.
        headerShown: useClientOnlyValue(false, true),
        tabBarStyle: styles.tabBarStyle,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Tab One",
          tabBarIcon: ({ color }) => <TabBarIcon name="code" color={color} />,
          // tabBarShowLabel: false,
          tabBarButton: (props) => (
            <TabBarAnimatedICON {...props} label={"First"} />
          ),
          headerRight: () => (
            <Link href="/modal" asChild>
              <Pressable>
                {({ pressed }) => (
                  <FontAwesome
                    name="info-circle"
                    size={25}
                    color={Colors[colorScheme ?? "light"].text}
                    style={{ marginRight: 15, opacity: pressed ? 0.5 : 1 }}
                  />
                )}
              </Pressable>
            </Link>
          ),
        }}
      />
      <Tabs.Screen
        name="two"
        options={{
          title: "Tab Two",
          tabBarButton: (props) => (
            <TabBarAnimatedICON {...props} label={"Two"} />
          ),
          tabBarIcon: ({ color }) => <TabBarIcon name="code" color={color} />,
        }}
      />
      <Tabs.Screen
        name="third"
        options={{
          title: "Tab thrid",
          // tabBarShowLabel: false,
          tabBarButton: (props) => (
            <TabBarAnimatedICON {...props} label={"Third"} />
          ),
          tabBarIcon: ({ color }) => <TabBarIcon name="code" color={color} />,
        }}
      />
      <Tabs.Screen
        name="(stack)"
        options={{
          title: "Tab thrid",
          // tabBarShowLabel: false,
          tabBarButton: (props) => (
            <TabBarAnimatedICON {...props} label={"Fourth"} />
          ),
          tabBarIcon: ({ color }) => <TabBarIcon name="code" color={color} />,
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  tabBarStyle: {
    position: "absolute",
    height: 70,
    bottom: 24,
    right: 16,
    left: 16,
    borderRadius: 16,
    paddingBottom: 5,
    borderTopWidth: 1,
    backgroundColor:"rgba(50,50,12,0.5)",
  },
  btn: {
    width: 55,
    height: 55,
    borderWidth: 4,
    backgroundColor: "transparent",
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontSize: 14,
    textAlign: "center",
    color: "white",
    marginTop: 6,
    fontWeight: "500",
  },
  circle: {
    ...StyleSheet.absoluteFillObject,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#D95B43",
    borderRadius: 25,
  },
});
