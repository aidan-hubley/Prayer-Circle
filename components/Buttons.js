import React, { useState } from "react";
import { Text, TouchableHighlight, Animated } from "react-native";
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
	expandedWidth,
	extraStyles
}) {
	let bgColor = backgroundColor ? backgroundColor : "#F7F1E3";
	let txtColor = textColor ? textColor : "#121212";
	let borderClr = borderColor ? borderColor : "#F7F1E3";

	const [pressed, setPressed] = useState(expanded ? expanded : false);
	const [wi, setWi] = useState(new Animated.Value(expanded ? 1 : 0));

	const wiInter = wi.interpolate({
		inputRange: [0, 1],
		outputRange: ["13%", expandedWidth ? expandedWidth : "100%"]
	});

	const btnWidth = {
		width: wiInter
	};
	const btnText = {
		opacity: wi
	};

	function toggleButton() {
		setPressed(!pressed);
		Animated.spring(wi, {
			toValue: pressed ? 0 : 1,
			duration: 400,
			useNativeDriver: false
		}).start();
	}

	return (
		<AnimatedHighlight
			style={btnWidth}
			activeOpacity={0.6}
			underlayColor={backgroundColor ? backgroundColor : "#fff"}
			className={`bg-offwhite h-[50px] justify-center items-center rounded-full ${extraStyles}`}
			onPressOut={toggleButton}
			onPress={() => {
				if (press) press();
				if (href) router.push(href);
			}}
		>
			<>
				<StyledText
					/* style={{ opacity: wi }} */
					className={`${
						!pressed ? "hidden" : "flex"
					} font-bold text-black ${
						textSize ? textSize : "text-[20px]"
					} ${textStyles}`}
				>
					{title}
				</StyledText>
				<StyledIcon
					name="md-checkmark-circle"
					size={32}
					color="green"
					className={`${pressed ? "hidden" : "flex"}`}
				/>
			</>
		</AnimatedHighlight>
	);
}
