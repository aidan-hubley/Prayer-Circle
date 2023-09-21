import React, { useEffect } from "react";
import { 
    SafeAreaView,
    Text,
    View,
    Image,
    StatusBar,
    ScrollView
    } from "react-native";
import { StyleSheet } from 'react-native';
import { Easing } from 'react-native';
import { Button } from "../components/Button";
import { Circle } from "../components/Circle";
import { styled } from "nativewind";

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
                            <StyledView className="w-1/5">
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
                            <StyledView className="w-1/5">
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
                            <StyledView className="w-1/5">
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
                            <StyledView className="w-2/5">
                                <Button
                                    text="Settings"
                                    backgroundColor="#121212"
                                    borderColor="#F9A826"
                                    textColor="#FFFBFC"
                                    textSize="text-[20px]"
                                    width="w-11/12"
                                    height="h-[50px]"
                                    href="/settings"
                                    press={() => {}}
                                />
                            </StyledView>
                        </StyledView>
                        <StyledView className="flex flex-row justify-center w-screen">
                        </StyledView>
                    </StyledView>
                </ScrollView>
				<StatusBar barStyle={"light-content"} />
			</StyledSafeArea>
		</>
	);
}
