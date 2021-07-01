import React, { useReducer, createContext, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Usuario, LoginResponse, LoginData, RegisterData } from '../interface/appInterfaces';
import { authReducer, AuthState } from "./AuthReducer";
import productsApi from "../api/productsApi";

type AuthContextProps = {
  errorMessage: string;
  token: string | null;
  user: Usuario | null;
  status: "checking" | "authenticated" | "not-authenticated";
  signUp: (obj: RegisterData) => void;
  signIn: (obj: LoginData) => void;
  logOut: () => void;
  removeError: () => void;
};

export const AuthContext = createContext({} as AuthContextProps);

const authInitialState: AuthState = {
  status: "checking",
  token: null,
  user: null,
  errorMessage: "",
};

export const AuthProvider = ({ children }: any) => {
  const [state, dispatch] = useReducer(authReducer, authInitialState);

  useEffect(() => {
    checkToken();
  }, []);

  const checkToken = async () => {
    const token = await AsyncStorage.getItem("token");
    if (!token) return dispatch({ type: "notAuthenticated" });

    const { data, status } = await productsApi.get<LoginResponse>("/auth");
    if (status !== 200) return dispatch({ type: "notAuthenticated" });

    dispatch({
      type: "signUp",
      payload: {
        token: data.token,
        user: data.usuario,
      },
    });

    await AsyncStorage.setItem("token", data.token);
  };

  const signIn = async ({ correo, password }: LoginData) => {
    try {
      const { data } = await productsApi.post<LoginResponse>("/auth/login", {
        correo,
        password,
      });

      const { token, usuario } = data;
      dispatch({
        type: "signUp",
        payload: {
          token,
          user: usuario,
        },
      });

      await AsyncStorage.setItem("token", token);
    } catch (error) {
      console.log(error.response.data);

      dispatch({
        type: "addError",
        payload: error.response.data.msg || "Incorrect data",
      });
    }
  };

  const logOut = async () => {
    await AsyncStorage.removeItem("token");
    dispatch({ type: "logout" });
  };

  const signUp = async (obj: RegisterData) => {
    try {
      const {data} = await productsApi.post<LoginResponse>("/usuarios", obj)

      const {token, usuario} = data
      dispatch({
        type: "signUp",
        payload: {
          token,
          user: usuario,
        },
      });

      await AsyncStorage.setItem("token", token);


    } catch (error) {
      console.log(error.response.data);

      dispatch({
        type: "addError",
        payload: error.response.data.errors[0].msg || "Incorrect data",
      });
    }
  };

  const removeError = () => {
    dispatch({ type: "removeError" });
  };
  return (
    <AuthContext.Provider
      value={{
        ...state,
        signUp,
        signIn,
        logOut,
        removeError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
