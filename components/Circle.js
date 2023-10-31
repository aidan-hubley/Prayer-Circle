import React, { useRef, useState } from 'react';
import { Pressable, View, Animated } from 'react-native';
import { styled } from 'nativewind';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import { router } from '../backend/config';
import { Button } from './Buttons';
import { FilterCarousel } from './Filter';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const StyledView = styled(View);
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
		Animated.timing(menuOpacity, {
			toValue: val ? 1 : 0,
			duration: 200,
			useNativeDriver: true
		}).start();
	}

	const tap = Gesture.Tap().onEnd(() => {
		if (!shortpressed) {
			toggleOptions(true);
			setShortPressed(true);
			setLongPressed(false);
			if (longpressed) {			
				setLongPressed(false);
				setShortPressed(false);
				toggleOptions(false);
			}		
		} else {
			setShortPressed(false);
			toggleOptions(false);
		}

		resize(1);
	});
	const longPress = Gesture.LongPress().onStart(() => {
		if (!longpressed) {
			toggleOptions(true);
			setLongPressed(true);
			setShortPressed(false);
		} else {
			setLongPressed(false);
			toggleOptions(false);
		}

		resize(1);
	});

	const composed = Gesture.Simultaneous(tap, longPress); //Here

	return (
		<>
			<AnimatedPressable
				style={pressedStyle2}
				pointerEvents={pressed ? 'auto' : 'none'}
				className={`absolute bottom-[-40px] left-0 h-screen w-screen bg-[#121212]`}
			/>
			<AnimatedView
				style={pressedStyle}
				pointerEvents={pressed ? 'auto' : 'none'}
				className='flex flex-col items-center absolute w-screen'
			>
				{longpressed && (
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
					<>
						<Button
							icon='add-outline'
							iconColor='#FFFBFC'
							iconSize={50}
							height='h-[65px]'
							width='w-[65px]'
							bgColor='bg-offblack'
							borderColor='border-offwhite'
							btnStyles='absolute border-2 bottom-[-82px] left-[75px]'
						></Button>
						<StyledView className='absolute bottom-[-105px] w-full h-[300px]'>
							<StyledView className='flex w-full h-full'>
								<FilterCarousel />
							</StyledView>
						</StyledView>
						<Button
							icon='apps-outline'
							iconColor='#FFFBFC'
							iconSize={40}
							height='h-[65px]'
							width='w-[65px]'
							bgColor='bg-offblack'
							borderColor='border-offwhite'
							btnStyles='absolute border-2 bottom-[-82px] right-[75px]'
						></Button>
					</>					
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
