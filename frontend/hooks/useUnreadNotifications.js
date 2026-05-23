import { useCallback, useEffect, useState } from "react";
import { AppState } from "react-native";
import { useFocusEffect } from "expo-router";
import * as Notifications from "expo-notifications";
import { axiosPrivate } from "../services/axios";

const POLL_INTERVAL_MS = 20_000;

let cachedHasUnread = false;
const subscribers = new Set();

function notifySubscribers(hasUnread) {
  cachedHasUnread = hasUnread;
  subscribers.forEach((fn) => fn(hasUnread));
}

export function setUnreadNotifications(hasUnread) {
  notifySubscribers(hasUnread);
}

export async function refreshUnreadNotifications() {
  try {
    const res = await axiosPrivate.get("/notifications");
    const list = res.data.notifications ?? [];
    notifySubscribers(list.some((n) => !n.read));
  } catch {
    // Keep prior state on failure
  }
}

/** Subscribe to unread state for UI (e.g. header bell). */
export function useUnreadNotifications() {
  const [hasUnread, setHasUnread] = useState(cachedHasUnread);

  useEffect(() => {
    subscribers.add(setHasUnread);
    return () => subscribers.delete(setHasUnread);
  }, []);

  useFocusEffect(
    useCallback(() => {
      refreshUnreadNotifications();
    }, [])
  );

  return { hasUnread, refreshUnread: refreshUnreadNotifications };
}

/**
 * App-wide sync: polling, foreground refresh, and push listeners.
 * Mount once when the user is authenticated (e.g. in AuthProvider).
 */
export function useUnreadNotificationSync(isAuthenticated) {
  useEffect(() => {
    if (!isAuthenticated) {
      notifySubscribers(false);
      return;
    }

    refreshUnreadNotifications();

    const pollId = setInterval(refreshUnreadNotifications, POLL_INTERVAL_MS);

    const appStateSub = AppState.addEventListener("change", (state) => {
      if (state === "active") refreshUnreadNotifications();
    });

    const receivedSub = Notifications.addNotificationReceivedListener(() => {
      refreshUnreadNotifications();
    });

    const responseSub = Notifications.addNotificationResponseReceivedListener(() => {
      refreshUnreadNotifications();
    });

    return () => {
      clearInterval(pollId);
      appStateSub.remove();
      receivedSub.remove();
      responseSub.remove();
    };
  }, [isAuthenticated]);
}
