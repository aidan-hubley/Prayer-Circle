import React, { useState } from 'react';
import {
	SafeAreaView,
	Text,
	View,
	TextInput,
	StatusBar,
	Keyboard,
	TouchableWithoutFeedback,
	Image
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { styled } from 'nativewind';
import { Button } from '../../components/Buttons';
import { loginUser } from '../../backend/firebaseFunctions';
import { router } from '../../backend/config';

const StyledImage = styled(Image);
const StyledSafeArea = styled(SafeAreaView);
const StyledView = styled(View);
const StyledText = styled(Text);
const StyledInput = styled(TextInput);

export default function Login() {
	const [email, setEmail] = useState('');
	const [pass, setPass] = useState('');

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
						</StyledView>
					</StyledView>
				</TouchableWithoutFeedback>
			</KeyboardAwareScrollView>
			<StatusBar barStyle={'light-content'} />
		</StyledSafeArea>
	);
}

function userLogin(email, password) {
	if (email.length == 0 || password.length == 0)
		return alert('Please fill out all fields');

	loginUser(email, password);
}
