import { View, Text, TouchableOpacity, ActivityIndicator, Alert, Image, StyleSheet, Dimensions } from 'react-native';
import React, { useState, useEffect, useRef } from 'react';
import { Camera, CameraType } from 'expo-camera';

// ------------------------------ Device dimensions ------------------------------ //
// --------------- Device width --------------- //
const deviceWidth = Dimensions.get('screen').width;
// --------------- Device height --------------- //
const deviceHeight = Dimensions.get('screen').height;

export function AddReceiptScreen() {
  const [hasPermission, setHasPermission] = useState(null);
  const [capturedPhoto, setCapturedPhoto] = useState(null); // Store the captured photo URI
  const cameraRef = useRef(null);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const takePicture = async () => {
    if (cameraRef.current) {
      const { uri } = await cameraRef.current.takePictureAsync();
      setCapturedPhoto(uri); // Store the captured photo URI
    }
  };

  const usePhoto = () => {
    // Here, you can use the `capturedPhoto` URI as needed.
    // You might want to navigate to a screen where you can display or manipulate the photo.
    // For example, you can use React Navigation to navigate to another screen:
    // navigation.navigate('PhotoPreview', { photoUri: capturedPhoto });
  };

  // --------------- Buffering --------------- //
  if(hasPermission == null) {
    return(
      <View style={styles.mainContainer}>
        <View style={styles.emptyBackground}/>
        <ActivityIndicator
          style={styles.mainBackground}
          color="black" 
          size="large"
        />
      </View>
    );
  }
  // --------------- No permission --------------- //
  else if(hasPermission === false) {

    Alert.alert(
      "Unable to access Camera",
      "To use this feature, you will need to allow Camera access in your device Settings",
      [
        {
          text: "Ok",
          onPress: () => navigation.navigate("Add Account Main")
        },
      ]
    );

    return(
      <View style={styles.mainContainer}/>
    );
  }

  return (
    <View style={styles.cameraContainer}>
        <Camera style={styles.camera} type={CameraType.back} ref={cameraRef}>
          <View style={styles.cameraTopViewContainer}/>
          <View style={styles.cameraFunctionsContainer}>
            <View style={styles.cameraFunctionsLeftRightContainer}/>
            <TouchableOpacity 
              style={styles.cameraTakePictureButton}
              onPress={()=> takePicture()}
            />
            <View style={styles.cameraFunctionsLeftRightContainer} />
          </View>
          <View style={styles.cameraBottomViewContainer}/>
        </Camera>
        {capturedPhoto && (
        <View style={styles.photoPreviewContainer}>
          <Image source={{ uri: capturedPhoto }} style={styles.photoPreview} />
          <TouchableOpacity
            style={styles.usePhotoButton}
            onPress={usePhoto}
          >
            <Text style={styles.usePhotoButtonText}>Use Photo</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    backgroundColor: "#F2F2F7",
    flex: 1,
    flexDirection: "column",
  },
  emptyBackground: {
    backgroundColor: "#F2F2F7",
    flex: 1,
  },
  mainBackground: {
    backgroundColor: "#F2F2F7",
    flex: 1,
  },
  cameraContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  camera: {
    flex: 1,
    flexDirection: "column",
  },
  cameraTopViewContainer: {
    backgroundColor: "transparent",
    flex: 36,
  },
  cameraFunctionsContainer: {
    backgroundColor: "transparent",
    flex: 4,
    flexDirection: "row",
  },
  cameraFunctionsLeftRightContainer: {
    backgroundColor: "transparent",
    flex: 10,
  },
  cameraTakePictureButton: {
    backgroundColor: "white",
    flex: 4,
    borderRadius: deviceWidth * 1,
    borderColor: "grey",
    borderWidth: 2,
  },
  cameraBottomViewContainer: {
    backgroundColor: "transparent",
    flex: 1,
  },
  photoPreviewContainer: {
    alignItems: 'center',
  },
  photoPreview: {
    width: 300,
    height: 500,
  },
  usePhotoButton: {
    backgroundColor: 'blue',
    padding: 10,
    borderRadius: 8,
  },
  usePhotoButtonText: {
    color: 'white',
    fontSize: 16,
  },
});