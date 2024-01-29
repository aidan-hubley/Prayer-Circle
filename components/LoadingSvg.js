import React, { forwardRef } from 'react';
import { View } from 'react-native';
import Svg, { Path, G } from 'react-native-svg';
import Animated, { useAnimatedStyle, withRepeat, withTiming } from 'react-native-reanimated';
import { styled } from 'nativewind';

const StyledView = styled(View);
const StyledSvg = styled(Svg);
const AnimatedPath = Animated.createAnimatedComponent(Path);

export const Loading = () => {
    // const animatedStyle1 = useAnimatedStyle(() => {
    //     return {
    //         strokeDashoffset: withRepeat(withTiming(0, { duration: 2500 }), -1, true),
    //     };
    // });

    // const animatedStyle2 = useAnimatedStyle(() => {
    //     return {
    //         strokeDashoffset: withRepeat(withTiming(1400, { duration: 2500 }), -1),
    //     };
    // });

    // const animatedStyle3 = useAnimatedStyle(() => {
    //     return {
    //         strokeDashoffset: withRepeat(withTiming(1370, { duration: 2500 }), -1),
    //     };
    // });

    // const animatedStyle4 = useAnimatedStyle(() => {
    //     return {
    //         strokeDashoffset: withRepeat(withTiming(2500, { duration: 2500 }), -1),
    //     };
    // });

    // const animatedStyle5 = useAnimatedStyle(() => {
    //     return {
    //         strokeDashoffset: withRepeat(withTiming(1050, { duration: 2500 }), -1),
    //     };
    // });

    // const animatedStyle6 = useAnimatedStyle(() => {
    //     return {
    //         strokeDashoffset: withRepeat(withTiming(1100, { duration: 2500 }), -1),
    //     };
    // });

    const animatedStyle7 = useAnimatedStyle(() => {
        return {
            strokeDashoffset: withRepeat(withTiming(5000, { duration: 2500 }), -1),
        };
    });

    return (
        <StyledView className='flex-1 align-center p-[20px] m-[20px] rotate-180'>
            <StyledSvg className='w-[160px] h-[200px]' height="200" viewBox="0 0 1000 2000">
                <G transform="translate(-400, 75)">
                    {/* <AnimatedPath
                        id="path1"
                        stroke="white"
                        strokeWidth="15"
                        fill="transparent"
                        d="M990 1587 c0 -38 -14 -55 -99 -119 -68 -51 -85 -79 -89 -151 -3 -48
                            1 -76 20 -122 l23 -60 5 70 c6 82 14 99 72 150 24 21 48 48 54 59 11 19 12 18
                            28 -12 33 -63 12 -156 -48 -216 l-39 -39 43 24 c109 60 150 227 90 366 -12 29
                            -30 59 -41 69 -18 17 -19 16 -19 -19z"
                        style={animatedStyle1}
                    />
                    <Path
                        id="path2"
                        stroke="white"
                        strokeWidth="15"
                        fill="transparent"
                        d="M800 1109 c-61 -9 -148 -35 -167 -51 -7 -6 -13 -23 -13 -38 l0 -28
                            58 24 c137 55 357 51 505 -11 14 -6 17 -2 17 23 0 28 -5 32 -53 51 -97 36
                            -231 48 -347 30"
                        style={animatedStyle2}
                    />
                    <Path
                        id="path3"
                        stroke="white"
                        strokeWidth="15"
                        fill="transparent"
                        d="M775 1006 c-107 -21 -125 -30 -125 -65 l0 -29 63 21 c90 30 316 30
                            400 0 l58 -20 -3 31 c-3 28 -8 32 -63 48 -80 25 -241 31 -330 14"
                        style={animatedStyle3}
                    />
                    <Path
                        id="path4"
                        stroke="white"
                        strokeWidth="15"
                        fill="transparent"
                        d="M780 913 c-14 -2 -42 -9 -63 -14 -36 -10 -38 -11 -23 -28 14 -15 16
                            -49 16 -223 0 -114 -3 -214 -6 -223 -4 -9 -33 -30 -66 -46 -33 -17 -58 -33
                            -55 -36 3 -2 43 5 89 16 130 32 251 44 395 39 l133 -5 0 39 c0 38 0 38 -40 38
                            l-40 0 0 200 c0 175 2 200 17 208 12 7 -1 14 -55 26 -106 24 -129 22 -151 -15
                            l-19 -31 -18 31 c-19 32 -41 37 -114 24"
                        style={animatedStyle4}
                    />
                    <Path
                        id="path5"
                        stroke="white"
                        strokeWidth="15"
                        fill="transparent"
                        d="M780 913 m78 -65 c13 -13 18 -384 5 -391 -5 -2 -25 -7 -45 -11 l-38
                            -7 0 191 c0 113 4 199 10 211 12 21 50 25 68 7"
                        style={animatedStyle5}
                    />
                    <Path
                        id="path6"
                        stroke="white"
                        strokeWidth="15"
                        fill="transparent"
                        d="M780 913 m78 -65 m170 0 c8 -8 12 -66 12 -195 l0 -183 -45 0 -45 0 0
                            169 c0 93 4 181 10 195 10 28 47 35 68 14"
                        style={animatedStyle6}
                    /> */}
                    <Path
                        id="path7"
                        stroke="white"
                        strokeWidth="15"
                        fill="transparent"
                        d="M820 1705 c-67 -68 -179 -147 -257 -181 -70 -31 -193 -64 -240 -64
                            -23 0 -42 -8 -58 -25 -25 -24 -25 -27 -25 -192 0 -250 25 -394 102 -583 94
                            -232 261 -437 471 -577 84 -56 98 -54 205 19 163 113 314 292 407 483 99 204
                            135 376 135 653 0 167 -1 174 -23 196 -17 16 -40 25 -83 30 -163 18 -322 98
                            -458 229 -89 85 -103 86 -176 12z"
                        style={animatedStyle7}
                    />                    
                </G>
            </StyledSvg>
        </StyledView>
    );
}