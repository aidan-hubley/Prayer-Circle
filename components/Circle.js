import React, {
	useImperativeHandle,
	useRef,
	useState,
	forwardRef
} from 'react';
import { Pressable, View } from 'react-native';
import { styled } from 'nativewind';
import { Button } from './Buttons';
/* import { Timer } from './Timer'; */
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { useStore } from '../app/global';
import Ionicons from '@expo/vector-icons/Ionicons';
import {
	default as ReAnimated,
	useSharedValue,
	useAnimatedStyle,
	withSpring,
	withSequence,
	withTiming
} from 'react-native-reanimated';

const AnimatedPressable = ReAnimated.createAnimatedComponent(Pressable);
const StyledIcon = styled(Ionicons);

const Circle = forwardRef(({ filter, press, toggleSwiping }, ref) => {
	const [pressed, setPressed] = useState('none');

	const scale = useSharedValue(1);
	const bgOpacity = useSharedValue(0);
	const longOpacity = useSharedValue(0);

	const haptics = useStore((state) => state.haptics);

	const [
		currentFilter,
		currentFilterIcon,
		currentFilterColor,
		currentFilterIconColor
	] = useStore((state) => [
		state.filter,
		state.currentFilterIcon,
		state.currentFilterColor,
		state.currentFilterIconColor
	]);

	let insets = useSafeAreaInsets();
	let topButtonInset = insets.top > 30 ? insets.top : insets.top + 10;

	const circleStyle = useAnimatedStyle(() => {
		return {
			transform: [{ scale: scale.value }]
		};
	});
	const pressedStyle = useAnimatedStyle(() => {
		return {
			opacity: bgOpacity.value
		};
	});
	const longOpacityStyle = useAnimatedStyle(() => {
		return {
			opacity: longOpacity.value,
			bottom: insets.bottom < 15 ? insets.bottom + 90 : insets.bottom + 60
		};
	});

	function toggleLongOptions(val) {
		setPressed(val ? 'long' : 'none');
		toggleBackdrop(val);
		toggleSwiping(!val);
		longOpacity.value = withTiming(val ? 1 : 0);
	}
	function toggleShortOptions(val) {
		filter.current.toggleShown(val);
		setPressed(val ? 'short' : 'none');
		toggleSwiping(!val);
	}
	function toggleBackdrop(val) {
		bgOpacity.value = withTiming(val ? 0.7 : 0);
	}

	useImperativeHandle(ref, () => ({
		setPressed
	}));

	return (
		<>
			<AnimatedPressable
				style={pressedStyle}
				pointerEvents={pressed == 'long' ? 'auto' : 'none'}
				className={`absolute bottom-[-40px] left-[-100px] h-screen w-screen bg-[#121212]`}
				onPress={() => {
					if (haptics) Haptics.selectionAsync();
					toggleLongOptions();
					toggleShortOptions();
				}}
			/>

			<ReAnimated.View
				style={longOpacityStyle}
				pointerEvents={pressed == 'long' ? 'auto' : 'none'}
				className='flex flex-col items-center absolute w-screen'
			>
				<View
					style={{ top: topButtonInset - 500 }}
					className='absolute border border-outline rounded-3xl'
				/>
				<Button
					title='Draw a Circle'
					height='h-[65px]'
					width='w-11/12'
					press={() => {
						toggleLongOptions(false);
					}}
					href='/createCircle'
				/>
				<Button
					title='Search Circles'
					height='h-[65px]'
					btnStyles={'mt-3'}
					width='w-11/12'
					press={() => {
						toggleLongOptions(false);
					}}
					href='/findCircles'
				/>
			</ReAnimated.View>

			<AnimatedPressable
				style={[
					circleStyle,
					{
						borderColor:
							currentFilter !== 'unfiltered'
								? currentFilterColor
								: '#FFFBFC'
					}
				]}
				className={`justify-center rounded-full border-[6px] h-[80px] w-[80px] z-10`}
				onPressIn={() => {
					scale.value = withSpring(0.8);
				}}
				onLongPress={() => {
					if (pressed == 'none') {
						toggleLongOptions(true);
					} else if (pressed == 'short') {
						toggleLongOptions(true);
						filter.current.toggleShown(false);
					} else {
						toggleLongOptions(false);
						toggleShortOptions(false);
					}
					scale.value = withSpring(1);
					if (haptics)
						Haptics.notificationAsync(
							Haptics.NotificationFeedbackType.Success
						);
				}}
				onPress={() => {
					if (pressed == 'none') {
						toggleShortOptions(true);
					} else {
						toggleLongOptions(false);
						toggleShortOptions(false);
					}
					scale.value = withSpring(1);
					if (press) press();
					if (haptics)
						Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
				}}
			>
				{currentFilter !== 'unfiltered' && (
					<StyledIcon
						name={currentFilterIcon}
						size={38}
						color={currentFilterIconColor}
						className='self-center'
					/>
				)}
			</AnimatedPressable>
		</>
	);
});

export { Circle };
