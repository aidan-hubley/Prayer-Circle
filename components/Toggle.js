import React, { useState, useRef, useEffect, forwardRef } from 'react';
import { View, Animated, TouchableOpacity } from 'react-native';
import { styled } from 'nativewind';

const StyledView = styled(View);

export const Toggle = forwardRef(
	({ width, height, offColor, onColor, toggle }, ref) => {
		const [isEnabled, setIsEnabled] = useState(toggle);
		const position = useRef(new Animated.Value(0)).current;

		const positionInter = position.interpolate({
			inputRange: [0, 1],
			outputRange: [5, 25]
		});
		const positionStyle = {
			left: positionInter
		};

		const togglePosition = () => {
			setIsEnabled(!isEnabled);
			Animated.timing(position, {
				toValue: isEnabled ? 1 : 0,
				duration: 200,
				useNativeDriver: false
			}).start();
		};

		return (
			<TouchableOpacity onPress={togglePosition} ref={ref}>
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
			</TouchableOpacity>
		);
	}
);
