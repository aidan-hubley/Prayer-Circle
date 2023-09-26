import React, { useState } from "react";
import {
	SafeAreaView,
	Text,
	View,
	TextInput,
	Keyboard,
	Image,
	TouchableWithoutFeedback,
	StatusBar
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { styled } from "nativewind";
import { Button } from "../components/Button";
import { Link } from "expo-router";
import { registerUser } from "../database/firebaseFunctions";

const StyledImage = styled(Image);
const StyledSafeArea = styled(SafeAreaView);
const StyledView = styled(View);
const StyledText = styled(Text);
const StyledInput = styled(TextInput);

export default function Register() {
	const [fname, setFName] = useState("");
	const [lname, setLName] = useState("");
	const [username, setUsername] = useState("");
	const [email, setEmail] = useState("");
	/* const [phone, setPhone] = useState(""); */
	const [pass, setPass] = useState("");

	return (
		<>
			<StyledSafeArea
				className="bg-offblack"
				style={{ flex: 1, backgroundColor: "#5946B2" }}
			>
				<KeyboardAwareScrollView>
					<TouchableWithoutFeedback onPress={Keyboard.dismiss}>
						<>
							<StyledView className="flex flex-col pb-5 px-[15px] w-screen">
								<StyledView className="w-full flex flex-col items-center mb-2">
									<StyledView className="w-[89%] aspect-square mt-[15%] mb-[10%]">
										<StyledImage
											className="w-full h-full"
											source={require("../assets/Logo_Dark.png")}
											resizeMode="contain"
										/>
									</StyledView>
								</StyledView>
								<StyledView className="flex flex-col items-center justify-center w-full gap-y-4">
									<StyledInput
										className=" bg-offblack text-[18px] w-11/12 text-offwhite border border-offwhite rounded-lg px-3 py-[10px]"
										placeholder={"Username"}
										placeholderTextColor={"#fff"}
										inputMode="text"
										maxLength={30}
										autoCorrect={false}
										ref={(input) => {
											this.usernameInput = input;
										}}
										onSubmitEditing={() => {
											this.fNameInput.focus();
										}}
										blurOnSubmit={false}
										onEndEditing={(text) => {
											setUsername(text.nativeEvent.text);
										}}
									/>
									<StyledView className="flex flex-row w-11/12">
										<StyledInput
											className="bg-offblack text-[18px] mr-1 w-auto flex-1 text-offwhite border border-offwhite rounded-lg px-3 py-[10px]"
											placeholder={"First Name"}
											placeholderTextColor={"#fff"}
											inputMode="text"
											maxLength={30}
											ref={(input) => {
												this.fNameInput = input;
											}}
											onSubmitEditing={() => {
												this.lNameInput.focus();
											}}
											autoComplete="given-name"
											blurOnSubmit={false}
											onEndEditing={(text) => {
												setFName(text.nativeEvent.text);
											}}
										/>
										<StyledInput
											className="bg-offblack text-[18px] ml-1 w-auto flex-1 text-offwhite border border-offwhite rounded-lg px-3 py-[10px]"
											placeholder={"Last Name"}
											placeholderTextColor={"#fff"}
											inputMode="text"
											maxLength={30}
											ref={(input) => {
												this.lNameInput = input;
											}}
											onSubmitEditing={() => {
												this.emailInput.focus();
											}}
											autoComplete="family-name"
											blurOnSubmit={false}
											onEndEditing={(text) => {
												setLName(text.nativeEvent.text);
											}}
										/>
									</StyledView>
									<StyledInput
										className="bg-offblack text-[18px] w-11/12 text-offwhite border border-offwhite rounded-lg px-3 py-[10px]"
										placeholder={"Email"}
										placeholderTextColor={"#fff"}
										autoCapitalize="none"
										inputMode="email"
										autoComplete="email"
										maxLength={30}
										ref={(input) => {
											this.emailInput = input;
										}}
										onSubmitEditing={() => {
											this.passInput.focus();
										}}
										blurOnSubmit={false}
										onEndEditing={(text) => {
											setEmail(text.nativeEvent.text);
										}}
									/>
									<StyledInput
										className="bg-offblack text-[18px] w-11/12 text-offwhite border border-offwhite rounded-lg px-3 py-[10px]"
										placeholder={"Password"}
										placeholderTextColor={"#fff"}
										secureTextEntry={true}
										maxLength={25}
										ref={(input) => {
											this.passInput = input;
										}}
										onEndEditing={(text) => {
											setPass(text.nativeEvent.text);
										}}
									/>
								</StyledView>
							</StyledView>
							<StyledView className="flex flex-col items-center">
								<Button
									width="w-[85%]"
									title="Register"
									textColor="#F7F1E3"
									backgroundColor="#121212"
									borderColor="#F9A826"
									press={() => {
										Keyboard.dismiss();
										createUserData(
											username,
											fname,
											lname,
											email,
											pass
										);
									}}
								/>
								<StyledText className="text-offwhite text-center text-[18px] mt-5">
									Already have an account?{" "}
									<Link href="/login">
										<StyledText className="text-yellow font-bold">
											Login
										</StyledText>
									</Link>
								</StyledText>
							</StyledView>
						</>
					</TouchableWithoutFeedback>
				</KeyboardAwareScrollView>
				<StatusBar barStyle={"light-content"} />
			</StyledSafeArea>
		</>
	);
}

function createUserData(username, fname, lname, email, password) {
	//clear all fields
	this.usernameInput.clear();
	this.fNameInput.clear();
	this.lNameInput.clear();
	this.emailInput.clear();
	this.passInput.clear();

	let userData = {
		username: username,
		fname: fname,
		lname: lname,
		email: email,
		phone: "0000000000",
		created: new Date().getTime()
	};
	registerUser(email, password, userData);
}
