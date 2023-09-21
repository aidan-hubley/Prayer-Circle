import React, { useState } from "react";
import {
	SafeAreaView,
	Text,
	View,
	TextInput,
	StatusBar,
	Keyboard,
	ScrollView,
	Image
} from "react-native";
import { styled } from "nativewind";
import { Button } from "../components/Button";
import { Link } from "expo-router";
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
					<StyledView className="flex flex-col mt-[25%] pb-5 px-[15px] w-screen ">

					</StyledView>
					<StyledView className="flex flex-col items-center">
						<StyledText className="text-offwhite text-center text-[18px] mt-5">
							Continue to Login?{" "}
							<Link href="/register">
								<StyledText className="text-[#F9A826] font-bold">
									Next
								</StyledText>
							</Link>
						</StyledText>
					</StyledView>
				</ScrollView>
				<StatusBar barStyle={"light-content"} />
			</StyledSafeArea>
		</>
	);
}

function userLogin(email, password) {
	//clear all fields
	this.emailInput.clear();
	this.passInput.clear();

	if (email == "" || password == "") {
		console.log("hey");
		return;
	}
	loginUser(email, password);
}
