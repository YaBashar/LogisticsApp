import { useState, useEffect } from "react";
import { Platform } from "react-native";
import * as Notifications from "expo-notifications";
import Constants from "expo-constants";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export const usePushNotifs = () => {
  const [expoPushToken, setExpoPushToken] = useState("");

  async function registerForPushNotificationsAsync() {
    const { status } = await Notifications.requestPermissionsAsync();

    if (status !== "granted") {
      console.log("Permission Not Granted");
      return;
    }

    if (Platform.OS === "android") {
      await Notifications.setNotificationChannelAsync("default", {
        name: "default",
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: "#FF231F7C",
      });
    }

    try {
      const token = await Notifications.getExpoPushTokenAsync({
        projectId: Constants.expoConfig?.extra?.eas?.projectId,
      });

      setExpoPushToken(token.data);
      console.log("📱 Push Token:", token.data);
    } catch (error) {
      console.error("Error getting push token:", error);
      return;
    }
  }

  useEffect(() => {
    registerForPushNotificationsAsync();
  }, []);

  return { expoPushToken };
};
