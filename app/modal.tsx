import React, { useEffect, useRef, useState } from "react";
import * as WebBrowser from "expo-web-browser";
import {
  Button,
  FlatList,
  Keyboard,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { useOAuth } from "@clerk/clerk-expo";
import { useWarmUpBrowser } from "@/hooks/useWarnBrowser";
import BackgroundService from "react-native-background-actions";
import * as Location from "expo-location";

import * as BackgroundFetch from "expo-background-fetch";
import * as TaskManager from "expo-task-manager";
import { BlurView } from "expo-blur";
import { onValue, push, ref, serverTimestamp } from "firebase/database";
import { db } from "@/firebase/config";
import { View, Text, StatusBar } from "react-native";
import { FlashList } from "@shopify/flash-list";

const BACKGROUND_FETCH_TASK = "background-fetch";

WebBrowser.maybeCompleteAuthSession();
interface LocationData {
  locations: Array<{
    coords: { latitude: number; longitude: number };
  }>;
}
const SignInWithOAuth = () => {
  const LOCATION_TASK_NAME = "background-location-task";
  const [loactionDetail, setLocationDetail] = useState<LocationData>(
    {} as LocationData
  );

  TaskManager.defineTask(BACKGROUND_FETCH_TASK, async () => {
    const now = Date.now();

    console.log(
      `Got background fetch call at date: ${new Date(now).toISOString()}`
    );

    // Be sure to return the successful result type!
    return BackgroundFetch.BackgroundFetchResult.NewData;
  });

  async function registerBackgroundFetchAsync() {
    return BackgroundFetch.registerTaskAsync(BACKGROUND_FETCH_TASK, {
      minimumInterval: 10, // 15 minutes
      stopOnTerminate: false, // android only,
      startOnBoot: true, // android only
    });
  }

  const requestPermissions = async () => {
    const { status: foregroundStatus } =
      await Location.requestForegroundPermissionsAsync();
    if (foregroundStatus === "granted") {
      const { status: backgroundStatus } =
        await Location.requestBackgroundPermissionsAsync();
      if (backgroundStatus === "granted") {
        console.log("fff");
        await Location.startLocationUpdatesAsync(LOCATION_TASK_NAME, {
          accuracy: Location.Accuracy.Balanced,
        });
      }
    }
  };

  const [userMessage, setUserMessage] = useState("");
  const [messages, setMessages] = useState<
    Array<{ id: string; message: string }>
  >([]);

  const onMessageChange = (text: string) => {
    setUserMessage(text);
  };

  const checkStatusAsync = async () => {
    const status = await BackgroundFetch.getStatusAsync();
    const isRegistered = await TaskManager.isTaskRegisteredAsync(
      BACKGROUND_FETCH_TASK
    );
    console.log(status);
    console.log(isRegistered);
  };

  // TaskManager.defineTask(
  //   LOCATION_TASK_NAME,
  //   ({ data, error }: { data: LocationData; error: any }) => {
  //     console.log(error);
  //     if (error) {
  //       // Error occurred - check `error.message` for more details.
  //       return;
  //     }
  //     setLocationDetail(data);
  //     if (data) {
  //       // do something with the locations captured in the background
  //     }
  //   }
  // );

  const messagesRefList = useRef<FlashList<{
    id: string;
    message: string;
  }> | null>(null);
  const getAllMessages = async () => {
    try {
      const conversationId = 1;
      const messagesRef = ref(db, `converstation/${conversationId}/messages`);
      onValue(messagesRef, (snapshot) => {
        const data = snapshot.val();
        if (!!data) {
          const messageArray = Object.keys(data).map((key) => ({
            id: key,
            ...data[key],
          }));
          setMessages(messageArray);
        } else {
          console.log("Data not found");
        }
      });
    } catch (error) {
      console.error("Error fetching messages:", error);
      // Handle the error, e.g., display an error message to the user
    }
  };

  const setMessagesUser = async () => {
    const uid = 123;
    push(ref(db, "converstation/" + 1 + "/messages"), {
      username: "Zeeshan Ali",
      email: "zeeshanali90233@gmail.com",
      message: userMessage,
      timestamp: serverTimestamp(),
    });
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const d = await fetch("/all", {
          method: "POST",
          body: JSON.stringify({
            hello: "herlkl",
          }),
        });
        console.log(await d.json());
      } catch (err) {
        console.log(err);
      }
    };

    // DeviceMotion.addListener((state) => {
    //   console.log(state);
    // });
    // DeviceMotion.setUpdateInterval(5000);
    // requestPermissions();
    getAllMessages();
    registerBackgroundFetchAsync();
    fetchData();
  }, []);
  // Warm up the android browser to improve UX
  // https://docs.expo.dev/guides/authentication/#improving-user-experience
  useWarmUpBrowser();
  const { startOAuthFlow } = useOAuth({ strategy: "oauth_google" });

  const [keyboardStatus, setKeyboardStatus] = useState("");

  useEffect(() => {
    const showSubscription = Keyboard.addListener("keyboardDidShow", () => {
      setKeyboardStatus("Keyboard Shown");
      if (messagesRefList) {
        messagesRefList.current?.scrollToEnd({ animated: true });
      }
    });
    const hideSubscription = Keyboard.addListener("keyboardDidHide", () => {
      setKeyboardStatus("Keyboard Hidden");
    });

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  const sleep = (time: number) =>
    new Promise((resolve, _) => setTimeout(() => resolve(_), time));

  const veryIntensiveTask = async (taskDataArguments: { delay: number }) => {
    // Example of an infinite loop task
    const { delay } = taskDataArguments;
    await new Promise(async (resolve) => {
      for (let i = 0; i < 5; i++) {
        console.log(i);
        await sleep(delay);
      }
    });
  };

  const options = {
    taskName: "New",
    taskTitle: "ExampleTask title",
    taskDesc: "ExampleTask description",
    taskIcon: {
      name: "ic_launcher",
      type: "mipmap",
    },
    color: "#ff00ff",
    linkingURI: "yourSchemeHere://chat/jane", // See Deep Linking for more info
    parameters: {
      delay: 1000,
    },
  };

  const onPress = React.useCallback(async () => {
    // await BackgroundService.start(
    //   await veryIntensiveTask({ delay: 4500 }),
    //   options
    // );

    await BackgroundService.updateNotification({
      taskDesc: "New ExampleTask description",
    });
    // try {

    //   const { createdSessionId, signIn, signUp, setActive } =
    //     await startOAuthFlow();

    //   if (createdSessionId) {
    //     console.log({ session: createdSessionId });
    //   } else {
    //     // Use signIn or signUp for next steps such as MFA
    //   }
    // } catch (err) {
    //   console.error("OAuth error", err);
    // }
  }, []);

  return (
    <View>
      <Button title="Sign in with Google" onPress={onPress} />
      <BlurView intensity={100}>
        <Text>{"text"}</Text>
      </BlurView>

      <View style={{ minHeight: "50%", backgroundColor: "black" }}>
        <FlashList
          data={messages}
          ref={messagesRefList}
          renderItem={({ item }: { item: { id: string; message: string } }) => (
            <Text style={{ color: "white" }}>{item.message}</Text>
          )}
          ItemSeparatorComponent={() => <Text>s</Text>}
          estimatedItemSize={35}
          // inverted
          onContentSizeChange={() => {
            if (messagesRefList)
              messagesRefList?.current?.scrollToEnd({ animated: true });
          }}
          initialScrollIndex={messages.length - 1}
          // showsVerticalScrollIndicator
          scrollEnabled
          showsVerticalScrollIndicator

          // CellRendererComponent={}
        />
      </View>

      <TextInput
        style={{
          marginTop: 10,
          padding: 10,
          borderRadius: 10,
          backgroundColor: "white",
        }}
        onChangeText={onMessageChange}
        value={userMessage}
        placeholder="useless placeholder"
      />

      <TouchableOpacity
        onPress={setMessagesUser}
        style={{
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "blue",
          width: "100%",
          height: 40,
          borderRadius: 20,
          marginTop: 20,
        }}
      >
        <Text
          style={{
            color: "white",
            fontSize: 16,
            fontWeight: "bold",
          }}
        >
          Submit
        </Text>
      </TouchableOpacity>
    </View>
  );
};
export default SignInWithOAuth;
