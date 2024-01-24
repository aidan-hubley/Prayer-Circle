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
import { Toggle } from '../../components/Toggle';
import { Button } from '../../components/Buttons';
import { router, auth } from '../../backend/config';
import { passwordValidation } from '../../backend/functions';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { sendPasswordResetEmail } from 'firebase/auth';
import { updatePassword } from 'firebase/auth';
import { reauthenticateWithCredential, EmailAuthProvider } from 'firebase/auth';

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledSafeArea = styled(SafeAreaView);
const StyledInput = styled(TextInput);

export default function Page() {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const [isEnabled, setIsEnabled] = useState(false);
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

    const handleChangePassword = async () => {
        if (newPassword !== confirmPassword) {
            Alert.alert('Error', 'The new passwords do not match.');
            return;
        }

        if (!passwordValidation(newPassword)) {
            Alert.alert(
                'Invalid Password',
                'Password must be at least 8 characters long and contain at least 1 uppercase letter, lowercase letter, number, and special character'
            );
            return;
        }
        
        const user = auth.currentUser;
        if (user) {
            const credential = EmailAuthProvider.credential(
                user.email,
                currentPassword
            );

            try {
                await reauthenticateWithCredential(user, credential);

                await updatePassword(user, newPassword);
                Alert.alert('Success', 'Password has been updated successfully.');
                bottomSheetModalRef.current?.dismiss();
                setCurrentPassword('');
                setNewPassword('');
                setConfirmPassword('');
            } catch (error) {
                Alert.alert('Error', error.message);
            }
        } else {
            Alert.alert('Error', 'No user is currently signed in.');
        }
    };

    const snapPoints = useMemo(() => ['65%', '85%']);

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
				<StyledText className='text-white font-[600] text-[24px] pb-2'>
					Change Password
				</StyledText>
			</StyledView>
		);
	};

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
                                    Terms of Service
                                </Text>
                                <StyledView className='flex flex-row'>
                                    <Button // TODO: use component
                                        title='View'                                        
                                        width={'w-[80px]'}
                                        height={'h-[30px]'}
                                    ></Button>
                                </StyledView>
                            </View>
                        </View>
                        <StyledView className='mt-5 px-5 w-[80%] border border-outline rounded-full' />
                        <View className="flex-row items-center mt-5 px-5">
                            <View className="flex-row justify-between items-center bg-grey p-3 w-full rounded-xl">
                                <Text className="mr-3 text-lg text-offwhite">
                                    Update Account
                                </Text>
                                <StyledView className='flex flex-row'>
                                    <Button // TODO: add modal + backend
                                        title='Name'
                                        width={'w-[80px]'}
                                        height={'h-[30px]'}
                                        btnStyles='mr-3'
                                    ></Button>
                                    <Button // TODO: add modal + backend
                                        icon='camera'
                                        width={'w-[80px]'}
                                        height={'h-[30px]'}
                                        iconSize={26}
                                    ></Button>
                                </StyledView>
                            </View>
                        </View>
                        <View className="flex-row items-center mt-5 px-5">
                            <View className="flex-row justify-between items-center bg-grey p-3 w-full rounded-xl">
                                <Text className="mr-3 text-lg text-offwhite">
                                    Change Password
                                </Text>
                                <StyledView className='flex flex-row'>
                                    <Button
                                        icon='text'
                                        width={'w-[80px]'}
                                        height={'h-[30px]'}
                                        iconSize={26}
                                        press={handlePresentModalPress}
                                        btnStyles='mr-3'
                                    ></Button>
                                    <Button
                                        icon='mail'
                                        title='Title'
                                        width={'w-[80px]'}
                                        height={'h-[30px]'}
                                        iconSize={26}
                                        press={handlePasswordReset}
                                    ></Button>
                                </StyledView>
                            </View>
                        </View>   
                        <StyledView className='mt-5 px-5 w-[80%] border border-outline rounded-full' />
                        <View className="flex-row items-center mt-5 px-5">
                            <View className="flex-row justify-between items-center bg-grey p-3 w-full rounded-xl">
                                <Text className="mr-3 text-lg text-offwhite">
                                    All Notifications
                                </Text>
                            <Toggle onColor={'purple'}/>

                            </View>
                        </View>
                        <View className="flex-row items-center mt-5 px-5">
                            <View className="flex-row justify-between items-center bg-grey p-3 w-full rounded-xl">
                                <Text className="mr-3 text-lg text-offwhite">
                                    Timer
                                </Text>
                            <Toggle />
                            </View>
                        </View>                     
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
                            btnStyles='mt-5'
                            width='w-[70%]'
                            press={handleChangePassword}
                        />
                    </StyledView>
                </BottomSheetModal>
                <StyledView style={{bottom: insets.bottom}} className='absolute w-screen flex flex-row px-[15px] justify-between'>
                    <Button 
                        icon='person-circle-outline'
                        href='/mainViewLayout'
                        width={'w-[50px]'}
                        height={'h-[50px]'}
                        iconSize={30}
                        bgColor={'bg-offblack'}
                    >
                    </Button>
                    <Button
                        title='Sign Out'
                        width='w-[50%]'
                        press={() => {
                            signOut(auth);
                            AsyncStorage.removeItem('user');
                            AsyncStorage.removeItem('name');
                            router.replace('/login');
                        }}
                    />
                    <Button // TODO: Delete User modal + backend
                        icon='trash-outline'
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