import React, { useState, useRef, useEffect, forwardRef } from 'react';
import { View, Animated, TouchableOpacity } from 'react-native';
import { styled } from 'nativewind';

const StyledView = styled(View);
const StyledAnimatedView = styled(Animated.createAnimatedComponent(View));

export const Toggle = forwardRef(({ width, height, offColor, onColor }, ref) => {
    const [isEnabled, setIsEnabled] = useState(false);
    const togglePosition = useRef(new Animated.Value(isEnabled ? 32 : 5)).current;

    useEffect(() => {
        Animated.timing(togglePosition, {
            toValue: isEnabled ? 32 : 5,
            duration: 200,
            useNativeDriver: false
        }).start();
    }, [isEnabled]);

    const onToggle = () => {
        setIsEnabled(!isEnabled);
    };

    return (
        <TouchableOpacity onPress={onToggle} ref={ref}>
            <StyledView
                className={`${width || 'w-[60px]'} ${height || 'h-[30px]'} rounded-full border-2 border-offwhite`}
                style={{
                    backgroundColor: isEnabled
                        ? onColor || '#00A55E'
                        : offColor || '#1D1D1D'
                }}
            >
                <StyledAnimatedView
                    className='absolute top-1 w-[18px] h-[18px] rounded-full bg-white'
                    style={{
                        left: togglePosition
                    }}
                />
            </StyledView>
        </TouchableOpacity>
    );
});