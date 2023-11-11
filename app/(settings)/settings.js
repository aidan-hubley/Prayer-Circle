import {
	Text,
	View,
    TouchableOpacity,
    Animated,
	Switch,
    Alert,
} from 'react-native';
import React, { useState } from 'react';
import Modal from 'react-native-modal';
import { styled } from 'nativewind';
import { signOut } from 'firebase/auth';
import { Button } from '../../components/Buttons';
import { router, auth } from '../../backend/config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaView, TextInput } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
//import { auth } from '../../backend/config'; 
import { sendPasswordResetEmail } from 'firebase/auth';

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledModal = styled(Modal);
const StyledAnimatedView = styled(Animated.createAnimatedComponent(View));
const StyledSafeArea = styled(SafeAreaView);
const StyledInput = styled(TextInput);

export default function Page() {
   // const [isNotificationsEnabled, setNotificationsEnabled] = useState(true);
    const [isResetModalVisible, setResetModalVisible] = useState(false);
    	const ResetModal = () => {
		setResetModalVisible(!isResetModalVisible);
	};
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    
    const [isEnabled, setIsEnabled] = useState(false);
	const toggleSwitch = () => setIsEnabled((previousState) => !previousState);
	const togglePosition = React.useRef(new Animated.Value(1)).current;
    const insets = useSafeAreaInsets();


    const handlePasswordReset = async () => {
    // Check if the user is signed in
    const user = auth.currentUser;
    if (user && user.email) {
        try {
        await sendPasswordResetEmail(auth, user.email);
        Alert.alert(
            "Check your email",
            "A link to reset your password has been sent to your email address.",
            [{ text: "OK", onPress: () => setResetModalVisible(false) }]
        );
        } catch (error) {
        Alert.alert("Error", error.message);
        }
    } else {
        // No user is signed in, or there is no email on record
        Alert.alert("Error", "No user is currently signed in.");
    }
    };


    React.useEffect(() => {
        Animated.timing(togglePosition, {
            toValue: isEnabled ? 45 : 5,
            duration: 200,
            useNativeDriver: false
        }).start();
	}, [isEnabled]);

    return (
        <StyledSafeArea className='bg-offblack border' style={{ flex: 1 }}>
            <StyledView className='flex-1 items-center mt-45 pt-10'>
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
								className='pt-9 w-[80px] h-[30px] rounded-full'
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

                    <View className="flex-row items-center mt-5 px-5">
                        <View className="flex-row items-center justify-between bg-grey p-3 w-full rounded-xl">
                            <Text className="mr-3 text-lg text-offwhite">
                                Change Password
                            </Text>
                            <Button
                                title='Change'
                                btnStyles='border-2 border-yellow'
                                bgColor='offblack'
                                textStyles='text-yellow'
                                width='w-[30%]'
                                press={ResetModal}
                                // Open the modal on press
                            />
                        </View>
                    </View>
                    <View className="flex-row items-center mt-5 px-5"></View>
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
                                    {/* Reset Password Modal */}
                <StyledModal
                    className='w-[80%] self-center z-50'
                    isVisible={isResetModalVisible}
                >
                    <StyledView className='bg-offblack border-[5px] border-yellow rounded-2xl h-[60%]'>
                        <StyledView className='flex-1 items-center h-[60%]'>
                            <StyledText className='top-[4%] text-3xl text-offwhite'>
                                Change Password
                            </StyledText>

                            <StyledInput
                                className='mt-5 p-2 w-[80%] border-[1px] border-outline rounded-xl'
                                placeholder="Current Password"
                                secureTextEntry={true}
                                value={currentPassword}
                                onChangeText={setCurrentPassword}
                            />
                            <StyledInput
                                className='mt-5 p-2 w-[80%] border-[1px] border-outline rounded-xl'
                                placeholder="New Password"
                                secureTextEntry={true}
                                value={newPassword}
                                onChangeText={setNewPassword}
                            />
                            <StyledInput
                                className='mt-5 p-2 w-[80%] border-[1px] border-outline rounded-xl'
                                placeholder="Confirm New Password"
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
                                press={ResetModal}
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
                                press={ResetModal}
                            />
                        </StyledView>
                    </StyledView>
                </StyledModal>
            </StyledView>
                <StyledView style={{bottom: insets.bottom}} className='absolute w-screen px-[15px]'>
                    <Button 
                        icon='person-circle-outline'
                        href='/mainViewLayout'
                        width={'w-[60px]'}
                        height={'h-[60px]'}
                        iconSize={40}
                    >
                    </Button>
                </StyledView>
        </StyledSafeArea>
    );
}