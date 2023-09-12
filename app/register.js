import React, { useState } from "react";
import {
	SafeAreaView,
	Text,
	View,
	TextInput,
	StatusBar,
	Keyboard,
	ScrollView,
	StyleSheet
} from "react-native";
import { styled } from "nativewind";
import { Button } from "../components/Button";

const StyledStatusBar = styled(StatusBar);
const StyledSafeArea = styled(SafeAreaView);
const StyledView = styled(View);
const StyledText = styled(Text);
const StyledInput = styled(TextInput);

export default function Login() {
	const [name, setName] = useState("");
	const [username, setUsername] = useState("");
	const [email, setEmail] = useState("");
	const [phone, setPhone] = useState("");
	const [pass, setPass] = useState("");
	return (
		<>
			<StyledSafeArea
				className="bg-offblack"
				style={{ flex: 1 /*  backgroundColor: "#5946B2"  */ }}
			>
				<ScrollView keyboardDismissMode="on-drag">
					<StyledView className="flex flex-col pt-20 pb-5 px-[15px] items-center justify-start w-screen gap-y-6">
						<StyledView className="w-full">
							<StyledText className="text-offwhite text-center text-5xl font-bold">
								Welcome to Prayer Circle!
							</StyledText>
						</StyledView>
						<StyledView className="flex flex-col items-center justify-center w-full gap-y-4">
							<StyledInput
								className="bg-offblack text-[18px] w-11/12 text-offwhite border border-offwhite rounded-lg px-3 py-[10px]"
								placeholder={"Username"}
								placeholderTextColor={"#fff"}
								inputMode="text"
								maxLength={30}
								onSubmitEditing={() => {
									this.nameInput.focus();
								}}
								autoComplete="name"
								blurOnSubmit={false}
								onEndEditing={(text) => {
									setUsername(text.nativeEvent.text);
								}}
							/>
							<StyledInput
								className="bg-offblack text-[18px] w-11/12 text-offwhite border border-offwhite rounded-lg px-3 py-[10px]"
								placeholder={"Name"}
								placeholderTextColor={"#fff"}
								inputMode="text"
								maxLength={30}
								ref={(input) => {
									this.nameInput = input;
								}}
								onSubmitEditing={() => {
									this.emailInput.focus();
								}}
								autoComplete="name"
								blurOnSubmit={false}
								onEndEditing={(text) => {
									setName(text.nativeEvent.text);
								}}
							/>
							<StyledInput
								className="bg-offblack text-[18px] w-11/12 text-offwhite border border-offwhite rounded-lg px-3 py-[10px]"
								placeholder={"Email"}
								placeholderTextColor={"#fff"}
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
							{/* <StyledInput
								className="bg-offblack text-[18px] w-11/12 text-offwhite border border-offwhite rounded-lg px-3 py-[10px]"
								placeholder={"Phone Number"}
								placeholderTextColor={"#fff"}
								inputMode="numeric"
								autoComplete="tel"
								maxLength={20}
								ref={(input) => {
									this.phoneInput = input;
								}}
								blurOnSubmit={true}
								onEndEditing={(text) => {
									setPhone(text.nativeEvent.text);
								}}
							/> */}
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
							press={() => {
								Keyboard.dismiss();
								createUserData(name, email, phone, pass);
							}}
						/>
						<StyledText className="text-offwhite text-center text-[18px] mt-5">
							Already have an account?{" "}
							<StyledText className="text-[#F9A826] font-bold">
								Login
							</StyledText>
						</StyledText>
					</StyledView>
				</ScrollView>
			</StyledSafeArea>
		</>
	);
}

function createUserData(name, email, phone, password) {
	let userData = {
		name: name,
		email: email,
		phone: phone,
		password: password
	};
	console.log(userData);
}
