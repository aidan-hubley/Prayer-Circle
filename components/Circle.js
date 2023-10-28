import React, { useRef, useState } from 'react';
import { Pressable, View, Animated } from 'react-native';
import { styled } from 'nativewind';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import { router } from '../backend/config';
import { Button } from './Buttons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const AnimatedPressable = styled(Animated.createAnimatedComponent(Pressable));
const AnimatedView = styled(Animated.createAnimatedComponent(View));

export function Circle({ size, press }) {
	let insets = useSafeAreaInsets();
	const scale = useRef(new Animated.Value(1)).current;
	const [pressed, setPressed] = useState(false);
	const [shortpressed, setShortPressed] = useState(false);
	const [longpressed, setLongPressed] = useState(false);
	const menuOpacity = useRef(new Animated.Value(0)).current;

	const scaleInterpolation = scale.interpolate({
		inputRange: [0, 1],
		outputRange: [0.7, 1]
	});

	const opacityInterpolation1 = menuOpacity.interpolate({
		inputRange: [0, 1],
		outputRange: [0, 1]
	});
	const opacityInterpolation2 = menuOpacity.interpolate({
		inputRange: [0, 1],
		outputRange: [0, 0.7]
	});

	const scaleStyle = { scale: scaleInterpolation };
	const pressedStyle = {
		opacity: opacityInterpolation1,
		bottom: insets.bottom < 15 ? insets.bottom + 90 : insets.bottom + 60
	};
	const pressedStyle2 = { opacity: opacityInterpolation2 };

	function resize(target) {
		Animated.spring(scale, {
			toValue: target,
			useNativeDriver: true
		}).start();
	}

	function toggleOptions(val) {
		setPressed(!pressed);
		Animated.timing(menuOpacity, {
			toValue: val ? 1 : 0,
			duration: 200,
			useNativeDriver: true
		}).start();
	}

	function toggleOptionsShort(val) {
		setPressed(!pressed);
		setShortPressed(!shortpressed);
	}

	function toggleOptionsLong(val) {
		setPressed(!pressed);
		setLongPressed(!longpressed);
	}

	const tap = Gesture.Tap().onEnd(() => {
		toggleOptionsShort(true);
		resize(1);
		console.log('tap');
	});
	const longPress = Gesture.LongPress().onStart(() => {
		toggleOptionsLong(true);
		resize(1);
		console.log('long press');
	});

	const composed = Gesture.Simultaneous(tap, longPress); //Here

	return (
		<>
			<AnimatedPressable
				style={pressedStyle2}
				pointerEvents={pressed ? 'auto' : 'none'}
				className={`absolute bottom-[-40px] left-0 h-screen w-screen bg-[#121212]`}
				onPress={() => {
					toggleOptions();
				}}
			/>
			<AnimatedView
				style={pressedStyle}
				pointerEvents={pressed ? 'auto' : 'none'}
				className='flex flex-col items-center absolute w-screen'
			>
				{longpressed && (
					// Render these buttons when pressed is true (long press)
					<>
						<Button
							title='Draw a Circle'
							height='h-[65px]'
							width='w-11/12'
							press={() => {
								toggleOptions(false);
							}}
							href='/createCircle'
						/>
						<Button
							title='Sketch a Post'
							height='h-[65px]'
							btnStyles={'mt-3'}
							width='w-11/12'
							press={() => {
								toggleOptions(false);
							}}
							href='/createPost'
						/>
					</>
				)}

				{shortpressed && (
					// Render this button when pressed is false (short tap)
					<Button
						title='Filter Feed'
						height='h-[65px]'
						btnStyles={'mt-3'}
						width='w-11/12'
						press={() => {
							toggleOptions(false);
						}}
						href='/filter'
					/>
				)}
			</AnimatedView>

			<GestureDetector gesture={composed}>
				<AnimatedPressable
					style={{ transform: [{ scale: scaleInterpolation }] }}
					className={`rounded-full border-[6px] border-offwhite
                h-[80px] w-[80px]
            `}
					onPressIn={() => {
						resize(0.7);
					}}
					onPressOut={() => {
						resize(1);
					}}
					onPress={() => {
						if (press) press();
					}}
				></AnimatedPressable>
			</GestureDetector>
		</>
	);
}
