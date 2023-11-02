import React, { useState, useRef } from "react";
import {
    SafeAreaView,
    Text,
    View,
    TextInput,
    TouchableOpacity,
    Image
} from "react-native";
import { styled } from "nativewind";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { Button } from "../components/Buttons";
import { useActionSheet } from "@expo/react-native-action-sheet";
import { Camera, CameraType, useWebQRScanner } from "expo-camera";

const StyledSafeArea = styled(SafeAreaView);
const StyledView = styled(View);
const StyledText = styled(Text);
const StyledInput = styled(TextInput);
const StyledOpacity = styled(TouchableOpacity);
const StyledCamera = styled(Camera);

export default function Page() {
    const [code, setCode] = useState("");
    const [type, setType] = useState(CameraType.back);
    const [permission, requestPermission] = Camera.useCameraPermissions();

    return (
        <StyledSafeArea className="bg-offblack border" style={{ flex: 1 }}>
            <KeyboardAwareScrollView>
                <StyledView className="flex items-center justify-center text-center w-screen h-[90px]">
                    <StyledText className="text-offwhite font-bold text-4xl">
                        Join New Circle:
                    </StyledText>
                </StyledView>
                <StyledView className="flex-row justify-center">
                    <StyledView className="w-[300px] h-[300px] border-2 border-offwhite">
                        <StyledCamera
                            mirrorImage={true}
                            fixOrientation={true}
                            className="w-full h-full"
                            type={type}
                            ratio="1:1"
                            useWebQRScanner
                        ></StyledCamera>
                    </StyledView>
                </StyledView>
                <StyledView className="flex items-center justify-center text-center w-screen h-[90px]">
                    <StyledText className="text-offwhite font-bold text-4xl">
                        Circle Code:
                    </StyledText>
                </StyledView>
                <StyledView className="flex items-center justify-center">
                    <StyledInput
                        className="bg-offblack text-[18px] flex-1 w-[300px] h-[42px] text-offwhite border border-offwhite rounded-lg px-3 py-[5px] mr-1"
                        placeholder={"Code:"}
                        placeholderTextColor={"#ffffff66"}
                        inputMode="numeric"
                        maxLength={8}
                        onChangeText={(text) => {
                            setCode(text);
                        }}
                        ref={(input) => {
                            this.searchCode = input;
                        }}
                    />
                </StyledView>
                <StyledView className="w-[365px] items-center">
                    <StyledView className="flex-row items-center justify-between h-[90px] w-[300px]">
                        <Button
                            title="Cancel"
                            width="w-[125px]"
                            height="h-[60px]"
                            href="/mainViewLayout"
                            bgColor={"bg-offblack"}
                            borderColor={"border-offwhite border-2"}
                            textColor={"text-offwhite"}
                            press={() => {
                                this.searchCode.clear();
                            }}
                        />
                        <Button
                            title="Search"
                            width="w-[125px]"
                            height="h-[60px]"
                            href="/mainViewLayout"
                            press={async () => {
                                if (code.length < 8) {
                                    alert("Please enter 8 digits");
                                    return;
                                } else {
                                    alert(code);
                                }
                                this.searchCode.clear();
                            }}
                        />
                    </StyledView>
                </StyledView>
            </KeyboardAwareScrollView>
        </StyledSafeArea>
    );
}
