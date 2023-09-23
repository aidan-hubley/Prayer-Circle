import React, { useState } from "react";
import { Text, Pressable, TouchableHighlight } from "react-native";
import { styled } from "nativewind";
import { router } from "../database/config";
import Ionicons from "@expo/vector-icons/Ionicons";

const StyledText = styled(Text);
const StyledTouchableHighlight = styled(TouchableHighlight);
const StyledIcon = styled(Ionicons);

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
	return (
		<StyledTouchableHighlight
			activeOpacity={0.6}
			underlayColor="#DDDDDD"
			className={`flex h-[50px] items-center justify-center rounded-full bg-offwhite border border-[${borderClr}]
				${width ? width : "w-11/12"}
			`}
			onPress={() => {
				if (press) press();
				if (href) router.push(href);
			}}
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
}

export function ExpandableButton({
	title,
	width,
	textSize,
	textStyles,
	backgroundColor,
	textColor,
	borderColor,
	press,
	href,
	expanded
}) {
	const [pressed, setPressed] = useState(expanded ? expanded : false);
	let bgColor = backgroundColor ? backgroundColor : "#F7F1E3";
	let txtColor = textColor ? textColor : "#121212";
	let borderClr = borderColor ? borderColor : "#F7F1E3";
	return (
		<StyledTouchableHighlight
			activeOpacity={0.6}
			underlayColor="#DDDDDD"
			className={`flex ${
				!pressed ? "h-[50px] w-[50px]" : "h-[50px] w-[150px]"
			} items-center justify-center rounded-full bg-offwhite border border-[${borderClr}] transition-all
				`}
			onPress={() => {
				setPressed(!pressed);
				if (press) press();
			}}
		>
			<>
				<StyledText
					className={`${
						!pressed ? "hidden" : "flex"
					} font-bold text-[${txtColor}] ${
						textSize ? textSize : "text-[20px]"
					} ${textStyles}`}
				>
					{title}
				</StyledText>
				<StyledIcon
					name="md-checkmark-circle"
					size={32}
					/* color="green" */
					className={`${pressed ? "hidden" : "flex"}`}
				/>
			</>
		</StyledTouchableHighlight>
	);
}
