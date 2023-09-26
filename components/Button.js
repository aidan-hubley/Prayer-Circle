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
	height,
	textSize,
	textStyles,
	backgroundColor,
	textColor,
	borderColor,
	borderWidth,
	press,
	href
}) {
	const bgColor = backgroundColor ? backgroundColor : "#121212";
	const txtColor = textColor ? textColor : "#FFFBFC";
	const borderClr = borderColor ? borderColor : "#F9A826";
	const borderWid = borderWidth ? borderWidth : 1;

	if (!href) {
		return (
			<StyledTouchableHighlight
				activeOpacity={0.6}
				// underlayColor="#DDDDDD"
				className={`flex items-center justify-center rounded-full 
					${height ? height : "h-[50px]"} 
					${width ? width : "w-11/12"}
				`}
				style={{ 
						backgroundColor: bgColor,
						borderWidth: borderWid,
						borderColor: borderClr
					}}
				onPress={() => press()}
			>
				<StyledText
					className={`font-bold 
						${textSize ? textSize : "text-[20px]"}
						${textStyles}
					`}
					style={{ color: txtColor }}
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
					// underlayColor="#DDDDDD"
					onPress={() => press()}
					className={`flex items-center justify-center rounded-full 
						${height ? height : "h-[50px]"} 
						${width ? width : "w-11/12"}
					`}
					style={{ 
						backgroundColor: bgColor,
						borderWidth: borderWid,
						borderColor: borderClr
					}}
				>
					<StyledText
						className={`font-bold 
							${textSize ? textSize : "text-[20px]"}
							${textStyles}
						`}
						style={{ color: txtColor }}
					>
						{title}
					</StyledText>
				</StyledTouchableHighlight>
			</StyledLink>
		);
	}
}
