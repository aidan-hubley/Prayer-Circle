import React from "react";
import { Text, View, StatusBar } from "react-native";
import { styled } from "nativewind";
import { Button } from "../components/Buttons";
import { SafeAreaView } from 'react-native-safe-area-context';


const StyledSafeArea = styled(SafeAreaView);
const StyledView = styled(View);
const StyledText = styled(Text);

export default function Page() {
    return (
        <StyledSafeArea className="bg-offblack border" style={{ flex: 1 }}>
            <StyledView className="flex-1 items-center mt-20 pt-10">
                <StyledText className="text-3xl text-white text-center tracking-widest leading-10">
                    Filter
                </StyledText>
                <Button title="Feed" href="/mainViewLayout" />
                {/* Temporary Button*/}
                <Button title="Join New Circle" href="/joinCircle" />
            </StyledView>
        </StyledSafeArea>
    );
}
