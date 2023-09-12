import React from "react";
import { SafeAreaView, Text, View, TextInput, Image, StatusBar, Pressable } from "react-native";
import { styled } from "nativewind";
import { Button } from "../components/Button";

const StyledStatusBar = styled(StatusBar);
const StyledImage = styled(Image);
const StyledSafeArea = styled(SafeAreaView);
const StyledView = styled(View);
const StyledText = styled(Text);
const StyledInput = styled(TextInput);
const StyledPressable = styled(Pressable);

export default function Login() {
	return (
		<SafeAreaView style={{ flex: 1, backgroundColor: "#5946B2" }}>
			<StatusBar backgroundColor="#5946B2" />
			<StyledView className="flex flex-col pt-4 pb-5 px-[15px] items-center justify-start w-screen gap-y-1">
				<StyledView className="w-full flex flex-col items-center justify-center">
					<StyledText className="text-[#F7F1E3] text-center text-5xl font-bold">
						Welcome to Prayer Circle!!
					</StyledText>
					<StyledView className="w-70% my-2">
						<StyledImage
							source={require('../assets/PCLogo.png')}
							resizeMode="contain"
						/>
					</StyledView>
				</StyledView>
				<StyledView className="flex flex-col items-center justify-center w-full gap-y-5">
					<StyledInput
						className="bg-offblack text-[18px] w-11/12 text-[#F7F1E3] border border-[#F7F1E3] rounded-lg px-3 py-[10px]"
						placeholder={"Name"}
						placeholderTextColor={"#F7F1E3"}
					/>
					<StyledInput
						className="bg-offblack text-[18px] w-11/12 text-[#F7F1E3] border border-[#F7F1E3] rounded-lg px-3 py-[10px]"
						placeholder={"Email"}
						placeholderTextColor={"#F7F1E3"}
					/>
					<StyledInput
						className="bg-offblack text-[18px] w-11/12 text-[#F7F1E3] border border-[#F7F1E3] rounded-lg px-3 py-[10px]"
						placeholder={"Phone Number"}
						placeholderTextColor={"#F7F1E3"}
					/>
					<StyledInput
						className="bg-offblack text-[18px] w-11/12 text-[#F7F1E3] border border-[#F7F1E3] rounded-lg px-3 py-[10px]"
						placeholder={"Password"}
						placeholderTextColor={"#F7F1E3"}
					/>
				</StyledView>
			</StyledView>
			<StyledView className="flex flex-col items-center">
				<Button width="w-[85%]" title="Register" textColor="#F7F1E3" backgroundColor="#121212" borderColor="#F9A826" />
				<StyledText className="text-[#F7F1E3] text-center text-[18px] mt-5">
					Already have an account?{" "}
					<StyledText className="text-[#F9A826] font-bold">
						Login
					</StyledText>
				</StyledText>
			</StyledView>
		</SafeAreaView >
	);
}
