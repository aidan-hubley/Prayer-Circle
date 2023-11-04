import React, { useRef, useState } from 'react';
import { Pressable, View, Animated, Text } from 'react-native';
import { styled } from 'nativewind';
import { Button } from './Buttons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useSharedValue } from 'react-native-reanimated';
import { Filter } from './Filter';

const AnimatedPressable = styled(Animated.createAnimatedComponent(Pressable));
const AnimatedView = styled(Animated.createAnimatedComponent(View));
const StyledText = styled(Text);

export function Circle({ circles, press }) {
	let insets = useSafeAreaInsets();
	const scale = useRef(new Animated.Value(1)).current;
	const [pressed, setPressed] = useState('none');
	const longOpacity = useRef(new Animated.Value(0)).current;
	const shortOpacity = useRef(new Animated.Value(0)).current;
	const bgOpacity = useRef(new Animated.Value(0)).current;
	const filterRef = useRef();

	const scaleInterpolation = scale.interpolate({
		inputRange: [0, 1],
		outputRange: [0.7, 1]
	});

	const longOpacityInter = longOpacity.interpolate({
		inputRange: [0, 1],
		outputRange: [0, 1]
	});
	const shortOpacityInter = shortOpacity.interpolate({
		inputRange: [0, 1],
		outputRange: [0, 1]
	});
	const bgOpacityInter = bgOpacity.interpolate({
		inputRange: [0, 1],
		outputRange: [0, 0.7]
	});

	const longPressedStyle = {
		opacity: longOpacityInter,
		bottom: insets.bottom < 15 ? insets.bottom + 90 : insets.bottom + 60
	};
	const shortPressedStyle = {
		opacity: shortOpacityInter,
		bottom: insets.bottom < 15 ? insets.bottom + 90 : insets.bottom + 60
	};
	const pressedStyle = { opacity: bgOpacityInter };

	function resize(target) {
		Animated.spring(scale, {
			toValue: target,
			useNativeDriver: true
		}).start();
	}

	function toggleLongOptions(val) {
		setPressed(val ? 'long' : 'none');
		toggleBackdrop(val);
		Animated.timing(longOpacity, {
			toValue: val ? 1 : 0,
			duration: 200,
			useNativeDriver: true
		}).start();
	}
	function toggleShortOptions(val) {
		setPressed(val ? 'short' : 'none');
		toggleBackdrop(val);
		filterRef.current.toggleShown(val);
	}
	function toggleBackdrop(val) {
		Animated.timing(bgOpacity, {
			toValue: val ? 1 : 0,
			duration: 200,
			useNativeDriver: true
		}).start();
	}

	return (
		<>
			<AnimatedPressable
				style={pressedStyle}
				pointerEvents={pressed != 'none' ? 'auto' : 'none'}
				className={`absolute bottom-[-40px] left-[-100px] h-screen w-screen bg-[#121212]`}
				onPress={() => {
					toggleLongOptions();
					toggleShortOptions();
				}}
			/>
			<AnimatedView
				style={longPressedStyle}
				pointerEvents={pressed == 'long' ? 'auto' : 'none'}
				className='flex flex-col items-center absolute w-screen'
			>
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
					title='Sketch a Post'
					height='h-[65px]'
					btnStyles={'mt-3'}
					width='w-11/12'
					press={() => {
						toggleLongOptions(false);
					}}
					href='/createPost'
				/>
			</AnimatedView>
			<AnimatedView
				style={(shortPressedStyle, { position: 'absolute', bottom: 0 })}
				pointerEvents={pressed == 'short' ? 'auto' : 'none'}
				className='flex flex-col items-center w-screen'
			>
				<Filter data={circles} ref={filterRef} />
			</AnimatedView>
			<AnimatedPressable
				style={{ transform: [{ scale: scaleInterpolation }] }}
				className={`rounded-full border-[6px] border-offwhite
                h-[80px] w-[80px]
            `}
				onPressIn={() => {
					resize(0.7);
				}}
				onLongPress={() => {
					if (pressed == 'none') {
						toggleLongOptions(true);
					} else {
						toggleLongOptions(false);
						toggleShortOptions(false);
					}
					resize(1);
				}}
				onPressOut={() => {
					resize(1);
				}}
				onPress={() => {
					if (pressed == 'none') {
						toggleShortOptions(true);
					} else {
						toggleLongOptions(false);
						toggleShortOptions(false);
					}
					if (press) press();
				}}
			></AnimatedPressable>
		</>
	);
}
