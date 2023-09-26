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
		<>
			<StyledSafeArea
				className="bg-offblack"
				style={{ flex: 1, backgroundColor: "#121212" }}
			>
				<ScrollView keyboardDismissMode="on-drag p-0 m-0">
					<StyledView className="flex flex-col w-screen h-screen">
						<StyledView className="flex flex-row h-[75.5%] pt-10 m-3">
							{/* <Button
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
                          /> */}
							<StyledView className="w-1/3">
								<Button
									text="Journal"
									backgroundColor="#121212"
									borderColor="#FFFBFC"
									textColor="#FFFBFC"
									textSize="text-[20px]"
									width="w-11/12"
									height="h-[50px]"
									href="/journal"
									press={() => {}}
								/>
							</StyledView>
							<StyledView className="w-1/3">
								<Button
									text="Feed"
									backgroundColor="#121212"
									borderColor="#F9A826"
									textColor="#FFFBFC"
									textSize="text-[20px]"
									width="w-11/12"
									height="h-[50px]"
									href="/feed"
									press={() => {}}
								/>
							</StyledView>
							<StyledView className="w-1/3">
								<Button
									text="Profile"
									backgroundColor="#121212"
									borderColor="#FFFBFC"
									textColor="#FFFBFC"
									textSize="text-[20px]"
									width="w-11/12"
									height="h-[50px]"
									href="/profile"
									press={() => {}}
								/>
							</StyledView>
						</StyledView>
						<StyledView className="flex flex-row justify-center w-screen">
							<Circle
								backgroundColor="transparent"
								borderColor="#FFFBFC"
							/>
						</StyledView>
					</StyledView>
				</ScrollView>
				<StatusBar barStyle={"light-content"} />
			</StyledSafeArea>
		</>
	);
}
