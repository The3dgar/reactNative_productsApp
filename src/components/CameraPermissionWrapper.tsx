import React, { useState, useEffect } from "react";
import { Text, View, Platform } from "react-native";
import { Camera } from "expo-camera";

const CameraPermissionsWrapper = ({ children }: any) => {
  const [hasPermission, setHasPermission] = useState(false);
  const [type, setType] = useState(Camera.Constants.Type.back);

  const cameraPermission = async () => {
    if (Platform.OS == "web") {
      setHasPermission(true);
      return;
    }
    const { status } = await Camera.requestPermissionsAsync();
    console.log("status", status);
    setHasPermission(status === "granted");
  };

  useEffect(() => {
    cameraPermission();
  }, []);

  if (hasPermission === null) {
    return <View />;
  }

  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return <View style={{ flex: 1 }}>{children}</View>;
};

export default CameraPermissionsWrapper;
