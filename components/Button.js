import React, { useState } from "react";
import { Text, Pressable, TouchableHighlight } from "react-native";
import { styled } from "nativewind";
import { Link } from "expo-router";

const StyledText = styled(Text);
const StyledPressable = styled(Pressable);
const StyledTouchableHighlight = styled(TouchableHighlight);
const StyledLink = styled(Link);

export function Button({
	title,
	width,
	textSize,
	textStyles,
	backgroundColor,
	textColor,
	borderColor,
	press,
	href
}) {
	let bgColor = backgroundColor ? backgroundColor : "#F7F1E3";
	let txtColor = textColor ? textColor : "#121212";
	let borderClr = borderColor ? borderColor : "#F7F1E3";

	if (!href) {
		return (
			<StyledTouchableHighlight
				activeOpacity={0.6}
				underlayColor="#DDDDDD"
				className={`flex h-[50px] items-center justify-center rounded-full bg-offwhite border border-[${borderClr}]
				${width ? width : "w-11/12"}
			`}
				onPress={() => press()}
			>
				<StyledText
					className={`font-bold text-[${txtColor}] ${
						textSize ? textSize : "text-[20px]"
					} ${textStyles}`}
				>
					{title}
				</StyledText>
			</StyledTouchableHighlight>
		);
	} else if (href) {
		return (
			<StyledLink href={href ? href : null} asChild>
				<StyledTouchableHighlight
					activeOpacity={0.6}
					underlayColor="#DDDDDD"
					onPress={() => press()}
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
}
