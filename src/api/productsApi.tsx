import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const baseURL = "https://cafe-api-rn.herokuapp.com/api";
const productsApi = axios.create({ baseURL });

productsApi.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem("token");
  if (token) {
    config.headers["x-token"] = token;
  }

  return config;
});

export default productsApi;
