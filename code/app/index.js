import React from "react";
import { Text, View } from "react-native";
import { styled } from "nativewind";

const StyledView = styled(View);
const StyledText = styled(Text);

export default function Page() {
	return (
		<StyledView className="flex flex-col py-20 px-[15px] items-center justify-start bg-offblack w-screen h-full"></StyledView>
	);
}
