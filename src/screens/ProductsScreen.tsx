import React, { useContext, useEffect, useState } from "react";
import { StackScreenProps } from "@react-navigation/stack";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  RefreshControl,
} from "react-native";
import { ProductsContext } from "../context/products/ProductsContext";
import { ProductsStackParams } from "../navigator/ProductsNavigator";

interface Props
  extends StackScreenProps<ProductsStackParams, "ProductsScreen"> {}

const ProductsScreen = ({ navigation }: Props) => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { products, loadProducts } = useContext(ProductsContext);

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          style={{
            marginRight: 10,
          }}
          onPress={() =>
            navigation.navigate("ProductScreen", {
              id: undefined,
              name: "Nuevo Producto",
            })
          }
        >
          <Text>Crear</Text>
        </TouchableOpacity>
      ),
    });
  }, []);

  const loadProductsFromBackend = async () => {
    setIsRefreshing(true);
    await loadProducts();
    setIsRefreshing(false);
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={products}
        keyExtractor={(p) => p._id}
        renderItem={({ item }) => (
          <TouchableOpacity
            activeOpacity={0.1}
            onPress={() =>
              navigation.navigate("ProductScreen", {
                id: item._id,
                name: item.nombre,
              })
            }
          >
            <Text style={styles.productName}>{item.nombre}</Text>
          </TouchableOpacity>
        )}
        ItemSeparatorComponent={() => <View style={styles.itemSeparator} />}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={loadProductsFromBackend}
          />
        }
      />
    </View>
  );
};

export default ProductsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: 10,
  },
  productName: {
    fontSize: 18,
  },
  itemSeparator: {
    borderBottomWidth: 5,
    borderBottomColor: "#eef",
  },
});
