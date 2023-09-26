import React from "react";
import { SafeAreaView, Text, View, StatusBar } from "react-native";
import { styled } from "nativewind";
import { Button, ExpandableButton } from "../components/Buttons";
import { signOut } from "firebase/auth";
import { auth, router } from "../backend/config";
import AsyncStorage from "@react-native-async-storage/async-storage";

const StyledSafeArea = styled(SafeAreaView);
const StyledView = styled(View);
const StyledText = styled(Text);

export default function Page() {
	return (
		<StyledSafeArea className="bg-offblack border" style={{ flex: 1 }}>
			<StyledView className="flex-1 items-center mt-20 pt-10">
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
		</StyledSafeArea>
	);
}
