import React, { useState, useContext, useEffect, useRef } from "react";
import { Picker } from "@react-native-picker/picker";
import { StackScreenProps } from "@react-navigation/stack";
import { Camera } from "expo-camera";
import * as ImagePicker from "expo-image-picker";

import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  TextInput,
  Button,
  ActivityIndicator,
  Image,
  Dimensions,
  TouchableOpacity,
  Alert,
} from "react-native";

import { ProductsStackParams } from "../navigator/ProductsNavigator";
import { useCategories } from "../hooks/useCategories";
import { useForm } from "../hooks/useForm";
import { ProductsContext } from "../context/products/ProductsContext";

interface Props
  extends StackScreenProps<ProductsStackParams, "ProductScreen"> {}

const ProductScreen = ({ route, navigation }: Props) => {
  const { loadProductById, addProduct, updateProduct, uploadImage } =
    useContext(ProductsContext);

  const { id = "", name = "" } = route.params;
  const { categories, isLoading } = useCategories();
  const { _id, categoriaId, nombre, img, form, onChange, setFormValue } =
    useForm({
      _id: id,
      categoriaId: "",
      nombre: name,
      img: "",
    });

  useEffect(() => {
    loadProduct();
  }, []);

  useEffect(() => {
    navigation.setOptions({
      headerTitle: nombre,
    });
  }, [nombre]);

  const loadProduct = async () => {
    if (!id.length) return;
    const { _id, categoria, img, nombre } = await loadProductById(id);
    setFormValue({
      _id,
      categoriaId: categoria._id,
      img: img || "",
      nombre,
    });
  };

  const saveProduct = async () => {
    if (id.length) {
      updateProduct(categoriaId, nombre, id);
    } else {
      const newProduct = await addProduct(
        categoriaId || categories[0]._id,
        nombre
      );
      onChange(newProduct._id, "_id");
    }
  };

  // camera
  // TODO: pedir privilegios...
  const [openCamera, setOpenCamera] = useState(false);
  const [tempUri, setTempUri] = useState<string>();
  const cameraRef = useRef<Camera | any>();
  const startCamera = () => {
    setOpenCamera(!openCamera);
  };

  const takePhoto = async () => {
    if (!cameraRef) return;
    const camera: Camera = cameraRef.current;
    const photo = await camera.takePictureAsync({ quality: 0.2, base64: true });
    if (!photo.uri) return;
    setTempUri(photo.uri);
    uploadImage(photo, _id);
    setOpenCamera(false);
  };

  // galeria e IMAGENES!!!! USAR esta 🎁😍😂
  const pickImage = async () => {
    // const photo = await ImagePicker.launchCameraAsync()
    const photo = await ImagePicker.launchImageLibraryAsync({ quality: 0.5, base64: true });

    if (photo.cancelled) return;
    setTempUri(photo.uri);
    uploadImage(photo, _id);
  };

  return (
    <View style={styles.container}>
      <ScrollView>
        {/* nombre */}
        <Text style={styles.label}>Nombre del producto:</Text>
        <TextInput
          placeholder="Producto"
          style={styles.textInput}
          value={nombre}
          onChangeText={(v) => onChange(v, "nombre")}
        />

        {/* categoria */}
        <Text style={styles.label}>Categoria:</Text>
        <View style={styles.categoryContainer}>
          {isLoading ? (
            <ActivityIndicator size="small" color="#5856d6" />
          ) : (
            <Picker
              style={styles.picker}
              itemStyle={styles.pickerItem}
              selectedValue={categoriaId}
              onValueChange={(v) => onChange(v, "categoriaId")}
            >
              {categories.map((c) => (
                <Picker.Item label={c.nombre} value={c._id} key={c._id} />
              ))}
            </Picker>
          )}
        </View>

        {/* Botones */}
        <Button title="Guardar" onPress={saveProduct} color="#5856d6" />
        {_id.length > 0 && (
          <View style={styles.btnContainer}>
            <Button title="Camara" onPress={startCamera} color="#5856d6" />
            <Button title="Galeria" onPress={pickImage} color="#5856d6" />
          </View>
        )}

        {img.length > 0 && !tempUri && (
          <Image
            source={{ uri: img }}
            style={{ width: "100%", height: 300, marginTop: 20 }}
          />
        )}

        {/* camara */}
        {openCamera && (
          <View style={camStyle.container}>
            <Camera style={camStyle.camera} ref={cameraRef} />
            <View style={camStyle.buttonContainer}>
              <TouchableOpacity style={camStyle.button} onPress={takePhoto} />
            </View>
          </View>
        )}

        {tempUri && (
          <Image
            source={{ uri: tempUri }}
            style={{ width: "100%", height: 300, marginTop: 20 }}
          />
        )}

        {/* TODO: img temporal */}
      </ScrollView>
    </View>
  );
};

export default ProductScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 10,
    marginHorizontal: 20,
    zIndex: 0,
  },
  label: {
    fontSize: 18,
  },
  textInput: {
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    borderColor: "rgba(0,0,0,0.2)",
    height: 45,
    marginTop: 5,
    marginBottom: 15,
  },
  btnContainer: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    marginTop: 10,
    marginHorizontal: 60,
  },
  categoryContainer: {
    height: 45,
    marginBottom: 25,
    borderColor: "black",
  },
  picker: {
    height: 45,
    color: "black",
  },
  pickerItem: {
    height: 45,
  },
});

const camStyle = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 15,
    height: "100%",
    width: "100%",
    top: 0,
    paddingBottom: 15,
  },
  camera: {
    height: Dimensions.get("screen").width,
    width: "100%",
  },
  buttonContainer: {
    position: "absolute",
    bottom: 0,
    flexDirection: "row",
    flex: 1,
    width: "100%",
    padding: 20,
    borderRadius: 50,
    justifyContent: "center",
  },
  button: {
    width: 70,
    height: 70,
    bottom: 0,
    borderRadius: 50,
    backgroundColor: "#fff",
    borderWidth: 2,
    borderColor: "#666",
  },
});
