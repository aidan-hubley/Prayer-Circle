import React, { useState } from 'react';
import {
  SafeAreaView,
  Text,
  View,
  TextInput,
  StatusBar,
  Keyboard,
  TouchableWithoutFeedback,
  Image,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { styled } from 'nativewind';
import { sendPasswordResetEmail } from 'firebase/auth';
import { Button } from '../../components/Buttons';
import { Link } from 'expo-router';
import { loginUser } from '../../backend/firebaseFunctions';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { auth } from '../../backend/config'; // Ensure you import your Firebase auth instance
import Modal from 'react-native-modal';

const StyledImage = styled(Image);
const StyledSafeArea = styled(SafeAreaView);
const StyledView = styled(View);
const StyledText = styled(Text);
const StyledInput = styled(TextInput);
const StyledKeyboardAwareScrollView = styled(KeyboardAwareScrollView);
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
      Alert.alert("Check your email", "A link to reset your password has been sent to your email address.", [
        { text: "OK", onPress: () => setIsForgotPasswordModalVisible(false) }
      ]);
      setResetEmail('');
    } catch (error) {
      Alert.alert("Error", error.message);
    }
  };

	return (
    <>
      <StyledSafeArea className='flex-1 bg-offblack'>
        <StyledKeyboardAwareScrollView>
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <StyledView>
              <StyledView className='flex items-center justify-center px-[15px] aspect-square my-6 w-full'>
                <StyledImage
                  className='w-full h-full'
                  source={require('../../assets/Logo_Dark.png')}
                  resizeMode='contain'
                />
              </StyledView>
              <StyledView className='flex flex-col items-center'>
                <StyledView className='flex flex-col items-center justify-center w-full gap-y-3 mb-3'>
                  <StyledInput
                    className='bg-offblack text-[18px] w-11/12 text-offwhite border border-offwhite rounded-lg px-3 py-[10px]'
                    placeholder={'Email'}
                    autoCapitalize='none'
                    placeholderTextColor={'#fff'}
                    keyboardType='email-address'
                    onChangeText={(text) => setEmail(text)}
                  />
                  <StyledInput
                    className='bg-offblack text-[18px] w-11/12 text-offwhite border border-offwhite rounded-lg px-3 py-[10px]'
                    placeholder={'Password'}
                    placeholderTextColor={'#fff'}
                    secureTextEntry={true}
                    onChangeText={(text) => setPass(text)}
                  />
                </StyledView>
                <Button
                  width='w-[85%]'
                  title='Login'
                  textColor='text-offwhite'
                  bgColor='bg-offblack'
                  borderColor='border-yellow'
                  press={() => {
                    Keyboard.dismiss();
                    loginUser(email, pass);
                    setEmail('');
                    setPass('');
                  }}
                />
                <StyledText className='text-offwhite text-center text-[18px] my-2'>
                  Don't have an account?{' '}
                  <Link href='/register'>
                    <StyledText className='text-yellow font-bold'>
                      Register
                    </StyledText>
                  </Link>
                </StyledText>
                <TouchableOpacity onPress={toggleModal1}>
                  <StyledText className='text-yellow text-center text-[18px] mb-4 font-bold'>
                    Forgot Password?
                  </StyledText>
                </TouchableOpacity>
              </StyledView>
            </StyledView>
          </TouchableWithoutFeedback>
        </StyledKeyboardAwareScrollView>
        <StatusBar barStyle={'light-content'} />
      </StyledSafeArea>
      <StyledModal
				className='w-[80%] self-center'
				isVisible={isModalVisible1}
        onBackdropPress={toggleModal1}
        avoidKeyboard={true}
			>
              <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
				<StyledView className='bg-offblack border-[5px] border-offwhite rounded-2xl h-[40%]'>
					<StyledView className='flex-1 items-center h-[60%]'>
						<StyledText className='absolute top-[6%] text-3xl text-offwhite'>
							Reset Password
						</StyledText>
            <StyledText className='absolute top-[20%] text-xl text-offwhite'>
              Enter your email here:
            </StyledText>
              <StyledInput
                className='absolute top-[35%]  w-[85%] text-[18px] text-offwhite border border-offwhite rounded-lg px-3 py-[10px]'
                placeholder="Email"
                value={resetEmail}
                onChangeText={setResetEmail}
                autoCapitalize="none"
                keyboardType="email-address"
              />
						<Button
							title='Submit'
							btnStyles={'absolute bottom-[10%]'}
							width='w-[70%]'
							press={handlePasswordReset}
						/>
            
					</StyledView>
				</StyledView>
        </KeyboardAvoidingView>
			</StyledModal>
    </>
	);
}

function userLogin(email, password) {
	//clear all fields
	this.emailInput.clear();
	this.passInput.clear();

	if (email.length == 0 || password.length == 0)
		return alert('Please fill out all fields');

	loginUser(email, password);
}
