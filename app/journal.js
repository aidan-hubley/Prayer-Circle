import React, { useEffect } from "react";
import {
	SafeAreaView,
	Text,
	View,
	Image,
	StatusBar,
	ScrollView,
	Pressable
} from "react-native";
import { StyleSheet } from "react-native";
import { Easing } from "react-native";
import { Button } from "../components/Button";
import { Circle } from "../components/Circle";
import { styled } from "nativewind";
import { Link } from "expo-router";

const StyledLink = styled(Link);
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
						<StyledView className="flex flex-row h-70px pt-10 m-3">
							<StyledView className="w-1/3">
								<Button
									text="Journal"
									backgroundColor="#121212"
									borderColor="#F9A826"
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
									borderColor="#FFFBFC"
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
						<StyledView className="flex flex-row w-screen h-[89%]">
							<StyledView className="flex flex-col w-screen place-content-center">
								<StyledView className="flex flex-row h-1/3 justify-center">
									<StyledLink
										className="bg-offblack border border-purple border-2 w-[90%] h-[90%] rounded-3xl p-5 pt-3"
										href="/journalDetail"
										press={() => {}}
									>
										<StyledText className="text-offwhite text-[20px]">
											Prayer Request
										</StyledText>
									</StyledLink>
								</StyledView>
								<StyledView className="flex flex-row h-1/3 justify-center">
									<StyledLink
										className="bg-offblack border border-green border-2 w-[90%] h-[90%] rounded-3xl p-5 pt-3"
										href="/journalDetail"
										press={() => {}}
									>
										<StyledText className="text-offwhite text-[20px]">
											Prasies
										</StyledText>
									</StyledLink>
								</StyledView>
								<StyledView className="flex flex-row h-1/3 justify-center">
									<StyledLink
										className="bg-offblack border border-offwhite border-2 w-[90%] h-[90%] rounded-3xl p-5 pt-3"
										href="/journalDetail"
										press={() => {}}
									>
										<StyledText className="text-offwhite text-[20px]">
											Events
										</StyledText>
									</StyledLink>
								</StyledView>
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
