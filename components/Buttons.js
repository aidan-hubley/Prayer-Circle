import React, { useState, forwardRef, useImperativeHandle } from 'react';
import { Text, TouchableHighlight, Animated, Dimensions } from 'react-native';
import { styled } from 'nativewind';
import { router } from '../backend/config';
import Ionicons from '@expo/vector-icons/Ionicons';

const StyledText = styled(Text);
const StyledTouchableHighlight = styled(TouchableHighlight);
const StyledIcon = styled(Ionicons);
const AnimatedHighlight = styled(
	Animated.createAnimatedComponent(TouchableHighlight)
);

function Button({
	title,
	width,
	height,
	textSize,
	textStyles,
	btnStyles,
	bgColor,
	textColor,
	borderColor,
	press,
	href
}) {
	return (
		<StyledTouchableHighlight
			activeOpacity={0.6}
			underlayColor={`${bgColor || '#DDDDDD'}`}
			className={`flex items-center justify-center rounded-full ${
				bgColor || 'bg-offwhite'
			} ${width || 'w-11/12'} ${height || 'h-[50px]'} ${
				borderColor ? `border ${borderColor}` : 'border-none'
			} ${btnStyles || ''} `}
			onPress={() => {
				if (press) press();
				if (href) router.push(href);
			}}
		>
			<StyledText
				className={`font-bold ${textColor || 'text-offblack'} ${
					textSize ? textSize : 'text-[20px]'
				} ${textStyles}`}
			>
				{title}
			</StyledText>
		</StyledTouchableHighlight>
	);
}

const ExpandableButton = forwardRef(
	(
		{
			title,
			icon,
			width,
			height,
			textSize,
			iconSize,
			textStyles,
			btnStyles,
			bgColor,
			textColor,
			iconColor,
			borderColor,
			press,
			href,
			expandedHref,
			expanded,
			collapsedWidth,
			expandedWidth
		},
		ref
	) => {
		const [pressed, setPressed] = useState(expanded || false);
		const [wi, setWi] = useState(new Animated.Value(expanded ? 1 : 0));

		const deviceWidth = Dimensions.get('window').width;

		if (typeof expandedWidth == 'string' && expandedWidth.includes('%')) {
			expandedWidth = deviceWidth * (parseInt(expandedWidth) / 100);
		}
		if (typeof collapsedWidth == 'string' && collapsedWidth.includes('%')) {
			collapsedWidth = deviceWidth * (parseInt(collapsedWidth) / 100);
		}

		const wiInter = wi.interpolate({
			inputRange: [0, 1],
			outputRange: [collapsedWidth || '13%', expandedWidth || '100%']
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

		useImperativeHandle(ref, () => ({
			toggleButton,
			pressed
		}));

		return (
			<AnimatedHighlight
				style={btnWidth}
				activeOpacity={0.6}
				underlayColor={bgColor || '#DDD'}
				className={`flex items-center justify-center rounded-full ${
					bgColor || 'bg-offwhite'
				} ${width || 'w-11/12'} ${height || 'h-[50px]'} ${
					borderColor ? `border ${borderColor}` : 'border-none'
				} ${btnStyles || ''} ${pressed ? 'z-10' : 'z-0'}`}
				onPressOut={toggleButton}
				onPress={() => {
					if (press) press();
					if (expandedHref && pressed) router.push(expandedHref);
					else if (href) router.push(href);
				}}
			>
				<>
					<StyledText
						/* style={{ opacity: wi }} */
						className={`${
							!pressed ? 'hidden' : 'flex'
						} font-bold  ${textColor || 'text-offblack'} ${
							textSize ? textSize : 'text-[20px]'
						} ${textStyles}`}
					>
						{title}
					</StyledText>
					<StyledIcon
						name={`${icon || 'md-checkmark-circle'}`}
						size={iconSize || 30}
						color={`${iconColor || '#121212'}`}
						className={`${pressed ? 'hidden' : 'flex'}`}
					/>
				</>
			</AnimatedHighlight>
		);
	}
);

export { Button, ExpandableButton };
