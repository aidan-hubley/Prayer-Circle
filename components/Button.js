import React, { useState } from "react";
import { Text, Pressable } from "react-native";
import { styled } from "nativewind";

const StyledText = styled(Text);
const StyledPressable = styled(Pressable);

export function Button({
	title,
	width,
	textSize,
	textStyles,
	backgroundColor,
	textColor,
	borderColor
}) {
	let bgColor = backgroundColor ? backgroundColor : "#F7F1E3";
	let txtColor = textColor ? textColor : "#121212";
	let borderClr = borderColor ? borderColor : "#F7F1E3";

	return (
		<StyledPressable
			className={`flex h-[50px] items-center justify-center rounded-full bg-offwhite border border-[${borderClr}]
				${width ? width : "w-11/12"}
			`}
		>
			<StyledText
				className={`font-bold text-[${txtColor}] ${
					textSize ? textSize : "text-[20px]"
				} ${textStyles}`}
			>
				{title}
			</StyledText>
		</StyledPressable>
	);
}
