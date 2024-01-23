import React, { useState, useRef, useCallback, useMemo } from 'react';
import {
    Text,
    View,
    TouchableOpacity,
    Animated,
    Alert,
    TextInput
} from 'react-native';
import {
    BottomSheetModal,
    BottomSheetBackdrop,
    BottomSheetModalProvider
} from '@gorhom/bottom-sheet';
import { styled } from 'nativewind';
import { signOut } from 'firebase/auth';
import { Button } from '../../components/Buttons';
import { router, auth } from '../../backend/config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { sendPasswordResetEmail } from 'firebase/auth';

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledAnimatedView = styled(Animated.createAnimatedComponent(View));
const StyledSafeArea = styled(SafeAreaView);
const StyledInput = styled(TextInput);

export default function Page() {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const [isEnabled, setIsEnabled] = useState(false);
    const toggleSwitch = () => setIsEnabled(previousState => !previousState);
    const togglePosition = useRef(new Animated.Value(1)).current;
    const insets = useSafeAreaInsets();
    const bottomSheetModalRef = useRef(null);

    const handlePasswordReset = async () => {
        const user = auth.currentUser;
        if (user && user.email) {
            try {
                await sendPasswordResetEmail(auth, user.email);
                Alert.alert(
                    "Check your email",
                    "A link to reset your password has been sent to your email address.",
                    [{ text: "OK", onPress: () => bottomSheetModalRef.current?.dismiss() }]
                );
            } catch (error) {
                Alert.alert("Error", error.message);
            }
        } else {
            Alert.alert("Error", "No user is currently signed in.");
        }
    };

    const snapPoints = useMemo(() => ['85%'], []);
    const handlePresentModalPress = useCallback(() => {
        bottomSheetModalRef.current?.present();
    }, []);
    const handleSheetChanges = useCallback((index) => {}, []);

    const backdrop = (backdropProps) => {
        return (
            <BottomSheetBackdrop
                {...backdropProps}
                opacity={0.5}
                appearsOnIndex={0}
                disappearsOnIndex={-1}
                enableTouchThrough={true}
            />
        );
    };

    	const handle = () => {
		return (
			<StyledView className='flex items-center justify-center w-screen bg-grey rounded-t-[10px] pt-3'>
				<StyledView className='w-[30px] h-[4px] rounded-full bg-[#dddddd11] mb-3' />
				<StyledText className='text-white font-[600] text-[24px]'>
					Change Password
				</StyledText>
			</StyledView>
		);
	};

    React.useEffect(() => {
        Animated.timing(togglePosition, {
            toValue: isEnabled ? 45 : 5,
            duration: 200,
            useNativeDriver: false
        }).start();
    }, [isEnabled]);

    return (
         <BottomSheetModalProvider>
            <StyledSafeArea className='bg-offblack border' style={{ flex: 1 }}>
                <StyledView className='flex-1 items-center mt-45 pt-10 py-5'>
                    <StyledText className='text-3xl text-offwhite text-center tracking-widest leading-10'>
                        Settings
                    </StyledText>
                        <View className="flex-row items-center mt-5 px-5">
                            <View className="flex-row justify-between items-center bg-grey p-3 w-full rounded-xl">
                                <Text className="mr-3 text-lg text-offwhite">
                                    Notifications
                                </Text>
                            <TouchableOpacity onPress={toggleSwitch}>
                                <StyledView
                                    className='pt-9 w-[80px] h-[30px] rounded-full '
                                    style={{
                                        backgroundColor: isEnabled
                                            ? '#00A55E'
                                            : '#F9A826'
                                    }}
                                >
                                    <StyledAnimatedView
                                        className='absolute top-1 w-[28px] h-[28px] rounded-full bg-white	'
                                        style={{
                                            left: togglePosition
                                        }}
                                    />
                                </StyledView>
                            </TouchableOpacity>
                            </View>
                        </View>
                    <Button
                        title='Change Password'
                        btnStyles='border-2 border-yellow mt-5'
                        bgColor='offblack'
                        textStyles='text-yellow'
                        width='w-[50%]'
                        press={handlePresentModalPress}
                    />
                    <Button
                        title='Sign Out'
                        width='w-[50%]'
                        btnStyles='mt-5'
                        press={() => {
                            signOut(auth);
                            AsyncStorage.removeItem('user');
                            AsyncStorage.removeItem('name');
                            router.replace('/login');
                        }}
                    />
                </StyledView>

                <BottomSheetModal
                    enableDismissOnClose={true}
                    ref={bottomSheetModalRef}
                    index={0}
                    snapPoints={snapPoints}
                    onChange={handleSheetChanges}
                    handleComponent={handle}
                    backdropComponent={(backdropProps) => backdrop(backdropProps)}
                    keyboardBehavior='extend'
                >
                    <StyledView className='flex-1 bg-grey p-4 items-center text-offwhite'>
                        <StyledInput
                            className='mt-5 p-2 w-[80%] border-[1px] border-offwhite rounded-xl text-offwhite'
                            placeholder="Current Password"
                            placeholderTextColor={'#fff'}
                            secureTextEntry={true}
                            value={currentPassword}
                            onChangeText={setCurrentPassword}
                        />
                        <StyledInput
                            className='mt-5 p-2 w-[80%] border-[1px] border-offwhite rounded-xl text-offwhite'
                            placeholder="New Password"
                            placeholderTextColor={'#fff'}
                            secureTextEntry={true}
                            value={newPassword}
                            onChangeText={setNewPassword}
                        />
                        <StyledInput
                            className='mt-5 p-2 w-[80%] border-[1px] border-offwhite rounded-xl text-offwhite'
                            placeholder="Confirm New Password"
                            placeholderTextColor={'#fff'}
                            secureTextEntry={true}
                            value={confirmPassword}
                            onChangeText={setConfirmPassword}
                        />

                        <Button
                            title='Confirm'
                            btnStyles='mt-5 border-2 border-yellow'
                            bgColor='bg-offblack'
                            textStyles='text-yellow'
                            width='w-[70%]'
                            press={() => bottomSheetModalRef.current?.dismiss()}
                        />

                        <Button
                            title='Change With Email'
                            btnStyles='mt-5 border-2 border-yellow'
                            bgColor='bg-offblack'
                            textStyles='text-yellow'
                            width='w-[70%]'
                            press={handlePasswordReset}
                        />
                        <Button
                            title='Cancel'
                            btnStyles='mt-5'
                            width='w-[70%]'
                            press={() => bottomSheetModalRef.current?.dismiss()}
                        />
                    </StyledView>
                </BottomSheetModal>
                <StyledView style={{bottom: insets.bottom}} className='absolute w-screen px-[15px]'>
                    <Button 
                        icon='person-circle-outline'
                        href='/mainViewLayout'
                        width={'w-[50px]'}
                        height={'h-[50px]'}
                        iconSize={30}
                    >
                    </Button>
                </StyledView>
            </StyledSafeArea>
        </BottomSheetModalProvider>
    );
}