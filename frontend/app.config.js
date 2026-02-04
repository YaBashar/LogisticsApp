import "dotenv/config";

export default {
  expo: {
    name: "Logistics App",
    slug: "logistics-app",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/images/icon.png",
    userInterfaceStyle: "light",
    splash: {
      image: "./assets/images/splash-icon.png",
      resizeMode: "contain",
      backgroundColor: "#ffffff",
    },
    assetBundlePatterns: ["**/*"],
    ios: {
      supportsTablet: true,
      bundleIdentifier: "com.mubashir.logisticsapp",
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/images/android-icon-foreground.png",
        backgroundColor: "#ffffff",
      },
      package: "com.mubashir.logisticsapp",
      googleServicesFile:
        process.env.GOOGLE_SERVICES_JSON || "./google-services.json", // ← CHANGED THIS LINE
    },
    web: {
      favicon: "./assets/images/favicon.png",
    },
    scheme: "logistics-app",
    plugins: [
      "expo-router",
      [
        "expo-build-properties",
        {
          android: {
            usesCleartextTraffic: true,
          },
        },
      ],
      "@react-native-community/datetimepicker",
      "@react-native-firebase/app",
      "@react-native-firebase/messaging",
    ],
    extra: {
      apiUrl: process.env.API_URL || "https://logisticsapp-uldj.onrender.com",
      geoApiKey: process.env.GEO_API_KEY,
      router: {},
      eas: {
        projectId: "69c1ed18-ad49-444d-a4f0-ca05f5fafd7a",
      },
    },
    hooks: {
      postPublish: [],
    },
  },
};
