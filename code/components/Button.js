import React from "react";
import { Text, Pressable } from "react-native";
import { styled } from "nativewind";

const StyledText = styled(Text);
const StyledPressable = styled(Pressable);

export function Button({ title, onPress, width, textSize, textStyles }) {
	return (
		<StyledPressable
			className={`flex bg-white h-[50px] items-center justify-center rounded-full ${
				width ? width : "w-11/12"
			}`}
			onPress={onPress}
		>
			<StyledText
				className={`text-black font-bold ${
					textSize ? textSize : "text-[20px]"
				} ${textStyles}`}
			>
				{title}
			</StyledText>
		</StyledPressable>
	);
}
