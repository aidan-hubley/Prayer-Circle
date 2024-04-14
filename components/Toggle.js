import React, { useState, useRef, forwardRef } from 'react';
import { View, Animated, Pressable } from 'react-native';
import { styled } from 'nativewind';
import * as Haptics from 'expo-haptics';
import { useStore } from '../app/global';
import { debounce } from '../backend/functions';

const StyledView = styled(View);

export const Toggle = forwardRef(
	({ width, height, offColor, onColor, toggle, onFunc, offFunc }, ref) => {
		const [isEnabled, setIsEnabled] = useState(toggle || false);
		const position = useRef(new Animated.Value(toggle ? 1 : 0)).current;
		const haptics = useStore((state) => state.haptics);

		const positionInter = position.interpolate({
			inputRange: [0, 1],
			outputRange: [5, 25]
		});
		const positionStyle = {
			left: positionInter
		};

		const togglePosition = () => {
			if (haptics) Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
			let direction = !isEnabled;
			setIsEnabled(direction);
			Animated.timing(position, {
				toValue: isEnabled ? 0 : 1,
				duration: 200,
				useNativeDriver: false
			}).start(() => {
				if (direction && onFunc) {
					onFunc();
				} else if (offFunc) {
					offFunc();
				}
			});
		};

		return (
			<Pressable
				onPress={debounce(() => {
					togglePosition();
				}, 300)}
				ref={ref}
			>
				<StyledView
					className={`${width || 'w-[50px]'} ${
						height || 'h-[28px]'
					} rounded-full border border-offwhite`}
					style={{
						backgroundColor: isEnabled
							? onColor || '#00A55E'
							: offColor || '#1D1D1D'
					}}
				>
					<Animated.View
						className='absolute top-1 w-[18px] h-[18px] rounded-full bg-white'
						style={positionStyle}
					/>
				</StyledView>
			</Pressable>
		);
	}
);
