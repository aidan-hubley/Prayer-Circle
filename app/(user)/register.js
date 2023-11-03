import React, { useState, useRef } from 'react';
import {
	SafeAreaView,
	Text,
	View,
	TextInput,
	Keyboard,
	Image,
	TouchableWithoutFeedback,
	TouchableOpacity,
	StatusBar
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { styled } from 'nativewind';
import { Button } from '../../components/Buttons';
import { checkUsername, registerUser } from '../../backend/firebaseFunctions';
import { passwordValidation } from '../../backend/functions';
import Modal from 'react-native-modal';
import { Camera, CameraType } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import { router } from '../../backend/config';

const StyledImage = styled(Image);
const StyledSafeArea = styled(SafeAreaView);
const StyledView = styled(View);
const StyledText = styled(Text);
const StyledInput = styled(TextInput);
const StyledCamera = styled(Camera);
const StyledModal = styled(Modal);

export default function Register() {
	const [type, setType] = useState(CameraType.front);
	const [permission, requestPermission] = Camera.useCameraPermissions();

	const [isModalVisible, setModalVisible] = useState(false);
	const toggleModal = () => {
		setModalVisible(!isModalVisible);
	};

	const cameraRef = useRef(null);

	function toggleCameraType() {
		setType((current) =>
			current === CameraType.back ? CameraType.front : CameraType.back
		);
	}

	const [flashMode, setFlashMode] = useState('off');

	function toggleFlashMode() {
		setFlashMode((currentFlashMode) =>
			currentFlashMode === 'off' ? 'torch' : 'off'
		);
	}

	const [profileImage, setProfileImage] = useState(null);

	async function takePicture() {
		const { status } = await Camera.requestCameraPermissionsAsync();
		if (status !== 'granted') {
			alert('Permission to access the camera was denied.');
			return;
		}

		if (cameraRef.current) {
			try {
				const photo = await cameraRef.current.takePictureAsync();
				setProfileImage(photo.uri);
				toggleModal();
			} catch (error) {
				console.error('Error taking picture:', error);
			}
		}
	}

	const openImagePicker = async () => {
		let result = await ImagePicker.launchImageLibraryAsync({
			mediaTypes: ImagePicker.MediaTypeOptions.Images,
			allowsEditing: true,
			aspect: [1, 1],
			quality: 1
		});

		if (result.canceled === false && result.assets.length > 0) {
			const selectedAsset = result.assets[0];
			setProfileImage(selectedAsset.uri);
			toggleModal();
		}
	};

	const [fname, setFName] = useState('');
	const [lname, setLName] = useState('');
	const [username, setUsername] = useState('');
	const [email, setEmail] = useState('');
	const [pass, setPass] = useState('');

	return (
		<StyledSafeArea className='bg-offblack flex-1'>
			<KeyboardAwareScrollView bounces={false}>
				<TouchableWithoutFeedback onPress={Keyboard.dismiss}>
					<>
						<StyledView className='flex flex-col pb-5 px-[15px] w-screen'>
							<StyledView className='w-full flex flex-col items-center mb-2'>
								<StyledView className='w-11/12 aspect-square mt-[20px] mb-[40px]'>
									<TouchableOpacity onPress={toggleModal}>
										<StyledImage
											className='h-full aspect-square rounded-3xl'
											source={
												profileImage
													? { uri: profileImage }
													: require('../../assets/Squared_Logo_Dark.png')
											}
											resizeMode='contain'
										/>
									</TouchableOpacity>
									<StyledText className='text-offwhite text-center text-[18px] mt-2'>
										{profileImage
											? 'Tap Photo to Retake Picture'
											: 'Tap Logo to Upload a Profile Picture'}
									</StyledText>
								</StyledView>
							</StyledView>
							<StyledView className='flex flex-col items-center justify-center w-full gap-y-2'>
								<StyledInput
									className=' bg-offblack text-[18px] w-11/12 text-offwhite border border-outline rounded-lg px-3 py-[10px]'
									placeholder={'Username'}
									placeholderTextColor={'#fff'}
									inputMode='text'
									maxLength={30}
									autoCorrect={false}
									ref={(input) => {
										this.usernameInput = input;
									}}
									onSubmitEditing={() => {
										this.fNameInput.focus();
									}}
									blurOnSubmit={false}
									onEndEditing={(text) => {
										setUsername(text.nativeEvent.text);
									}}
								/>
								<StyledView className='flex flex-row w-11/12'>
									<StyledInput
										className='bg-offblack text-[18px] mr-1 w-auto flex-1 text-offwhite border border-outline rounded-lg px-3 py-[10px]'
										placeholder={'First Name'}
										placeholderTextColor={'#fff'}
										inputMode='text'
										maxLength={30}
										ref={(input) => {
											this.fNameInput = input;
										}}
										onSubmitEditing={() => {
											this.lNameInput.focus();
										}}
										autoComplete='given-name'
										blurOnSubmit={false}
										onEndEditing={(text) => {
											setFName(text.nativeEvent.text);
										}}
									/>
									<StyledInput
										className='bg-offblack text-[18px] ml-1 w-auto flex-1 text-offwhite border border-outline rounded-lg px-3 py-[10px]'
										placeholder={'Last Name'}
										placeholderTextColor={'#fff'}
										inputMode='text'
										maxLength={30}
										ref={(input) => {
											this.lNameInput = input;
										}}
										onSubmitEditing={() => {
											this.emailInput.focus();
										}}
										autoComplete='family-name'
										blurOnSubmit={false}
										onEndEditing={(text) => {
											setLName(text.nativeEvent.text);
										}}
									/>
								</StyledView>
								<StyledInput
									className='bg-offblack text-[18px] w-11/12 text-offwhite border border-outline rounded-lg px-3 py-[10px]'
									placeholder={'Email'}
									placeholderTextColor={'#fff'}
									autoCapitalize='none'
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
									onEndEditing={(text) => {
										setEmail(text.nativeEvent.text);
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
									onEndEditing={(text) => {
										setPass(text.nativeEvent.text);
									}}
								/>
							</StyledView>
						</StyledView>
						<StyledView className='flex flex-col items-center'>
							<Button
								width='w-[85%]'
								title='Register'
								textColor='#F7F1E3'
								backgroundColor='#121212'
								borderColor='#F9A826'
								press={() => {
									Keyboard.dismiss();
									createUserData(
										username,
										fname,
										lname,
										email,
										pass
									);
								}}
							/>
							<StyledText className='text-offwhite text-center text-[18px] mt-5'>
								Already have an account?{' '}
								<TouchableWithoutFeedback
									onPress={() => {
										router.replace('/login');
									}}
								>
									<StyledText className='text-yellow font-bold'>
										Login
									</StyledText>
								</TouchableWithoutFeedback>
							</StyledText>
						</StyledView>
					</>
				</TouchableWithoutFeedback>
			</KeyboardAwareScrollView>
			<StatusBar barStyle={'light-content'} />
			<StyledModal
				className='w-[90%] self-center'
				isVisible={isModalVisible}
			>
				<StyledSafeArea className='bg-offblack border border-offwhite rounded-[20px] h-[90%]'>
					<StyledView className='flex-1 items-center h-[60%]'>
						<StyledText className='top-[3%] text-3xl text-offwhite'>
							Take a Selfie!
						</StyledText>
						<StyledView
							className='top-[8%] w-[300px] aspect-square rounded-[20px]'
							onPress={toggleCameraType}
						>
							<StyledCamera
								ref={cameraRef}
								mirrorImage={true}
								fixOrientation={true}
								// Still mirroring
								className='w-full h-full rounded-[20px]'
								type={type}
								ratio='1:1'
								flashMode={flashMode}
							>
								{/* Having squared profile pictures means we should do a 1:1 ratio here
										I don't know how to do that without using w-#px h-#px  */}
							</StyledCamera>
						</StyledView>
						<StyledView className='w-full flex flex-row justify-between absolute bottom-[135px] items-center'>
							<Button
								icon='camera-reverse-outline'
								btnStyles={'left-[75px]'}
								width='w-[50px]'
								height='h-[50px]'
								press={toggleCameraType}
							/>
							<Button
								icon='flashlight-outline'
								btnStyles={'right-[75px]'}
								width='w-[50px]'
								height='h-[50px]'
								press={toggleFlashMode}
							/>
						</StyledView>
						<StyledView className='w-full flex flex-row justify-between absolute bottom-5 items-center'>
							<Button
								icon='arrow-back-outline'
								btnStyles={'left-10'}
								width='w-[50px]'
								height='h-[50px]'
								press={toggleModal}
							/>
							<Button
								icon='camera-outline'
								iconColor='#FFFBFC'
								btnStyles={
									'border-4 border-offwhite bg-offblack'
								}
								width='w-[80px]'
								height='h-[80px]'
								press={takePicture}
							/>
							<Button
								icon='images-outline'
								btnStyles='right-10'
								width='w-[50px]'
								height='h-[50px]'
								press={openImagePicker}
							/>
						</StyledView>
					</StyledView>
				</StyledSafeArea>
			</StyledModal>
		</StyledSafeArea>
	);
}

async function createUserData(username, fname, lname, email, password) {
	if (username.length < 1) return alert('Invalid Username'); // check username length

	let taken = await checkUsername(username); // check if username is taken
	if (taken) return alert('Username already taken');

	if (fname.length < 1 || lname.length < 1) return alert('Invalid Name'); // check name length

	let approvedEmailProviders = [
		'gmail.com',
		'yahoo.com',
		'outlook.com',
		'icloud.com',
		'aol.com'
	];
	let emailCheck = email.split('@');
	if (emailCheck.length !== 2)
		return alert('Invalid Email'); // check email format
	else if (!approvedEmailProviders.includes(emailCheck[1]))
		return alert('Email provider not supported'); // check email provider

	if (!passwordValidation(password)) {
		return alert(
			'Invalid Password\nPassword must be at least 12 characters long and contain at least 1 uppercase letter, lowercase letter, number, and special character'
		);
	}
	//clear all fields
	this.usernameInput.clear();
	this.fNameInput.clear();
	this.lNameInput.clear();
	this.emailInput.clear();
	this.passInput.clear();

	let userData = {
		public: {
			fname: fname,
			lname: lname,
			profile_img: false
		},
		private: {
			email: email,
			created: new Date().getTime(),
			circles: false,
			reactions: false,
			comments: false,
			posts: false
		}
	};
	registerUser(email, password, userData);
}
