import { useState, useEffect } from "react";
import { Platform } from "react-native";
import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import Constants from "expo-constants";
import useAxiosPrivate from "@/services/axiosConfig";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export default function usePushNotifs() {
  const [expoPushToken, setExpoPushToken] = useState("");
  const axiosPrivate = useAxiosPrivate();

  async function registerForPushNotificationsAsync() {
    if (Platform.OS === "android") {
      await Notifications.setNotificationChannelAsync("default", {
        name: "default",
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: "#FF231F7C",
      });
    }

    if (Device.isDevice) {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus !== "granted") {
        throw new Error("Permission not granted to get push token for push notification");
      }

      const projectId = Constants.expoConfig?.extra?.eas?.projectId;
      if (!projectId) {
        throw new Error("Project ID Not found");
      }

      try {
        const pushTokenString = (
          await Notifications.getExpoPushTokenAsync({
            projectId,
          })
        ).data;

        setExpoPushToken(pushTokenString);
        await sendToken(pushTokenString);

        console.log("📱 Push Token:", pushTokenString);
      } catch (error) {
        console.error("Error getting push token:", error);
        return;
      }
    }
  }

  async function sendToken(pushToken) {
    try {
      const response = await axiosPrivate.post("notifications/register-token", {
        token: pushToken,
      });
      console.log("Token registered with Backend", response.data);
    } catch (error) {
      console.error("Failed to register token", error);
    }
  }

  async function removeToken(pushToken) {
    try {
      const response = await axiosPrivate.post("notifications/remove-token", {
        token: pushToken,
      });
      console.log("Token registered with Backend", response.data);
    } catch (error) {
      console.error("Failed to register token", error);
    }
  }

  useEffect(() => {
    registerForPushNotificationsAsync();
  }, []);

  return { expoPushToken, removeToken };
}
