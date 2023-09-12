import React, { useState } from "react";
import { Text, Pressable } from "react-native";
import { styled } from "nativewind";

const StyledText = styled(Text);
const StyledPressable = styled(Pressable);

export function Button({ title, press, width, textSize, textStyles }) {
	press = press ? press : () => console.log("Button Pressed");
	const [pressed, setPressed] = useState(false);
	return (
		<StyledPressable
			className={`flex bg-white h-[50px] items-center justify-center rounded-full ${
				width ? width : "w-11/12"
			}`}
			onPress={() => press()}
			onPressIn={() => {
				console.log("Pressed In");
				setPressed(true);
			}}
			onPressOut={() => {
				console.log("Pressed Out");
				setPressed(false);
			}}
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
