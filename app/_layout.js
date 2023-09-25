import { Stack } from "expo-router/stack";
import React from "react";
import { Text, View } from "react-native";
import { styled } from "nativewind";
import { ExpandableButton } from "../components/Buttons";

const StyledView = styled(View);

export default function Layout() {
	return (
		<>
			<Stack
				screenOptions={{
					headerShown: false
				}}
			>
				<Stack.Screen name="login" />
			</Stack>
			<StyledView className="absolute top-14 left-4">
				<ExpandableButton title="Journal" expanded={true} />
			</StyledView>
			<StyledView className="absolute top-14 right-4">
				<ExpandableButton title="Profile" expanded={true} />
			</StyledView>
		</>
	);
}
