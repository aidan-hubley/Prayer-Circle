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
import {
	loginUser,
	readData,
	writeData,
	createCircle
} from "../database/firebaseFunctions";
import { Link } from "expo-router";

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
					</StyledView>
					<StyledView className="w-full flex flex-col items-center justify-center">
						<Button
							width="w-[85%] mb-3"
							title="Login"
							onPress={() => {
								console.log("login");
							}}
						/>
						<Button
							width="w-[85%]"
							title="Register"
							onPress={() => {
								console.log("register");
							}}
						/>
					</StyledView>
				</ScrollView>
			</StyledSafeArea>
		</>
	);
}
createCircle({
	name: "test",
	description: "test",
	owner: "test"
});
