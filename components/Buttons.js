import React, { useState } from "react";
import {
	Text,
	TouchableHighlight,
	Animated,
	Easing,
	StyleSheet
} from "react-native";
import { styled } from "nativewind";
import { router } from "../database/config";
import Ionicons from "@expo/vector-icons/Ionicons";

const StyledText = styled(Text);
const StyledTouchableHighlight = styled(TouchableHighlight);
const StyledIcon = styled(Ionicons);
const AnimatedHighlight = styled(
	Animated.createAnimatedComponent(TouchableHighlight)
);

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
	expanded,
	extraStyles
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
			} items-center justify-center rounded-full bg-offwhite border border-[${borderClr}] transition-all ${extraStyles}
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

export function AnimatedButton({
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
	const [wi, setWi] = useState(new Animated.Value(0));

	return (
		<AnimatedHighlight
			activeOpacity={0.6}
			underlayColor={backgroundColor ? backgroundColor : "#F7F1E3"}
			className="bg-[#F7F1E3] px-8 h-[50px] justify-center items-center rounded-full border border-[#F7F1E3]"
			onPress={() => {}}
		>
			<StyledText className="text-lg font-bold">Hi</StyledText>
		</AnimatedHighlight>
	);
}
