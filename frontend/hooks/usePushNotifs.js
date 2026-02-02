import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "expo-router";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import Constants from "expo-constants";
import { Platform } from "react-native";

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
  const [notification, setNotification] = useState("");
  const notificationListener = useRef();
  const responseListener = useRef();
  const isNavigatingRef = useRef(false);
  const router = useRouter();

  async function registerForPushNotificationsAsync() {
    let token;

    if (!Device.isDevice) {
      console.log("Must use physical device for push notifications");
      return;
    }

    //instructions for how android should handle notifications
    if (Platform.OS === "android") {
      await Notifications.setNotificationChannelAsync("default", {
        name: "default",
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: "#FF231F7C",
      });
    }

    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== "granted") {
      console.log("Permission not granted for push notifications");
      return;
    }

    try {
      const projectId = Constants.expoConfig?.extra?.eas?.projectId;

      if (!projectId) {
        console.error("Project ID not found in app.json");
        return;
      }

      token = await Notifications.getExpoPushTokenAsync({ projectId });
      console.log("📱 Push Token:", token.data);
      return token.data; // Return the string, not the object
    } catch (error) {
      console.error("Error getting push token:", error);
      return;
    }
  }

  const handleNotificationResponse = useCallback(
    async (response) => {
      if (isNavigatingRef.current) return;

      const data = response.notification.request.content.data;
      if (!data?.screen) return;
      isNavigatingRef.current = true;

      try {
        router.push({
          pathname: data.screen,
          params: { ...data.params },
        });
      } catch (error) {
        console.error("Error handling notification tap:", error);
      } finally {
        // Reset flag after a short delay
        setTimeout(() => {
          isNavigatingRef.current = false;
        }, 1000);
      }
    },
    [router]
  );

  useEffect(() => {
    // sets expo push token
    registerForPushNotificationsAsync().then((token) => {
      setExpoPushToken(token || "");
    });

    // sets notification
    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        console.log("📬 Notification received:", notification);
        setNotification(notification);
      });

    // runs handleNotification Response when NOtification is clicked
    responseListener.current =
      Notifications.addNotificationResponseReceivedListener(
        handleNotificationResponse
      );

    return () => {
      if (notificationListener.current) {
        notificationListener.current.remove();
      }
      if (responseListener.current) {
        responseListener.current.remove();
      }
    };
  }, [handleNotificationResponse]);

  return {
    expoPushToken,
    notification,
  };
};
