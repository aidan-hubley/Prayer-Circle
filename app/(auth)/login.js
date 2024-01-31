import React, { useState, useRef, useCallback, useMemo } from 'react';
import {
	Text,
	View,
	TextInput,
	StatusBar,
	Keyboard,
	TouchableWithoutFeedback,
	Image,
	TouchableOpacity,
	Alert
} from 'react-native';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { styled } from 'nativewind';
import { getAuth, sendPasswordResetEmail } from 'firebase/auth';
import { Button } from '../../components/Buttons';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useAuth } from '../context/auth';
import { handle, backdrop } from '../../components/BottomSheetModalHelpers';
import { router } from 'expo-router';

const StyledImage = styled(Image);
const StyledOpacity = styled(TouchableOpacity);
const StyledSafeArea = styled(SafeAreaView);
const StyledView = styled(View);
const StyledText = styled(Text);
const StyledInput = styled(TextInput);
const StyledIcon = styled(Ionicons);

export default function Login() {
	const [email, setEmail] = useState('');
	const [pass, setPass] = useState('');
	const [resetEmail, setResetEmail] = useState('');
	const bottomSheetModalRef = useRef(null);
	const authContext = useAuth();
	const auth = getAuth();
	const snapPoints = useMemo(() => ['40%'], []);

	const handlePasswordReset = async () => {
		try {
			await sendPasswordResetEmail(auth, resetEmail);
			Alert.alert(
				'Check your email',
				'A link to reset your password has been sent to your email address.',
				[{ text: 'OK' }]
			);
			setResetEmail('');
		} catch (error) {
			Alert.alert('Error', error.message);
		}
	};

	return (
		<StyledSafeArea className='flex-1 bg-offblack'>
			<KeyboardAwareScrollView
				bounces={false}
				keyboardShouldPersistTaps='handled'
			>
				<TouchableWithoutFeedback onPress={Keyboard.dismiss}>
					<StyledView className='w-screen px-[15px] flex items-center justify-center'>
						<StyledView className='flex items-center justify-center aspect-square my-6 w-11/12'>
							<StyledImage
								className='w-full h-full '
								source={require('../../assets/Squared_Logo_Dark.png')}
								resizeMode='contain'
							/>
						</StyledView>
						<StyledView className='w-full flex flex-col items-center'>
							<StyledView className='flex flex-col items-center justify-center w-full gap-y-3 mb-3'>
								<StyledInput
									className='bg-offblack text-[18px] w-11/12 text-offwhite border border-outline rounded-lg px-3 py-[10px]'
									placeholder={'Email'}
									autoCapitalize='none'
									placeholderTextColor={'#fff'}
									inputMode='email'
									autoComplete='email'
									maxLength={30}
									blurOnSubmit={false}
									onChangeText={(text) => {
										setEmail(text);
									}}
								/>
								<StyledInput
									className='bg-offblack text-[18px] w-11/12 text-offwhite border border-outline rounded-lg px-3 py-[10px]'
									placeholder={'Password'}
									placeholderTextColor={'#fff'}
									secureTextEntry={true}
									maxLength={25}
									onChangeText={(text) => {
										setPass(text);
									}}
								/>
							</StyledView>
							<Button
								title='Login'
								press={() => {
									Keyboard.dismiss();
									if (email.length == 0 || pass.length == 0)
										return alert(
											'Please fill out all fields'
										);
									authContext.signIn(email, pass);
								}}
							/>
							<StyledText className='text-offwhite text-center text-[18px] my-2'>
								Don't have an account?{' '}
								<TouchableWithoutFeedback
									onPress={() => {
										router.replace('/register');
									}}
								>
									<StyledText className='text-yellow font-bold'>
										Register
									</StyledText>
								</TouchableWithoutFeedback>
							</StyledText>
							<TouchableOpacity
								onPress={() =>
									bottomSheetModalRef.current?.present()
								}
								className='flex flex-row'
							>
								<StyledIcon
									name='mail'
									size={20}
									color='#F9A826'
									className='pr-1 pt-[2px]'
								/>
								<StyledText className='text-yellow text-center text-[18px] mb-4'>
									Forgot Password?
								</StyledText>
							</TouchableOpacity>
						</StyledView>
					</StyledView>
				</TouchableWithoutFeedback>
			</KeyboardAwareScrollView>
			<StatusBar barStyle={'light-content'} />
			<BottomSheetModal
				enableDismissOnClose={true}
				ref={bottomSheetModalRef}
				index={0}
				snapPoints={snapPoints}
				handleComponent={() => handle('Reset Password')}
				backdropComponent={(backdropProps) => backdrop(backdropProps)}
				keyboardBehavior='extend'
			>
				<StyledView className='flex-1 bg-grey p-4 items-center'>
					<StyledView className='w-full h-auto flex items-center my-3'>
						<StyledInput
							className='w-[90%] min-h-[40px] bg-[#ffffff11] rounded-[10px] pl-3 pr-[50px] py-3 text-white text-[16px]'
							placeholder='What is your email?'
							placeholderTextColor='#ffffff66'
							multiline={false}
							onChangeText={setResetEmail}
							autoCapitalize='none'
							keyboardType='email-address'
						/>
						<StyledOpacity
							className='absolute top-[10px] right-[8%]'
							onPress={handlePasswordReset}
						>
							<StyledIcon
								name='send'
								size={30}
								className='text-green'
							/>
						</StyledOpacity>
					</StyledView>
				</StyledView>
			</BottomSheetModal>
		</StyledSafeArea>
	);
}
