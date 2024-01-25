import React, { useState, useRef, useCallback, useMemo } from 'react';
import {
    Text,
    View,
    TouchableOpacity,
    Animated,
    Image,
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
import { Timer } from '../../components/Timer';
import { Button } from '../../components/Buttons';
import Ionicons from '@expo/vector-icons/Ionicons';
import { router, auth } from '../../backend/config';
import { passwordValidation } from '../../backend/functions';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { sendPasswordResetEmail } from 'firebase/auth';
import { updatePassword } from 'firebase/auth';
import { reauthenticateWithCredential, EmailAuthProvider } from 'firebase/auth';

const StyledView = styled(View);
const StyledIcon = styled(Ionicons);
const StyledText = styled(Text);
const StyledImage = styled(Image);
const StyledSafeArea = styled(SafeAreaView);
const StyledOpacity = styled(TouchableOpacity);
const StyledInput = styled(TextInput);

export default function Page() {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [selectedReminder, setSelectedReminder] = useState(new Animated.Value(0));
    const [isEnabled, setIsEnabled] = useState(false);
    const [modalContent, setModalContent] = useState(null);
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

    const handlePresentModalPress = useCallback(() => {
        bottomSheetModalRef.current?.present();
    }, []);

    const handlePasswordModalPress = () => {
        setModalContent('password');
        handlePresentModalPress();
    };

    const handleTimerButtonPress = () => {
        setModalContent('timer');
        handlePresentModalPress();
    };

	const selectedReminderInter = selectedReminder.interpolate({
		inputRange: [0, 1, 2, 3, 4, 5, 6],
		outputRange: ['0%', '14.28%', '28.56%', '42.84%', '57.12%', '71.4%', '85.68%']
	});

	const handleReminderPress = (index) => {
		Animated.spring(selectedReminder, {
			toValue: index,
			duration: 200,
			useNativeDriver: false
		}).start();
	};

	const highlightPosition = {
		left: selectedReminderInter
	};

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
        switch (modalContent) {
        case 'password':
            return (
                <StyledView className='flex items-center justify-center w-screen bg-grey rounded-t-[10px] pt-3'>
                    <StyledView className='w-[30px] h-[4px] rounded-full bg-[#FFFBFC] mb-3' />
                    <StyledText className='text-white font-[600] text-[24px] pb-2'>
                        Change Password
                    </StyledText>
                </StyledView>
            );
        case 'timer':
            return (
                <StyledView className='flex items-center justify-center w-screen bg-grey rounded-t-[10px] pt-3'>
                    <StyledView className='w-[30px] h-[4px] rounded-full bg-[#FFFBFC] mb-3' />
                    <StyledText className='text-white font-[600] text-[24px] pb-2'>
                        Presence Timers
                    </StyledText>
                </StyledView>
            );
        default:
            return null;
        }
	};

    const renderContent = () => {
        switch (modalContent) {
        case 'password':
            return (
                <StyledView className='flex-1 bg-grey p-4 items-center text-offwhite'>
                    <StyledInput
                        className='mt-5 p-2 w-[80%] border-[1px] border-offwhite rounded-xl text-offwhite'
                        placeholder="Current Password"
                        placeholderTextColor={'#FFFBFC'}
                        secureTextEntry={true}
                        value={currentPassword}
                        onChangeText={setCurrentPassword}
                    />
                    <StyledInput
                        className='mt-5 p-2 w-[80%] border-[1px] border-offwhite rounded-xl text-offwhite'
                        placeholder="New Password"
                        placeholderTextColor={'#FFFBFC'}
                        secureTextEntry={true}
                        value={newPassword}
                        onChangeText={setNewPassword}
                    />
                    <StyledInput
                        className='mt-5 p-2 w-[80%] border-[1px] border-offwhite rounded-xl text-offwhite'
                        placeholder="Confirm New Password"
                        placeholderTextColor={'#FFFBFC'}
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
            );
        case 'timer':
            return (
                <StyledView className='flex-1 bg-grey py-3 items-center text-offwhite'>
                    <Timer></Timer>
                    <StyledText className='mt-3 text-[16px] font-bold text-center text-offwhite'>*Keep track of your time spent on Prayer Circle</StyledText>
                </StyledView>
            );
        default:
            return null;
        }
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
                                        icon='eye'
                                        iconColor={'#FFFBFC'}                                        
                                        width={'w-[65px]'}
                                        height={'h-[35px]'}
                                        bgColor={'bg-transparent'}
                                        textColor={'text-offwhite'}
                                        borderColor={'border-offwhite'}
                                        btnStyles='border-2'
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
                                        height={'h-[35px]'}
                                        bgColor={'bg-transparent'}
                                        textColor={'text-offwhite'}
                                        borderColor={'border-offwhite'}
                                        btnStyles='mr-3 border-2'
                                    ></Button>
                                    <Button // TODO: add modal + backend
                                        icon='camera'
                                        width={'w-[65px]'}
                                        height={'h-[35px]'}
                                        bgColor={'bg-transparent'}
                                        borderColor={'border-offwhite'}
                                        btnStyles='border-2'
                                        iconSize={26}
                                        iconColor={'#FFFBFC'}
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
                                        height={'h-[35px]'}
                                        iconSize={26}
                                        press={handlePasswordModalPress}
                                        bgColor={'bg-transparent'}
                                        borderColor={'border-offwhite'}
                                        iconColor={'#FFFBFC'}
                                        btnStyles='mr-3 border-2'
                                    ></Button>
                                    <Button
                                        icon='mail'
                                        width={'w-[65px]'}
                                        height={'h-[35px]'}
                                        bgColor={'bg-transparent'}
                                        borderColor={'border-offwhite'}
                                        iconSize={26}
                                        iconColor={'#FFFBFC'}
                                        btnStyles='border-2'
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
                            <Toggle onColor={'purple'} />
                            {/* TODO: More notification settings options */}
                            </View>
                        </View>
                        <StyledView className='mt-5 px-5 w-[80%] border border-outline rounded-full' />
                        <View className="flex-row mt-5 px-5">
                            <View className="justify-between bg-grey p-3 w-full rounded-xl">
                                <StyledView className="flex-row pb-5 w-full">
                                    <Text className="text-lg text-offwhite pr-1">
                                        Presence Timers
                                    </Text>
                                    <StyledView className="absolute right-1">
                                        <Button
                                            icon='list'
                                            width={'w-[30px]'}
                                            height={'h-[30px]'}
                                            bgColor={'bg-transparent'}
                                            iconSize={30}
                                            iconColor={'#FFFBFC'}                                        
                                            press={handleTimerButtonPress}
                                        ></Button>
                                    </StyledView>
                                </StyledView>
                                <StyledView className="w-full flex-row justify-center">
                                    <StyledView className="flex-row">
                                        <StyledImage source={require('../../assets/timers/calendar-day.png')} className="w-[30px] h-[30px] mr-2"/>
                                        <Toggle />
                                    </StyledView>
                                    <StyledView className="flex-row px-6">
                                        <StyledImage source={require('../../assets/timers/calendar-week.png')} className="w-[30px] h-[30px] mr-2"/>
                                        <Toggle />
                                    </StyledView>
                                    <StyledView className="flex-row">
                                        <StyledIcon name="infinite" size={30} color="#FFFBFC" className="w-[30px] h-[30px] mr-2"/>
                                        <Toggle onColor={'#F9A826'}/>
                                    </StyledView>
                                </StyledView>
                            </View>
                        </View>      
                        <View className="flex-row mt-5 px-5">
                            <View className="justify-between bg-grey p-3 w-full rounded-xl">
                                <StyledView className="flex-row pb-5 w-full">
                                    <Text className="text-lg text-offwhite pr-1">
                                        Presence Time Reminder
                                    </Text>
                                    <StyledView className="absolute right-1">
                                        <Button
                                            icon='information-circle-outline'
                                            width={'w-[30px]'}
                                            height={'h-[30px]'}
                                            bgColor={'bg-transparent'}
                                            iconSize={30}
                                            iconColor={'#FFFBFC'}                                        
                                            press={handleTimerButtonPress}
                                        ></Button>
                                    </StyledView>
                                </StyledView>
                                <StyledView className="w-full flex-row justify-between pr-1">
                                    <StyledOpacity className='' onPress={() => handlePress(0)}>
                                        <StyledText className="text-lg text-offwhite">
                                            <StyledIcon name="power" size={22} color="#FFFBFC"/>
                                        </StyledText>
                                    </StyledOpacity>                            
                                    <StyledOpacity className='' onPress={() => handlePress(1)}>
                                        <StyledText className="text-lg text-offwhite">15 m</StyledText>
                                    </StyledOpacity>
                                    <StyledOpacity className='' onPress={() => handlePress(2)}>
                                        <StyledText className="text-lg text-offwhite">30 m</StyledText>
                                    </StyledOpacity>                                    
                                    <StyledOpacity className='' onPress={() => handlePress(3)}>
                                        <StyledText className="text-lg text-offwhite">1 h</StyledText>
                                    </StyledOpacity>                                    
                                    <StyledOpacity className='' onPress={() => handlePress(4)}>
                                        <StyledText className="text-lg text-offwhite">1.5 h</StyledText>
                                    </StyledOpacity>                                    
                                    <StyledOpacity className='' onPress={() => handlePress(5)}>
                                        <StyledText className="text-lg text-offwhite">2 h</StyledText>
                                    </StyledOpacity>                                    
                                    <StyledOpacity className='' onPress={() => handlePress(6)}>
                                        <StyledText className="text-lg text-offwhite">
                                            <StyledIcon name="add-circle-outline" size={24} color="#FFFBFC"/>
                                        </StyledText>
                                    </StyledOpacity>                                    
                                </StyledView>
                            </View>
                        </View>
                </StyledView>
                
                <StyledView style={{bottom: insets.bottom}} className='absolute w-screen flex flex-row px-[15px] justify-between'>
                    <Button 
                        icon='person-circle-outline'
                        href='/mainViewLayout'
                        width={'w-[50px]'}
                        height={'h-[50px]'}
                        iconSize={30}
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

                <BottomSheetModal
                    enableDismissOnClose={true}
                    ref={bottomSheetModalRef}
                    index={0}
                    snapPoints={modalContent === 'timer' ? ['35%'] : ['65%', '85%']}
                    onChange={handleSheetChanges}
                    handleComponent={handle}
                    backdropComponent={(backdropProps) => backdrop(backdropProps)}
                    keyboardBehavior='extend'
                >
                    <StyledView className='flex-1 bg-offblack'>
                        {renderContent()}
                    </StyledView>
                </BottomSheetModal>

            </StyledSafeArea>
        </BottomSheetModalProvider>
    );
}
