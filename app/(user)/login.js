import React, { useState } from 'react';
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
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { styled } from 'nativewind';
import { sendPasswordResetEmail } from 'firebase/auth';
import { Button } from '../../components/Buttons';
import { router } from '../../backend/config';
import { loginUser } from '../../backend/firebaseFunctions';
import Modal from 'react-native-modal';

const StyledImage = styled(Image);
const StyledSafeArea = styled(SafeAreaView);
const StyledView = styled(View);
const StyledText = styled(Text);
const StyledInput = styled(TextInput);
const StyledModal = styled(Modal);

export default function Login() {
	const [email, setEmail] = useState('');
	const [pass, setPass] = useState('');
	const [resetEmail, setResetEmail] = useState('');

	const [isModalVisible1, setModalVisible1] = useState(false);
	const toggleModal1 = () => {
		setModalVisible1(!isModalVisible1);
	};

	const handlePasswordReset = async () => {
		try {
			await sendPasswordResetEmail(auth, resetEmail);
			Alert.alert(
				'Check your email',
				'A link to reset your password has been sent to your email address.',
				[{ text: 'OK', onPress: () => setModalVisible1(false) }]
			);
			setResetEmail('');
		} catch (error) {
			Alert.alert('Error', error.message);
		}
	};

	return (
		<StyledSafeArea className='flex-1 bg-offblack'>
			<KeyboardAwareScrollView bounces={false}>
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
									ref={(input) => {
										this.emailInput = input;
									}}
									onSubmitEditing={() => {
										this.passInput.focus();
									}}
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
									ref={(input) => {
										this.passInput = input;
									}}
									onChangeText={(text) => {
										setPass(text);
									}}
								/>
							</StyledView>
							<Button
								title='Login'
								press={() => {
									Keyboard.dismiss();
									userLogin(email, pass);
									setEmail('');
									setPass('');
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
							<TouchableOpacity onPress={toggleModal1}>
								<StyledText className='text-yellow text-center text-[18px] mb-4'>
									Forgot Password?
								</StyledText>
							</TouchableOpacity>
						</StyledView>
					</StyledView>
				</TouchableWithoutFeedback>
			</KeyboardAwareScrollView>
			<StatusBar barStyle={'light-content'} />
			<StyledModal
				className='w-[80%] self-center h-[90%]'
				isVisible={isModalVisible1}
				onBackdropPress={toggleModal1}
				avoidKeyboard={true}
			>
				<StyledView className='bg-offblack border-[5px] border-offwhite rounded-2xl h-[40%]'>
					<StyledView className='flex-1 items-center h-[60%]'>
						<StyledText className='absolute top-[6%] text-3xl text-offwhite'>
							Reset Password
						</StyledText>
						<StyledText className='absolute top-[20%] text-xl text-offwhite'>
							Enter your email here:
						</StyledText>
						<StyledView className='absolute top-[35%] w-[85%]'>
							<StyledInput
								className='text-[18px] text-offwhite border border-offwhite rounded-lg px-3 py-[10px]'
								placeholder='Email'
								value={resetEmail}
								onChangeText={setResetEmail}
								autoCapitalize='none'
								keyboardType='email-address'
							/>
						</StyledView>
						<Button
							title='Submit'
							btnStyles={'absolute bottom-[10%]'}
							width='w-[70%]'
							press={handlePasswordReset}
						/>
					</StyledView>
				</StyledView>
			</StyledModal>
		</StyledSafeArea>
	);
}

function userLogin(email, password) {
	if (email.length == 0 || password.length == 0)
		return alert('Please fill out all fields');

	loginUser(email, password);
}
