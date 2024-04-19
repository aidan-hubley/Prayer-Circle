import React, {
	useState,
	useRef,
	forwardRef,
	useImperativeHandle
} from 'react';
import { Text, TouchableHighlight, Animated, Dimensions } from 'react-native';
import { styled } from 'nativewind';
import { router } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import * as Haptics from 'expo-haptics';
import { useStore } from '../app/global';

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
	const haptics = useStore((state) => state.haptics);

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
			style={[opacityStyle, { borderColor: props.borderColor }]}
			activeOpacity={0.6}
			underlayColor={`${props.bgColor || '#DDDDDD'}`}
			className={`flex items-center justify-center rounded-full ${
				props.bgColor || 'bg-offwhite'
			} ${props.width || 'w-11/12'} ${props.height || 'h-[50px]'} ${
				props.borderColor ? `border` : 'border-none'
			} ${props.borderWidth || ''} ${props.btnStyles || ''} `}
			onPress={() => {
				if (haptics)
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
		const haptics = useStore((state) => state.haptics);

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

		function toggleButton(direction) {
			if (haptics) Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
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
				underlayColor={bgColor || '#DDD'}
				className={`flex items-center justify-center rounded-full ${
					bgColor || 'bg-offwhite'
				} ${width || 'w-11/12'} ${height || 'h-[50px]'} ${
					borderColor ? `border ${borderColor}` : 'border-none'
				} ${btnStyles || ''} ${pressed ? 'z-10' : 'z-0'}`}
				onPressOut={() => {
					toggleButton();
				}}
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
