import React, { useRef } from 'react';
import { Pressable, TouchableHighlight, Animated } from 'react-native';
import { styled } from 'nativewind';
import { Link } from 'expo-router';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import { router } from '../backend/config';

const AnimatedPressable = styled(Animated.createAnimatedComponent(Pressable));
const StyledLink = styled(Link);

export function Circle({ size, press }) {
	const scale = useRef(new Animated.Value(1)).current;
	const scaleInterpolation = scale.interpolate({
		inputRange: [0, 1],
		outputRange: [0.7, 1]
	});
	const scaleStyle = { scale: scaleInterpolation };

	function resize(target) {
		Animated.spring(scale, {
			toValue: target,
			useNativeDriver: true
		}).start();
	}

	const tap = Gesture.Tap().onEnd(() => {
		router.push('/filter');
	});
	const longPress = Gesture.LongPress().onStart(() => {
		router.push('/create');
	});

	const composed = Gesture.Simultaneous(tap, longPress); //Here

	return (
		<GestureDetector gesture={composed}>
			<AnimatedPressable
				style={{ transform: [{ scale: scaleInterpolation }] }}
				className={`flex items-center justify-center rounded-full border-[6px] border-offwhite
                ${size || 'h-44 w-44'} 
            `}
				onPressIn={() => {
					resize(0.7);
				}}
				onPressOut={() => {
					resize(1);
				}}
				onPress={() => press()}
			></AnimatedPressable>
		</GestureDetector>
	);
}
