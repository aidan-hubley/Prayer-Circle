import React, { useEffect, useRef } from "react";
import { Animated, Text, View, Image, TouchableOpacity } from "react-native";
import { StyleSheet } from 'react-native';
import { Easing } from 'react-native';
import { styled } from "nativewind";

const StyledView = styled(View);
const StyledText = styled(Text);

export default function Page() {

    return (
        <StyledView className="flex-1 items-center pt-10 bg-black">
            <StyledText className="text-3xl text-white text-center tracking-widest leading-10">
                Feed!
            </StyledText>
        </StyledView >
    );
}
