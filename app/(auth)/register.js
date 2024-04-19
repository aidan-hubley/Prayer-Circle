import React, { useState, useRef, useCallback } from 'react';
import {
	Text,
	View,
	TextInput,
	Keyboard,
	Image,
	TouchableWithoutFeedback,
	Pressable,
	TouchableOpacity,
	StatusBar
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { SafeAreaView } from 'react-native-safe-area-context';
import { styled } from 'nativewind';
import { Button } from '../../components/Buttons';
import { passwordValidation } from '../../backend/functions';
import {
	BottomSheetModal,
	BottomSheetFlatList,
	BottomSheetModalProvider
} from '@gorhom/bottom-sheet';
import { handle, backdrop } from '../../components/BottomSheetModalHelpers.js';
import { Camera, CameraType } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';
import Modal from 'react-native-modal';
import { Terms } from '../../components/Terms';
import { useAuth } from '../context/auth';
import { notify } from '../global';

const StyledImage = styled(Image);
const StyledSafeArea = styled(SafeAreaView);
const StyledView = styled(View);
const StyledText = styled(Text);
const StyledInput = styled(TextInput);
const StyledModal = styled(Modal);
const StyledCamera = styled(Camera);

export default function Register() {
	const [handles, setHandles] = useState('');
	const [snapPoints, setSnapPoints] = useState([]);
	const [modalContent, setModalContent] = useState(null);
	const [type, setType] = useState(CameraType.front);
	const [isModalVisible, setModalVisible] = useState(false);
	const [flashMode, setFlashMode] = useState('off');
	const [profileImage, setProfileImage] = useState(null);
	const [fname, setFName] = useState('');
	const [lname, setLName] = useState('');
	const [email, setEmail] = useState('');
	const [pass, setPass] = useState('');
	const [confirmPass, setConfirmPass] = useState('');
	const [permission, requestPermission] = Camera.useCameraPermissions();
	const cameraRef = useRef(null);
	const authContext = useAuth();
	const bottomSheetModalRef = useRef(null);

	const toggleModal = () => {
		setModalVisible(!isModalVisible);
	};

	function toggleCameraType() {
		setType((current) =>
			current === CameraType.back ? CameraType.front : CameraType.back
		);
	}
	function toggleFlashMode() {
		setFlashMode((currentFlashMode) =>
			currentFlashMode === 'off' ? 'torch' : 'off'
		);
	}
	async function takePicture() {
		const { status } = await Camera.requestCameraPermissionsAsync();
		if (status !== 'granted') {
			return notify(
				'Permission Denied',
				'Could not access camera',
				'#CC2500'
			);
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
			quality: 0.2
		});

		if (result.canceled === false && result.assets.length > 0) {
			const selectedAsset = result.assets[0];
			setProfileImage(selectedAsset.uri);
			toggleModal();
		}
	};

	const handleModalPress = (
		modalContent,
		snapPoints,
		handleText,
		handleColor,
		extra = () => {}
	) => {
		extra();
		setModalContent(modalContent);
		setSnapPoints(snapPoints);
		setHandles(handle(handleText, handleColor));
		bottomSheetModalRef.current?.present();
	};

	const renderContent = () => {
		switch (modalContent) {
			case 'tos':
				return (
					<StyledView className='w-[90%] flex-1'>
						<BottomSheetFlatList
							data={[{ key: 'terms' }]}
							renderItem={({ item }) => <Terms />}
							keyExtractor={(item) => item.key}
							showsVerticalScrollIndicator={false}
						/>
					</StyledView>
				);
			default:
				return <></>;
		}
	};

	return (
		<BottomSheetModalProvider>
			<StyledSafeArea className='bg-offblack flex-1'>
				<KeyboardAwareScrollView
					bounces={false}
					keyboardShouldPersistTaps='handled'
				>
					<TouchableWithoutFeedback onPress={Keyboard.dismiss}>
						<>
							<StyledView className='flex flex-col pb-3 px-[15px] w-screen'>
								<StyledView className='w-full flex flex-col items-center mb-2'>
									<StyledView className='w-11/12 aspect-square mt-[20px] mb-[40px]'>
										<TouchableOpacity
											onPress={() => {
												toggleModal();
											}}
										>
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
									<StyledView className='flex flex-row w-11/12'>
										<StyledInput
											className='bg-offblack text-[18px] mr-1 w-auto flex-1 text-offwhite border border-outline rounded-lg px-3 py-[10px]'
											placeholder={'First Name'}
											placeholderTextColor={'#fff'}
											inputMode='text'
											maxLength={30}
											autoComplete='given-name'
											onChangeText={(text) => {
												setFName(text);
											}}
										/>
										<StyledInput
											className='bg-offblack text-[18px] ml-1 w-auto flex-1 text-offwhite border border-outline rounded-lg px-3 py-[10px]'
											placeholder={'Last Name'}
											placeholderTextColor={'#fff'}
											inputMode='text'
											maxLength={30}
											autoComplete='family-name'
											onChangeText={(text) => {
												setLName(text);
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
									<StyledInput
										className='bg-offblack text-[18px] w-11/12 text-offwhite border border-outline rounded-lg px-3 py-[10px]'
										placeholder={'Confirm Password'}
										placeholderTextColor={'#fff'}
										secureTextEntry={true}
										maxLength={25}
										onChangeText={(text) => {
											setConfirmPass(text);
										}}
									/>
								</StyledView>
							</StyledView>
							<StyledText className='text-offwhite text-center text-[18px] mb-3'>
								Read the{' '}
								<Pressable
									onPress={() => {
										handleModalPress(
											'tos',
											['90%'],
											'Terms of Service',
											''
										);
									}}
								>
									<StyledText className='text-yellow text-[16px] font-bold'>
										Terms and Conditions
									</StyledText>
								</Pressable>
							</StyledText>
							<StyledView className='flex flex-col items-center'>
								<Button
									width='w-[85%]'
									title='Agree & Register'
									textColor='#F7F1E3'
									backgroundColor='#121212'
									borderColor='#F9A826'
									press={() => {
										Keyboard.dismiss();
										createUserData(
											fname,
											lname,
											email,
											pass,
											confirmPass,
											profileImage,
											authContext
										);
									}}
								/>
								<StyledText className='text-offwhite text-center text-[18px] mt-3'>
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
								onPress={() => {
									toggleCameraType();
								}}
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
									press={() => {
										toggleCameraType();
									}}
								/>
								<Button
									icon='flashlight-outline'
									btnStyles={'right-[75px]'}
									width='w-[50px]'
									height='h-[50px]'
									press={() => {
										toggleFlashMode();
									}}
								/>
							</StyledView>
							<StyledView className='w-full flex flex-row justify-between absolute bottom-5 items-center'>
								<Button
									icon='arrow-back-outline'
									btnStyles={'left-10'}
									width='w-[50px]'
									height='h-[50px]'
									press={() => {
										toggleModal();
									}}
								/>
								<Button
									icon='camera-outline'
									iconColor='#FFFBFC'
									btnStyles={
										'border-4 border-offwhite bg-offblack'
									}
									width='w-[80px]'
									height='h-[80px]'
									press={() => {
										takePicture();
									}}
								/>
								<Button
									icon='images-outline'
									btnStyles='right-10'
									width='w-[50px]'
									height='h-[50px]'
									press={() => {
										openImagePicker();
									}}
								/>
							</StyledView>
						</StyledView>
					</StyledSafeArea>
				</StyledModal>

				<BottomSheetModal
					ref={bottomSheetModalRef}
					snapPoints={snapPoints}
					handleComponent={() => handles}
					backdropComponent={(backdropProps) =>
						backdrop(backdropProps)
					}
					keyboardBehavior='extend'
					enableOverDrag={false}
				>
					<StyledView
						className='flex-1 bg-grey py-3 items-center text-offwhite'
						bounces={false}
					>
						{renderContent()}
					</StyledView>
				</BottomSheetModal>
			</StyledSafeArea>
		</BottomSheetModalProvider>
	);
}

async function createUserData(
	fname,
	lname,
	email,
	password,
	confirmPassword,
	image,
	authContext
) {
	if (fname.length < 1 || lname.length < 1)
		return notify('Registration Error', 'Invalid Name', '#CC2500'); // check name length

	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	let emailCheck = email.split('@');
	if (emailCheck.length !== 2 || !emailRegex.test(email))
		return notify(
			'Registration Error',
			'Please enter a valid email.',
			'#CC2500'
		); // check email format

	if (!passwordValidation(password)) {
		return notify(
			'Registration Error',
			'Password must be at least 8 characters long and contain at least 1 uppercase letter, lowercase letter, number, and special character',
			'#CC2500'
		);
	}
	if (password !== confirmPassword)
		return notify(
			'Registration Error',
			'Passwords do not match',
			'#CC2500'
		);

	if (!image)
		return notify(
			'Registration Error',
			'You need to upload a profile picture',
			'#CC2500'
		);

	let userData = {
		public: {
			fname: fname,
			lname: lname
		},
		private: {
			email: email,
			timestamp: Date.now(),
			reactions: false,
			comments: false,
			posts: false,
			termsAgreed: true,
			post_preferences: {
				comments: true,
				interactions: false
			}
		}
	};
	authContext.register(email, password, userData, image);
}
