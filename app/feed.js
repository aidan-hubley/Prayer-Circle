import React, { useEffect } from "react";
import {
	SafeAreaView,
	Text,
	View,
	Image,
	StatusBar,
	ScrollView
} from "react-native";
import { StyleSheet } from "react-native";
import { Easing } from "react-native";
import { Circle } from "../components/Circle";
import { styled } from "nativewind";
import { Button, ExpandableButton } from "../components/Buttons";
import { signOut } from "firebase/auth";
import { auth, router } from "../backend/config";
import AsyncStorage from "@react-native-async-storage/async-storage";

const StyledImage = styled(Image);
const StyledView = styled(View);
const StyledText = styled(Text);
const StyledSafeArea = styled(SafeAreaView);

export default function Page() {
	return (
		<StyledSafeArea className="bg-offblack border" style={{ flex: 1 }}>
			<StyledView className="flex-1 items-center pt-10">
				<StyledText className="text-3xl text-white text-center tracking-widest leading-10">
					Feed!
				</StyledText>
				<Button
					title="Sign Out"
					press={() => {
						signOut(auth)
							.then(() => {
								console.log("Signed Out");
								AsyncStorage.setItem("user", "");
								router.push("/login");
							})
							.catch((error) => {
								console.error(error);
							});
					}}
				/>
			</StyledView>
			<StyledView className="flex flex-row justify-center w-screen">
				<Circle backgroundColor="transparent" borderColor="#FFFBFC" />
			</StyledView>
		</StyledSafeArea>
	);
}
