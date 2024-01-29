import React, { forwardRef } from 'react';
import { View } from 'react-native';
import { AnimatedSVGPath } from "react-native-svg-animations";
import { styled } from 'nativewind';

const StyledView = styled(View);

export const Loading = () => {
    return (
        <StyledView className='flex-1 align-center p-[20px] m-[20px] border border-white'>
            <AnimatedSVGPath
                reverse={true}
                fill={"#00A55E"}
                duration={2500}
                strokeWidth={15}
                strokeLinecap={"round"}
                height={362}
                width={362}
                delay={250}
                loop={true}
                d="M181.373 267.372L181.52 247.838L181.59 247.767C158.425 248.107 119.286 232.376 118.011 184.405C97.0124 184.497 117.978 184.51 97.0896 184.391C96.9591 239.171 138.145 267.633 181.373 267.372Z"
            />
            <AnimatedSVGPath
                strokeColor={"#F9A826"}
                duration={2500}
                strokeWidth={15}
                strokeLinecap={"round"}
                height={362}
                width={362}
                delay={250}
                loop={true}
                d="M265 186.527C265 183.221 265 184.864 265 183.218L245.467 183.071L245.395 183.001C243.493 220.061 220.216 239.283 197.269 245.387C180.2 249.926 163.014 247.142 148.622 238.694C136.255 231.434 125.754 219.992 121.423 205.42C123.32 238.882 148.641 266.617 182.02 267.502C232.832 267.503 265.131 221.854 265 186.527Z"
            />
        </StyledView>
    );
}