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
	registerUser,
	generateId,
	writeData
} from "../database/firebaseFuncitons";

const StyledStatusBar = styled(StatusBar);
const StyledImage = styled(Image);
const StyledSafeArea = styled(SafeAreaView);
const StyledView = styled(View);
const StyledText = styled(Text);
const StyledInput = styled(TextInput);
const StyledPressable = styled(Pressable);

export default function Login() {
	const [fname, setFName] = useState("");
	const [lname, setLName] = useState("");
	const [username, setUsername] = useState("");
	const [email, setEmail] = useState("");
	/* const [phone, setPhone] = useState(""); */
	const [pass, setPass] = useState("");
	return (
		<SafeAreaView style={{ flex: 1, backgroundColor: "#5946B2" }}>
			<StyledStatusBar className="bg-offblack" />
			<StyledView className="flex flex-col pt-20 pb-5 px-[15px] items-center justify-start w-screen gap-y-6">
				<StyledView className="w-full">
					<StyledText className="text-offwhite text-center text-5xl font-bold">
						Welcome to Prayer Circle!
					</StyledText>
					<StyledView className="w-70% my-2">
						<StyledImage
							source={require("../assets/PCLogo.png")}
							resizeMode="contain"
						/>
					</StyledView>
				</StyledView>
				<StyledView className="flex flex-col items-center justify-center w-full gap-y-5">
					<StyledInput
						className="bg-offblack text-[18px] w-11/12 text-offwhite border border-offwhite rounded-lg px-3 py-[10px]"
						placeholder={"Name"}
						placeholderTextColor={"#fff"}
					/>
					<StyledInput
						className="bg-offblack text-[18px] w-11/12 text-offwhite border border-offwhite rounded-lg px-3 py-[10px]"
						placeholder={"Email"}
						placeholderTextColor={"#fff"}
					/>
					<StyledInput
						className="bg-offblack text-[18px] w-11/12 text-offwhite border border-offwhite rounded-lg px-3 py-[10px]"
						placeholder={"Phone Number"}
						placeholderTextColor={"#fff"}
					/>
					<StyledInput
						className="bg-offblack text-[18px] w-11/12 text-offwhite border border-offwhite rounded-lg px-3 py-[10px]"
						placeholder={"Password"}
						placeholderTextColor={"#fff"}
					/>
				</StyledView>
			</StyledView>
			<StyledView className="flex flex-col items-center">
				<Button width="w-[85%]" title="Register" />
				<StyledText className="text-offwhite text-center text-[18px] mt-5">
					Already have an account?{" "}
					<StyledText className="text-[#F9A826] font-bold">
						Login
					</StyledText>
				</StyledText>
			</StyledView>
		</SafeAreaView>
	);
}

async function createUserData(username, fname, lname, email, password) {
	let userData = {
		username: username,
		fname: fname,
		lname: lname,
		email: email,
		password: password,
		phone: "0000000000",
		created: new Date().getTime()
	};
	//await registerUser(userData.email, userData.password);
	console.log(userData);
	await writeData("users/" + generateId(), userData);
}
