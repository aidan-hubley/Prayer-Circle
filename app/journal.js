import React from "react";
import { SafeAreaView, Text, View, StatusBar } from "react-native";
import { styled } from "nativewind";

const StyledSafeArea = styled(SafeAreaView);
const StyledView = styled(View);
const StyledText = styled(Text);

export default function Page() {
	return (
		<StyledSafeArea className="bg-offblack border" style={{ flex: 1 }}>
			<StyledView className="flex-1 items-center mt-20 pt-10">
				<StyledText className="text-3xl text-white text-center tracking-widest leading-10">
					Journal
				</StyledText>
			</StyledView>
			<StatusBar style="light-content" />
		</StyledSafeArea>
	);
}
