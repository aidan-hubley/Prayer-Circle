import React, { useState } from "react";
import { Pressable, TouchableHighlight } from "react-native";
import { styled } from "nativewind";
import { Link } from "expo-router";

const StyledPressable = styled(Pressable);
const StyledTouchableHighlight = styled(TouchableHighlight);
const StyledLink = styled(Link);

export function Circle({
	size,
	backgroundColor,
	borderColor,
	borderWidth,
	press,
	href
}) {
	// const diameterPX = diameter ? diameter : '100 px';
	const bgColor = backgroundColor ? backgroundColor : "#121212";
	const borderClr = borderColor ? borderColor : "#F9A826";
	const borderWid = borderWidth ? borderWidth : 5;

	return (
		<StyledPressable
			className={`flex items-center justify-center rounded-full 
                ${size || "h-44 w-44"} 
            `}
			style={{
				backgroundColor: bgColor,
				borderWidth: borderWid,
				borderColor: borderClr
			}}
			onPress={() => press()}
		></StyledPressable>
	);
}
