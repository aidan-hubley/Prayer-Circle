import React, {
	useState,
	useRef,
	forwardRef,
	useImperativeHandle
} from 'react';
import { Text, TouchableHighlight, Animated, Dimensions } from 'react-native';
import { styled } from 'nativewind';
import { router } from '../backend/config';
import Ionicons from '@expo/vector-icons/Ionicons';
import * as Haptics from 'expo-haptics';

const StyledText = styled(Text);
const StyledTouchableHighlight = Animated.createAnimatedComponent(
	styled(TouchableHighlight)
);
const StyledIcon = styled(Ionicons);
const AnimatedHighlight = styled(
	Animated.createAnimatedComponent(TouchableHighlight)
);

const Button = forwardRef((props, ref) => {
	const opacity = useRef(new Animated.Value(1)).current;

	const opacityInter = opacity.interpolate({
		inputRange: [0, 1],
		outputRange: [0.6, 1]
	});

	function toggleShown(toggle) {
		Animated.timing(opacity, {
			toValue: toggle ? 1 : 0,
			duration: 300,
			useNativeDriver: true
		}).start();
	}

	const opacityStyle = {
		opacity: opacityInter,
		transform: [{ scale: opacityInter }]
	};

	useImperativeHandle(ref, () => ({
		toggleShown
	}));
	return (
		<StyledTouchableHighlight
			style={opacityStyle}
			activeOpacity={0.6}
			underlayColor={`${props.bgColor || '#DDDDDD'}`}
			className={`flex items-center justify-center rounded-full ${
				props.bgColor || 'bg-offwhite'
			} ${props.width || 'w-11/12'} ${props.height || 'h-[50px]'} ${
				props.borderColor
					? `border ${props.borderColor}`
					: 'border-none'
			} ${props.btnStyles || ''} `}
			onPress={() => {
				Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
				if (props.press) props.press();
				if (props.href) router.push(props.href);
			}}
		>
			<>
				<StyledText
					className={`font-bold ${
						props.textColor || 'text-offblack'
					} ${props.textSize || 'text-[20px]'} ${props.textStyles} ${
						props.icon ? 'hidden' : ''
					}`}
				>
					{props.title}
				</StyledText>
				<StyledIcon
					className={`${props.icon ? '' : 'hidden'}`}
					name={`${props.icon || 'md-checkmark-circle'}`}
					size={props.iconSize || 30}
					color={`${props.iconColor || '#121212'}`}
				/>
			</>
		</StyledTouchableHighlight>
	);
});

const ExpandableButton = forwardRef((props, ref) => {
	const [pressed, setPressed] = useState(props.expanded || false);
	const [wi, setWi] = useState(new Animated.Value(props.expanded ? 1 : 0));

	const deviceWidth = Dimensions.get('window').width;

	if (
		typeof props.expandedWidth == 'string' &&
		props.expandedWidth.includes('%')
	) {
		props.expandedWidth =
			deviceWidth * (parseInt(props.expandedWidth) / 100);
	}
	if (
		typeof props.collapsedWidth == 'string' &&
		collapsedWidth.includes('%')
	) {
		props.collapsedWidth =
			deviceWidth * (parseInt(props.collapsedWidth) / 100);
	}

	const wiInter = wi.interpolate({
		inputRange: [0, 1],
		outputRange: [
			props.collapsedWidth || '13%',
			props.expandedWidth || '100%'
		]
	});

	const btnWidth = {
		width: wiInter
	};

	function toggleButton(direction) {
		Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
		if (direction == 'expand') {
			setPressed(true);
			Animated.spring(wi, {
				toValue: 1,
				duration: 400,
				useNativeDriver: false
			}).start();
		} else if (direction == 'collapse') {
			setPressed(false);
			Animated.spring(wi, {
				toValue: 0,
				duration: 400,
				useNativeDriver: false
			}).start();
		} else {
			setPressed(!pressed);
			Animated.spring(wi, {
				toValue: pressed ? 0 : 1,
				duration: 400,
				useNativeDriver: false
			}).start();
		}
	}

	useImperativeHandle(ref, () => ({
		toggleButton,
		pressed
	}));

	return (
		<AnimatedHighlight
			style={btnWidth}
			activeOpacity={0.6}
			underlayColor={props.bgColor || '#DDD'}
			className={`flex items-center justify-center rounded-full ${
				props.bgColor || 'bg-offwhite'
			} ${props.width || 'w-11/12'} ${props.height || 'h-[50px]'} ${
				props.borderColor
					? `border ${props.borderColor}`
					: 'border-none'
			} ${props.btnStyles || ''} ${pressed ? 'z-10' : 'z-0'}`}
			onPressOut={toggleButton}
			onPress={() => {
				if (props.press) props.press();
				if (props.expandedHref && pressed)
					router.push(props.expandedHref);
				else if (props.href) router.push(props.href);
			}}
		>
			<>
				<StyledText
					/* style={{ opacity: wi }} */
					className={`${!pressed ? 'hidden' : 'flex'} font-bold  ${
						props.textColor || 'text-offblack'
					} ${props.textSize || 'text-[20px]'} ${props.textStyles}`}
				>
					{props.title}
				</StyledText>
				<StyledIcon
					name={`${props.icon || 'md-checkmark-circle'}`}
					size={props.iconSize || 30}
					color={`${props.iconColor || '#121212'}`}
					className={`${pressed ? 'hidden' : 'flex'}`}
				/>
			</>
		</AnimatedHighlight>
	);
});

export { Button, ExpandableButton };
