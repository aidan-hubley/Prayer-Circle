import React, { useState } from "react";
import { Text, TouchableHighlight } from "react-native";
import { styled } from "nativewind";
import { Link } from "expo-router";

const StyledText = styled(Text);
const StyledTouchableHighlight = styled(TouchableHighlight);
const StyledLink = styled(Link);

export function RoutingButton({
	title,
	width,
	textSize,
	textStyles,
	backgroundColor,
	textColor,
	borderColor,
	href
}) {
	let bgColor = backgroundColor ? backgroundColor : "#F7F1E3";
	let txtColor = textColor ? textColor : "#121212";
	let borderClr = borderColor ? borderColor : "#F7F1E3";

	return (
		<StyledLink href={href ? href : "/register"} asChild>
			<StyledTouchableHighlight
				activeOpacity={0.6}
				underlayColor="#DDDDDD"
				onPress={() => {
					console.log("click");
				}}
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
			</StyledTouchableHighlight>
		</StyledLink>
	);
}
