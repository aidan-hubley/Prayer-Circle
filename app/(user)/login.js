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
  Modal,
  TouchableOpacity,
  Alert
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { styled } from 'nativewind';
import { sendPasswordResetEmail } from 'firebase/auth';
import { Button } from '../../components/Buttons';
import { Link } from 'expo-router';
import { loginUser } from '../../backend/firebaseFunctions';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { auth } from '../../backend/config'; // Ensure you import your Firebase auth instance

const StyledImage = styled(Image);
const StyledSafeArea = styled(SafeAreaView);
const StyledView = styled(View);
const StyledText = styled(Text);
const StyledInput = styled(TextInput);
const StyledKeyboardAwareScrollView = styled(KeyboardAwareScrollView);

export default function Login() {
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [isForgotPasswordModalVisible, setIsForgotPasswordModalVisible] = useState(false);
  const [resetEmail, setResetEmail] = useState('');

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
                <TouchableOpacity onPress={() => setIsForgotPasswordModalVisible(true)}>
                  <StyledText className='text-yellow text-center text-[18px] mb-4'>
                    Forgot Password?
                  </StyledText>
                </TouchableOpacity>
              </StyledView>
            </StyledView>
          </TouchableWithoutFeedback>
        </StyledKeyboardAwareScrollView>
        <StatusBar barStyle={'light-content'} />
      </StyledSafeArea>

      {/* Forgot Password Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isForgotPasswordModalVisible}
        onRequestClose={() => setIsForgotPasswordModalVisible(false)}
      >
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
          <View style={{ backgroundColor: 'white', padding: 20, borderRadius: 10, width: '80%', alignItems: 'center' }}>
            <Text style={{ marginBottom: 15 }}>Enter your email here</Text>
            <TextInput
              style={{ height: 40, borderColor: 'gray', borderWidth: 1, marginBottom: 15, width: '100%', paddingHorizontal: 10 }}
              placeholder="Email"
              value={resetEmail}
              onChangeText={setResetEmail}
              autoCapitalize="none"
              keyboardType="email-address"
            />
            <Button
              title='Submit'
              
              press={handlePasswordReset}
            />
          </View>
        </View>
      </Modal>
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
