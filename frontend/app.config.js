import "dotenv/config";

export default {
  expo: {
    name: "Logistics App",
    slug: "logistics-app",
    owner: "logisticsapp",
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
      versionCode: 1,
      adaptiveIcon: {
        foregroundImage: "./assets/images/android-icon-foreground.png",
        backgroundColor: "#ffffff",
      },
      package: "com.mubashir.logisticsapp",
      googleServicesFile: process.env.GOOGLE_SERVICES_JSON || "./google-services.json",
    },
    web: {
      favicon: "./assets/images/favicon.png",
    },
    scheme: "logistics-app",
    plugins: [
      "expo-router",
      "expo-secure-store",
      "@react-native-community/datetimepicker",
      "@react-native-firebase/app",
      "@react-native-firebase/messaging",
    ],
    extra: {
      apiUrl: process.env.API_URL,
      geoApiKey: process.env.GEO_API_KEY,
      router: {},
      eas: {
        projectId: "23773031-ecb3-4c39-9d53-b0d790ba6115",
      },
    },
    hooks: {
      postPublish: [],
    },
  },
};
