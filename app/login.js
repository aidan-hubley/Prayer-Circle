import React, { useState } from "react";
import {
	SafeAreaView,
	Text,
	View,
	TextInput,
	StatusBar,
	Keyboard,
	ScrollView,
	StyleSheet,
	Image
} from "react-native";
import { styled } from "nativewind";
import { Button } from "../components/Button";
import { loginUser } from "../database/firebaseFunctions";

const StyledImage = styled(Image);
const StyledSafeArea = styled(SafeAreaView);
const StyledView = styled(View);
const StyledText = styled(Text);
const StyledInput = styled(TextInput);

export default function Login() {
	const [email, setEmail] = useState("");
	const [pass, setPass] = useState("");

	return (
		<>
			<StyledSafeArea
				className="bg-offblack"
				style={{ flex: 1 /*  backgroundColor: "#5946B2"  */ }}
			>
				<ScrollView keyboardDismissMode="on-drag">
					<StyledView className="flex flex-col pt-10 pb-5 px-[15px] items-center justify-start w-screen ">
						<StyledView className="w-full flex flex-col items-center justify-center mb-2">
							<StyledText className="text-offwhite text-center text-5xl font-bold">
								Login to Prayer Circle!
							</StyledText>
							<StyledView className="w-[40%] aspect-square my-2">
								<StyledImage
									className="w-full h-full"
									source={require("../assets/PCLogo.png")}
									resizeMode="contain"
								/>
							</StyledView>
						</StyledView>
						<StyledView className="flex flex-col items-center justify-center w-full gap-y-4">
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
							title="Login"
							press={() => {
								Keyboard.dismiss();
								userLogin(email, pass);
							}}
						/>
						<StyledText className="text-offwhite text-center text-[18px] mt-5">
							Don't have an account?{" "}
							<StyledText className="text-[#F9A826] font-bold">
								Register
							</StyledText>
						</StyledText>
					</StyledView>
				</ScrollView>
			</StyledSafeArea>
		</>
	);
}

function userLogin(email, password) {
	//clear all fields
	this.emailInput.clear();
	this.passInput.clear();

	loginUser(email, password);
}
