import React from "react";
import { Text, Pressable } from "react-native";
import { styled } from "nativewind";

const StyledText = styled(Text);
const StyledPressable = styled(Pressable);

export default function Button(props) {
	const { onPress, title = "Save", width } = props;
	return (
		<StyledPressable
			className={`flex bg-white h-[50px] items-center justify-center rounded-full ${width}`}
			onPress={onPress}
		>
			<StyledText className="text-black font-bold text-[15px]">
				{title}
			</StyledText>
		</StyledPressable>
	);
}
