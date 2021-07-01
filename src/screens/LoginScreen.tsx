import React, { useContext, useEffect } from "react";
import { StackScreenProps } from "@react-navigation/stack";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  Alert,
} from "react-native";
import { useForm } from "../hooks/useForm";
import LoginTheme from "../theme/LoginTheme";
import Background from "../components/Background";
import WhiteLogo from "../components/WhiteLogo";
import { AuthContext } from "../context/AuthContext";

interface Props extends StackScreenProps<any, any> {}

const LoginScreen = ({ navigation }: Props) => {
  const { signIn, errorMessage, removeError } = useContext(AuthContext);
  const { email, password, onChange } = useForm({
    email: "",
    password: "",
  });

  const onLogin = () => {
    // super validations
    Keyboard.dismiss();
    if(!email.length || !password.length) return
    signIn({ correo: email, password });
  };

  useEffect(() => {
    if (!errorMessage.length) return;
    Alert.alert("Ups", errorMessage, [{text: "Ok", onPress: removeError}]);
  }, [errorMessage]);

  return (
    <>
      {/* background */}
      <Background />

      {/* Form */}
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <View style={LoginTheme.formContainer}>
          <WhiteLogo />

          <Text style={LoginTheme.title}>Welcome</Text>
          {/* email */}
          <Text style={LoginTheme.label}>Email</Text>
          <TextInput
            placeholder="Type your email:"
            placeholderTextColor="rgba(255,255,255,0.4)"
            keyboardType="email-address"
            textContentType="emailAddress"
            style={LoginTheme.inputField}
            selectionColor="#7eb"
            autoCapitalize="none"
            autoCorrect={false}
            onChangeText={(v) => onChange(v, "email")}
            value={email}
          />
          {/* password */}
          <Text style={LoginTheme.label}>Password</Text>
          <TextInput
            placeholder="***********"
            secureTextEntry
            placeholderTextColor="rgba(255,255,255,0.4)"
            style={LoginTheme.inputField}
            selectionColor="#7eb"
            onChangeText={(v) => onChange(v, "password")}
            value={password}
          />

          {/* button login */}
          <View style={LoginTheme.buttonContainer}>
            <TouchableOpacity activeOpacity={0.2} style={LoginTheme.button}>
              <Text style={LoginTheme.buttonText} onPress={onLogin}>
                Login
              </Text>
            </TouchableOpacity>
          </View>

          {/* button register */}
          <View style={LoginTheme.buttonRegisterContainer}>
            <TouchableOpacity
              activeOpacity={0.2}
              onPress={() => navigation.replace("RegisterScreen")}
            >
              <Text style={LoginTheme.buttonText}>Register</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </>
  );
};

export default LoginScreen;
