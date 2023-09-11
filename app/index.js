import React from "react";
import { SafeAreaView, Text, View, TextInput, Image, StatusBar } from "react-native";
import { styled } from "nativewind";
import { Button } from "../components/Button";

const StyledStatusBar = styled(StatusBar);
const StyledSafeArea = styled(SafeAreaView);
const StyledView = styled(View);
const StyledText = styled(Text);
const StyledInput = styled(TextInput);

export default function Login() {
	return (
		<SafeAreaView style={{ flex: 1, backgroundColor: "#5946B2" }}>
			<StyledStatusBar className="bg-offblack" />
			<StyledView className="flex flex-col pt-12 pb-5 px-[15px] items-center justify-start w-screen gap-y-3">
				<StyledView className="w-full">
					<StyledText className="pb-4 text-offwhite text-center text-5xl font-bold">
						Welcome to Prayer Circle!
					</StyledText>
				</StyledView>
				<Image
					source={require('../assets/PCLogo.png')}
					style={{ height: 200 }}
					resizeMode="contain"
				/>
				<StyledView className="flex flex-col pt-3 items-center justify-center w-full gap-y-5">
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