import React, { useState, useRef, useEffect } from 'react';
import {
	Text,
	View,
	TouchableOpacity,
	Animated,
	Image,
	Alert,
	TextInput,
	ScrollView
} from 'react-native';
import { BottomSheetModal, BottomSheetFlatList } from '@gorhom/bottom-sheet';
import { styled } from 'nativewind';
import { Toggle } from '../../components/Toggle';
import { Timer } from '../../components/Timer';
import { Button } from '../../components/Buttons';
import { Terms } from '../../components/Terms';
import { Post } from '../../components/Post';
import { Camera, CameraType } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import Ionicons from '@expo/vector-icons/Ionicons';
import { LinearGradient } from 'expo-linear-gradient';
import { auth } from '../../backend/config';
import { passwordValidation } from '../../backend/functions';
import {
	SafeAreaView,
	useSafeAreaInsets
} from 'react-native-safe-area-context';
import {
	sendPasswordResetEmail,
	updatePassword,
	reauthenticateWithCredential,
	EmailAuthProvider,
	updateProfile
} from 'firebase/auth';
import { backdrop, handle } from '../../components/BottomSheetModalHelpers';
import { useAuth } from '../context/auth';
import {
	getHiddenPosts,
	writeData,
	readData,
	uploadImage
} from '../../backend/firebaseFunctions';

const StyledView = styled(View);
const StyledIcon = styled(Ionicons);
const StyledText = styled(Text);
const StyledImage = styled(Image);
const StyledCamera = styled(Camera);
const StyledSafeArea = styled(SafeAreaView);
const StyledOpacity = styled(TouchableOpacity);
const StyledInput = styled(TextInput);
const StyledAnimatedView = styled(Animated.View);
const StyledGradient = styled(LinearGradient);

export default function Page() {
	const [type, setType] = useState(CameraType.front);
	const [advancedSettings, setAdvancedSettings] = useState(true);
	const [flashMode, setFlashMode] = useState('off');
	const cameraRef = useRef(null);
	const [hiddenPosts, sethiddenPosts] = useState([]);
	const [handles, setHandles] = useState('');
	const [snapPoints, setSnapPoints] = useState([]);
	const [newFName, setNewFName] = useState('');
	const [newLName, setNewLName] = useState('');
	const [currentPassword, setCurrentPassword] = useState('');
	const [newPassword, setNewPassword] = useState('');
	const [confirmPassword, setConfirmPassword] = useState('');
	const [newEmail, setNewEmail] = useState('');
	const [confirmEmail, setConfirmEmail] = useState('');
	const selectedReminder = useRef(new Animated.Value(0)).current;
	const [isEnabled, setIsEnabled] = useState(false);
	const [deletionName, setDeletionName] = useState('');
	const [modalContent, setModalContent] = useState(null);
	const [userData, setUserData] = useState(auth?.currentUser);
	const insets = useSafeAreaInsets();
	const bottomSheetModalRef = useRef(null);
	const authContext = useAuth();

	const PasswordReset = async () => {
		if (userData && userData?.email) {
			try {
				await sendPasswordResetEmail(auth, userData?.email);
				Alert.alert(
					'Check your email',
					'A link to reset your password has been sent to your email address.',
					[
						{
							text: 'OK',
							onPress: () =>
								bottomSheetModalRef.current?.dismiss()
						}
					]
				);
			} catch (error) {
				Alert.alert('Error', error.message);
			}
		} else {
			Alert.alert('Error', 'No user is currently signed in.');
		}
	};

	const hanleChangeName = async () => {
		if (newFName === '' || newLName === '') {
			Alert.alert('Error', 'Please enter a valid name.');
			return;
		}
		writeData(
			`prayer_circle/users/${userData.uid}/public/fname`,
			`${newFName}`,
			true
		);
		writeData(
			`prayer_circle/users/${userData.uid}/public/lname`,
			`${newLName}`,
			true
		);

		// change name in all posts
		let userPosts = await readData(
			`prayer_circle/users/${userData.uid}/private/posts`
		);
		if (userPosts) {
			userPosts = Object.keys(userPosts);
			userPosts.forEach((post) => {
				writeData(
					`prayer_circle/posts/${post}/name`,
					`${newFName} ${newLName}`,
					true
				);
			});
		}

		Alert.alert(
			'Success',
			'Name has been updated to: ' + newFName + ' ' + newLName
		);

		bottomSheetModalRef.current?.dismiss();
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
			alert('Permission to access the camera was denied.');
			return;
		}

		if (cameraRef.current) {
			try {
				const photo = await cameraRef.current.takePictureAsync();
				// TODO: SVG animation here
				bottomSheetModalRef.current?.dismiss();
				let imgURL = await uploadImage(
					`prayer_circle/users/${userData.uid}`,
					photo.uri
				);

				updateProfile(auth?.currentUser, { photoURL: imgURL });
				writeData(
					`prayer_circle/users/${userData.uid}/public/profile_img`,
					imgURL,
					true
				);

				Alert.alert('Success', 'Profile picture has been updated.');
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

		if (!result.canceled) {
			const selectedAsset = result.assets[0];
			// TODO: SVG animation here
			bottomSheetModalRef.current?.dismiss();
			let imgURL = await uploadImage(
				`prayer_circle/users/${userData.photoURL}`,
				selectedAsset
			);

			updateProfile(auth?.currentUser, { photoURL: imgURL });
			writeData(
				`prayer_circle/users/${userData.uid}/public/profile_img`,
				imgURL,
				true
			);

			Alert.alert('Success', 'Profile picture has been updated.');
		}
	};

	async function setUpHiddenPosts() {
		let hp = await getHiddenPosts();
		sethiddenPosts(hp);
	}

	async function unhidePost(postId) {
		/* TODO: move this into Post.js, as an event when pressing the hide icon from this modal */
		writeData(
			`prayer_circle/posts/${postId}/hidden/${userData.uid}`,
			null,
			true
		);
		writeData(
			`prayer_circle/users/${userData.uid}/private/hidden_posts/${postId}`,
			null,
			true
		);

		bottomSheetModalRef.current?.dismiss();
	}

	const ChangePassword = async () => {
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

		if (userData) {
			const credential = EmailAuthProvider.credential(
				userData.email,
				currentPassword
			);

			try {
				await reauthenticateWithCredential(user, credential);

				await updatePassword(user, newPassword);
				Alert.alert(
					'Success',
					'Password has been updated successfully.'
				);
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

	const ChangeEmail = async () => {
		if (newEmail !== confirmEmail) {
			Alert.alert('Error', 'The new emails do not match.');
			return;
		}

		let approvedEmailProviders = [
			'gmail.com',
			'yahoo.com',
			'outlook.com',
			'icloud.com',
			'aol.com'
		];

		let confirmEmailCheck = confirmEmail.split('@');
		if (confirmEmailCheck.length !== 2) return alert('Invalid Email');
		else if (!approvedEmailProviders.includes(confirmEmailCheck[1]))
			return alert('Email provider not supported');

		writeData(
			`prayer_circle/users/${userData.uid}/private/email`,
			`${confirmEmail}`,
			true
		);
		updateProfile(auth?.currentUser, { email: confirmEmail });

		Alert.alert('Success', 'Email has been updated to: ' + confirmEmail);
		bottomSheetModalRef.current?.dismiss();

		authContext.signOut();
	};

	const EmptyCache = async () => {
		// TODO: need to only remove bookmars and timers

		Alert.alert('Success', 'Cache has been emptied.');
		bottomSheetModalRef.current?.dismiss();
	};

	const DeleteAccount = async () => {
		// TODO: throughly test this
		if (deletionName !== userData.displayName) {
			Alert.alert(
				'Error',
				'The name does not match. Deletion name: ' +
					deletionName +
					' Name: ' +
					userData.displayName
			);
			return;
		}

		// find all circles that user is in
		let userCircles = await readData(
			`prayer_circle/users/${userData.uid}/private/circles`
		);
		if (userCircles) {
			userCircles = Object.keys(userCircles);
			userCircles.forEach((circle) => {
				let circleData = readData(`prayer_circle/circles/${circle}`);
				let circleMembers = readData(
					`prayer_circle/circles/${circle}/members`
				);

				if (circleMembers) {
					circleMembers = Object.keys(circleMembers);
					if (circleMembers.length === 1) {
						// identify if user is the only member of the circle
						writeData(
							`prayer_circle/circles/${circle}`,
							null,
							true
						); // delete circle
						return;
					} else if (circleData.owner === userData.uid) {
						// if user is the owner of the circle
						Alert.alert(
							'Error',
							'You are the owner of a circle. Please transfer ownership or delete / leave the circle before deleting your profile.'
						);
						return;
					} else {
						writeData(
							`prayer_circle/circles/${circle}/members/${userData.uid}`,
							null,
							true
						); // delete user from circle
					}
				}
			});
		}

		// find all comments by user
		let userComments = await readData(
			`prayer_circle/users/${userData.uid}/private/comments`
		);
		if (userComments) {
			userComments = Object.keys(userComments);
			userComments.forEach((comment) => {
				writeData(`prayer_circle/comments/${comment}`, null, true);
			});
		}

		// find all hidden posts by user
		let userHiddenPosts = await readData(
			`prayer_circle/users/${userData.uid}/private/hidden_posts`
		);
		if (userHiddenPosts) {
			userHiddenPosts = Object.keys(userHiddenPosts);
			userHiddenPosts.forEach((post) => {
				writeData(
					`prayer_circle/posts/${post}/hidden/${userData.uid}`,
					null,
					true
				);
			});
		}

		// find all posts by user
		let userPosts = await readData(
			`prayer_circle/users/${userData.uid}/private/posts`
		);
		if (userPosts) {
			userPosts = Object.keys(userPosts);
			userPosts.forEach((post) => {
				writeData(`prayer_circle/posts/${post}`, null, true);

				// find all comments on post
				let postComments = readData(
					`prayer_circle/posts/${post}/comments`
				);
				if (postComments) {
					postComments = Object.keys(postComments);
					postComments.forEach((comment) => {
						writeData(
							`prayer_circle/comments/${comment}`,
							null,
							true
						);
					});
				}
			});
		}

		// delete username
		// get all usernames
		let usernames = await readData(`usernames`);
		if (usernames) {
			usernames = Object.keys(usernames);
			usernames.forEach((username) => {
				if (username === userData.displayName) {
					writeData(`usernames/${username}`, null, true);
				}
			});
		}

		// delete user
		writeData(`prayer_circle/users/${userData.uid}`, null, true);

		bottomSheetModalRef.current?.dismiss();

		authContext.signOut();
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

	const selectedReminderInter = selectedReminder.interpolate({
		inputRange: [0, 1, 2, 3, 4, 5],
		outputRange: ['-3.5%', '15%', '35.5%', '54%', '72%', '90%']
	});

	const handleReminderPress = (index) => {
		Animated.spring(selectedReminder, {
			toValue: index,
			duration: 150,
			useNativeDriver: false
		}).start();
	};

	const highlightPosition = {
		left: selectedReminderInter
	};

	const toggleAdvancedSettings = () => {
		setAdvancedSettings(!advancedSettings);
	};

	const renderContent = () => {
		switch (modalContent) {			
			case 'updProfileInfo':
				return (
					<StyledView className='w-[85%] items-center'>
						<StyledText className='mt-3 text-[16px] font-bold text-center text-offwhite'>
							You can update your First and Last name!
						</StyledText>
						<StyledView className='flex-row justify-center pt-3'>
							<StyledText className='mt-1 text-[16px] font-bold text-center text-offwhite'>
								Update your Profile Picture!
							</StyledText>
							<StyledIcon
								name='camera'
								size={30}
								color='#FFFBFC'
								className='w-[30px] h-[30px] ml-2'
							/>
						</StyledView>
					</StyledView>
				);
			case 'changeName':
				return (
					<StyledView className='w-full gap-y-3 items-center'>
						<StyledText className='my-3 text-[16px] font-bold text-center text-offwhite'>
							Your current name: {userData.displayName}
						</StyledText>
						<StyledInput
							className='w-[85%] bg-offblack text-[18px] text-offwhite border border-outline rounded-lg px-3 py-[10px] my-2'
							placeholder='New First Name'
							placeholderTextColor={'#FFFBFC'}
							value={newFName}
							onChangeText={setNewFName}
						/>
						<StyledInput
							className='w-[85%] bg-offblack text-[18px] text-offwhite border border-outline rounded-lg px-3 py-[10px] my-2'
							placeholder='New Last Name'
							placeholderTextColor={'#FFFBFC'}
							value={newLName}
							onChangeText={setNewLName}
						/>
						<Button
							title='Confirm'
							btnStyles='mt-5'
							width='w-[70%]'
							press={hanleChangeName}
						/>
					</StyledView>
				);
			case 'previewProfilePic':
				return (
					<>
						{userData.photoURL ? (
							<Image
								style={{
									width: '75%',
									aspectRatio: 1,
									resizeMode: 'contain',
									borderRadius: 18,
									display: 'flex'
								}}
								source={{
									uri: userData.photoURL
								}}
							/>
						) : (
							<StyledText className='font-bold text-offwhite text-[26px] mt-3'>
								{userData.displayName}'s Profile Picture
							</StyledText>
						)}
						<Button
							title='Update Profile Picture'
							btnStyles='mt-5'
							width='w-[70%]'
							press={() =>
								handleModalPress(
									'updateProfilePic',
									['65%', '85%'],
									'Update Profile Picture',
									''
								)
							}
						/>
					</>
				);
			case 'updateProfilePic':
				return (
					<StyledView className='w-[85%] items-center'>
						<StyledView className='w-[300px] aspect-square rounded-[20px]'>
							<StyledCamera
								ref={cameraRef}
								mirrorImage={true}
								fixOrientation={true}
								// Still mirroring
								className='w-full h-full rounded-[20px]'
								type={type}
								ratio='1:1'
								flashMode={flashMode}
							></StyledCamera>
						</StyledView>
						<StyledView className='w-full py-[90px]'></StyledView>
						<StyledView className='w-full flex-row justify-between absolute bottom-[100px] items-center'>
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
								press={() =>
									bottomSheetModalRef.current?.dismiss()
								}
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
				);
			case 'timer': // TODO: add backend / local storage writing to timer
				return (
					<StyledView className='w-[85%] items-center'>
						<Timer></Timer>
						<StyledText className='mt-3 text-[16px] font-bold text-center text-offwhite'>
							*Keep track of your time spent on Prayer Circle
						</StyledText>
						<StyledText className='mt-3 text-[16px] text-center text-offwhite'>
							*Toggling off a timer hides the timer from you
						</StyledText>
						<StyledText className='mt-3 text-[16px] text-center text-offwhite'>
							*To reset timers you must empty cache
						</StyledText>
					</StyledView>
				);
			case 'reminder': // TODO: add more info
				return (
					<StyledView className='w-[85%] items-center'>
						<StyledText className='mt-3 text-[16px] font-bold text-center text-offwhite'>
							*Get notified when you have spent too much time on
							Prayer Cirlce
						</StyledText>
					</StyledView>
				);
			case 'hiddenPosts': // TODO: New version of post.js for hidden posts
				return (
					<StyledView className='w-[90%] flex-1'>
						<BottomSheetFlatList
							data={hiddenPosts}
							renderItem={({ item }) => (
								<>
									<Post
										user={item[1].name}
										img={item[1].profile_img}
										title={item[1].title}
										timestamp={item[1].timestamp}
										content={item[1].text}
										icon={item[1].type}
										id={item[0]}
										edited={item[1].edited}
										comments={item[1].comments}
										data={item[1]}
									/>
									<Button
										title='Unhide Post'
										width='w-[70%]'
										btnStyles='mt-2 mb-5 self-center'
										press={() => unhidePost(item[0])}
									/>
								</>
							)}
							keyExtractor={(item) => item[0]}
							showsVerticalScrollIndicator={false}
							ListEmptyComponent={() => (
								<StyledView className='w-full justify-center items-center text-center'>
									<StyledText className='font-bold text-[20px] text-offwhite text-center'>
										No Posts Hidden!
									</StyledText>
								</StyledView>
							)}
						/>
					</StyledView>
				);
			case 'passwordInfo':
				return (
					<StyledView className='w-[85%] items-center'>
						<StyledView className='flex-row justify-center'>
							<StyledIcon
								name='warning-outline'
								size={30}
								color='#F9A826'
								className='w-[30px] h-[30px] mr-2'
							/>
							<StyledText className='pt-1 text-[16px] font-bold text-center text-offwhite'>
								This cannot be reverted
							</StyledText>
							<StyledIcon
								name='warning-outline'
								size={30}
								color='#F9A826'
								className='w-[30px] h-[30px] ml-2'
							/>
						</StyledView>
						<StyledView className='flex-row justify-center py-3'>
							<StyledText className='mt-1 text-[16px] font-bold text-center text-offwhite'>
								Send a reset password to your email!
							</StyledText>
							<StyledIcon
								name='mail'
								size={30}
								color='#FFFBFC'
								className='w-[30px] h-[30px] ml-2'
							/>
						</StyledView>
						<StyledText className='mt-3 text-[20px] font-bold text-center text-offwhite'>
							Password Rules:
						</StyledText>
						<StyledText className='mt-3 text-[16px] font-bold text-center text-offwhite'>
							*Password must contain at least:{' '}
						</StyledText>
						<StyledText className='mt-3 text-[16px] font-bold text-center text-offwhite'>
							- 8 characters{' '}
						</StyledText>
						<StyledText className='mt-3 text-[16px] font-bold text-center text-offwhite'>
							- 1 uppercase letter
						</StyledText>
						<StyledText className='mt-3 text-[16px] font-bold text-center text-offwhite'>
							- 1 lowercase letter
						</StyledText>
						<StyledText className='mt-3 text-[16px] font-bold text-center text-offwhite'>
							- 1 number
						</StyledText>
						<StyledText className='mt-3 text-[16px] font-bold text-center text-offwhite'>
							- 1 special character
						</StyledText>
					</StyledView>
				);
			case 'password':
				return (
					<StyledView className='w-full gap-y-3 items-center'>
						<StyledView className='flex-row justify-center'>
							<StyledIcon
								name='warning-outline'
								size={30}
								color='#F9A826'
								className='w-[30px] h-[30px] mr-2'
							/>
							<StyledText className='pt-1 text-[16px] font-bold text-center text-offwhite'>
								This cannot be reverted
							</StyledText>
							<StyledIcon
								name='warning-outline'
								size={30}
								color='#F9A826'
								className='w-[30px] h-[30px] ml-2'
							/>
						</StyledView>
						<StyledInput
							className='bg-offblack text-[18px] w-11/12 text-offwhite border border-outline rounded-lg px-3 py-[10px]'
							placeholder='Current Password'
							placeholderTextColor={'#FFFBFC'}
							secureTextEntry={true}
							value={currentPassword}
							onChangeText={setCurrentPassword}
						/>
						<StyledInput
							className='bg-offblack text-[18px] w-11/12 text-offwhite border border-outline rounded-lg px-3 py-[10px]'
							placeholder='New Password'
							placeholderTextColor={'#FFFBFC'}
							secureTextEntry={true}
							value={newPassword}
							onChangeText={setNewPassword}
						/>
						<StyledInput
							className='bg-offblack text-[18px] w-11/12 text-offwhite border border-outline rounded-lg px-3 py-[10px]'
							placeholder='Confirm New Password'
							placeholderTextColor={'#FFFBFC'}
							secureTextEntry={true}
							value={confirmPassword}
							onChangeText={setConfirmPassword}
						/>
						<Button
							title='Confirm'
							textColor={'text-offblack'}
							bgColor={'bg-[#F9A826]'}
							btnStyles='mt-5'
							width='w-[70%]'
							press={ChangePassword}
						/>
					</StyledView>
				);
			case 'emptyCache':
				return (
					<StyledView className='w-[85%] items-center'>
						<StyledView className='flex-row justify-center'>
							<StyledIcon
								name='warning-outline'
								size={30}
								color='#F9A826'
								className='w-[30px] h-[30px] mr-2'
							/>
							<StyledText className='pt-1 text-[16px] font-bold text-center text-offwhite'>
								This cannot be reverted
							</StyledText>
							<StyledIcon
								name='warning-outline'
								size={30}
								color='#F9A826'
								className='w-[30px] h-[30px] ml-2'
							/>
						</StyledView>
						<StyledText className='mt-3 text-[16px] font-bold text-center text-offwhite'>
							*This will remove all bookmarked posts and Presence
							Timers will be reset
						</StyledText>
						<Button
							title='Empty Cache'
							textColor={'text-offblack'}
							bgColor={'bg-[#F9A826]'}
							btnStyles='mt-5'
							width='w-[70%]'
							press={EmptyCache}
						/>
					</StyledView>
				);
			case 'changeEmail':
				return (
					<StyledView className='w-full gap-y-3 items-center'>
						<StyledView className='flex-row justify-center'>
							<StyledIcon
								name='warning-outline'
								size={30}
								color='#F9A826'
								className='w-[30px] h-[30px] mr-2'
							/>
							<StyledText className='pt-1 text-[16px] font-bold text-center text-offwhite'>
								This cannot be reverted
							</StyledText>
							<StyledIcon
								name='warning-outline'
								size={30}
								color='#F9A826'
								className='w-[30px] h-[30px] ml-2'
							/>
						</StyledView>
						<StyledText className='mt-3 text-[16px] font-bold text-center text-offwhite'>
							Your current email:{' '}
						</StyledText>
						<StyledText className='mt-3 text-[20px] font-bold text-center text-offwhite'>
							{userData.email}
						</StyledText>
						<StyledInput
							className='bg-offblack text-[18px] w-11/12 text-offwhite border border-outline rounded-lg px-3 py-[10px]'
							placeholder='New Email'
							placeholderTextColor={'#FFFBFC'}
							value={newEmail}
							onChangeText={setNewEmail}
						/>
						<StyledInput
							className='bg-offblack text-[18px] w-11/12 text-offwhite border border-outline rounded-lg px-3 py-[10px]'
							placeholder='Confirm New Email'
							placeholderTextColor={'#FFFBFC'}
							value={confirmEmail}
							onChangeText={setConfirmEmail}
						/>
						<Button
							title='Confirm'
							textColor={'text-offblack'}
							bgColor={'bg-[#F9A826]'}
							btnStyles='mt-5'
							width='w-[70%]'
							press={ChangeEmail}
						/>
					</StyledView>
				);
			case 'deleteProfile':
				return (
					<StyledView className='w-full gap-y-3 items-center'>
						<StyledView className='flex-row justify-center'>
							<StyledIcon
								name='warning-outline'
								size={30}
								color='#CC2500'
								className='w-[30px] h-[30px] mr-2'
							/>
							<StyledText className='pt-1 text-[16px] font-bold text-center text-offwhite'>
								This cannot be reverted
							</StyledText>
							<StyledIcon
								name='warning-outline'
								size={30}
								color='#CC2500'
								className='w-[30px] h-[30px] ml-2'
							/>
						</StyledView>
						<StyledText className='mt-3 text-[16px] font-bold text-center text-offwhite'>
							Please type out your profile name:
						</StyledText>
						<StyledText className='mt-3 text-[20px] font-bold text-center text-offwhite'>
							{userData.displayName}
						</StyledText>
						<StyledInput
							className='bg-offblack text-[18px] w-11/12 text-offwhite border border-outline rounded-lg px-3 py-[10px]'
							placeholder='Type your name'
							placeholderTextColor={'#FFFBFC'}
							value={deletionName}
							onChangeText={setDeletionName}
						/>
						<Button
							title='Delete Profile'
							textColor={'text-offwhite'}
							bgColor={'bg-[#CC2500]'}
							btnStyles='mt-5'
							width='w-[70%]'
							press={DeleteAccount}
						/>
					</StyledView>
				);
			case 'signOut':
				return (
					<StyledView className='w-[85%] items-center'>
						<Button
							title='Sign Out'
							btnStyles='mt-3'
							width='w-[70%]'
							press={() => {
								authContext.signOut();
							}}
						/>
						<StyledText className='mt-3 text-[16px] font-bold text-center text-offwhite'>
							*You will have to sign back in next time
						</StyledText>
					</StyledView>
				);
			default:
				return null;
		}
	};

	const handleToggleDaily = (newState) => {
		console.log('Daily toggle state is now: ', newState);
	};

	const handleToggleWeekly = (newState) => {
		console.log('Weekly toggle state is now: ', newState);
	};

	const handleToggleInfinite = (newState) => {
		console.log('Infinite toggle state is now: ', newState);
	};

	useEffect(() => {
		setUserData(auth?.currentUser);
	}, [auth]);

	return (
		<StyledSafeArea className='bg-offblack border' style={{ flex: 1 }}>
			<StyledView className='flex-1 items-center mt-45 pt-10 py-5'>
				<ScrollView>
					<StyledView className='w-full flex items-center'>
						<View className='relative pt-[100px]'></View>
						<View className='flex-row mt-5 px-5'>
							<View className='justify-between bg-grey py-3 px-5 w-full rounded-xl'>
								<StyledView className='flex-row pb-5 w-full'>
									<Text className='text-lg text-offwhite'>
										Update Profile
									</Text>
									<Button
										icon='information-circle-outline'
										width={'w-[30px]'}
										height={'h-[30px]'}
										bgColor={'bg-transparent'}
										iconSize={30}
										iconColor={'#FFFBFC'}
										btnStyles='absolute right-0'
										press={() =>
											handleModalPress(
												'updProfileInfo',
												['20%'],
												'Ways to Update Your Profile',
												''
											)
										}
									></Button>
								</StyledView>
								<StyledView className='flex-row justify-between'>
									<StyledView className='w-full justify-between flex-row'>
										<Button
  											title={`Edit Name: ${userData.displayName}`}
											textColor={'text-offwhite'}
											textStyles='font-normal'
											width={'flex-1'}
											height={'h-[35px]'}
											bgColor={'bg-transparent'}
											borderColor={'border-offwhite'}
											btnStyles='border-2'
											press={() =>
												handleModalPress(
													'changeName',
													['65%'],
													'Change Name',
													''
												)
											}
										/>
										<View className='w-[10px]' />
										<Button
											icon='camera'
											iconColor={'#FFFBFC'}
											width={'w-[65px]'}
											height={'h-[35px]'}
											bgColor={'bg-transparent'}
											borderColor={'border-offwhite'}
											btnStyles='border-2'
											press={() =>
												handleModalPress(
													'previewProfilePic',
													['65%'],
													'Your Profile Picture',
													''
												)
											}
										/>
									</StyledView>
								</StyledView>
							</View>
						</View>
						<StyledView className='mt-5 px-5 w-[80%] border border-outline rounded-full' />
						<View className='flex-row items-center mt-5 px-5'>
							<View className='flex-row justify-between items-center bg-grey py-3 px-5 w-full rounded-xl'>
								<Text className='mr-3 text-lg text-offwhite'>
									All Notifications
								</Text>
								<StyledView className='flex-row'>
									<StyledIcon
										name='notifications-outline'
										size={30}
										color='#FFFBFC'
										className='w-[30px] h-[30px] mr-2'
									/>
									<Toggle />
								</StyledView>
							</View>
						</View>
						<View className='flex-row items-center mt-5 px-5'>
							<View className='flex-row justify-between items-center bg-grey py-3 px-5 w-full rounded-xl'>
								<Text className='mr-3 text-lg text-offwhite'>
									Haptics
								</Text>
								<StyledView className='flex-row'>
									<StyledIcon
										name='radio-outline'
										size={30}
										color='#FFFBFC'
										className='w-[30px] h-[30px] mr-2'
									/>
									<Toggle />
								</StyledView>
							</View>
						</View>
						<StyledView className='mt-5 px-5 w-[80%] border border-outline rounded-full' />
						<View className='flex-row mt-3 px-5'>
							<View className='justify-between bg-grey py-3 px-5 w-full rounded-xl'>
								<StyledView className='flex-row pb-5 w-full'>
									<Text className='text-lg text-offwhite pr-1'>
										Presence Timers
									</Text>
									<Button
										icon='menu'
										width={'w-[30px]'}
										height={'h-[30px]'}
										bgColor={'bg-transparent'}
										iconSize={30}
										iconColor={'#FFFBFC'}
										btnStyles='absolute right-0'
										press={() =>
											handleModalPress(
												'timer',
												['45%'],
												'Presence Timers',
												''
											)
										}
									></Button>
								</StyledView>
								<StyledView className='w-full flex-row justify-between'>
									<StyledView className='flex-row'>
										<StyledImage
											source={require('../../assets/timers/calendar-day.png')}
											className='w-[30px] h-[30px] mr-2'
										/>
										<Toggle
											onToggleStateChange={
												handleToggleDaily
											}
										/>
										{/* toggle={true} if local storage is true */}
									</StyledView>
									<StyledView className='flex-row'>
										<StyledImage
											source={require('../../assets/timers/calendar-week.png')}
											className='w-[30px] h-[30px] mr-2'
										/>
										<Toggle
											onToggleStateChange={
												handleToggleWeekly
											}
										/>
										{/* toggle={true} if local storage is true */}
									</StyledView>
									<StyledView className='flex-row'>
										<StyledIcon
											name='infinite'
											size={30}
											color='#FFFBFC'
											className='w-[30px] h-[30px] mr-2'
										/>
										<Toggle
											onToggleStateChange={
												handleToggleInfinite
											}
										/>
										{/* toggle={true} if local storage is true */}
									</StyledView>
								</StyledView>
							</View>
						</View>
						<View className='flex-row mt-3 px-5'>
							<View className='justify-between bg-grey py-3 px-5 w-full rounded-xl'>
								<StyledView className='flex-row pb-5 w-full'>
									<Text className='text-lg text-offwhite pr-1'>
										Presence Reminder
									</Text>
									<Button
										icon='information-circle-outline'
										width={'w-[30px]'}
										height={'h-[30px]'}
										bgColor={'bg-transparent'}
										iconSize={30}
										iconColor={'#FFFBFC'}
										btnStyles='absolute right-0'
										press={() =>
											handleModalPress(
												'reminder',
												['20%'],
												'Presence Reminder',
												''
											)
										}
									></Button>
								</StyledView>
								<StyledView className='w-[98%] flex-row justify-between'>
									<StyledAnimatedView
										style={highlightPosition}
										className='absolute flex items-center justify-center rounded-full border border-offwhite w-[45px] h-[30px]'
									></StyledAnimatedView>
									<StyledOpacity
										className=''
										onPress={() => handleReminderPress(0)}
									>
										<StyledText className='text-lg text-offwhite top-[1px]'>
											<StyledIcon
												name='notifications-off-outline'
												size={22}
												color='#FFFBFC'
											/>
										</StyledText>
									</StyledOpacity>
									<StyledOpacity
										className=''
										onPress={() => handleReminderPress(1)}
									>
										<StyledText className='text-lg text-offwhite'>
											15m
										</StyledText>
									</StyledOpacity>
									<StyledOpacity
										className=''
										onPress={() => handleReminderPress(2)}
									>
										<StyledText className='text-lg text-offwhite'>
											30m
										</StyledText>
									</StyledOpacity>
									<StyledOpacity
										className=''
										onPress={() => handleReminderPress(3)}
									>
										<StyledText className='text-lg text-offwhite'>
											1h
										</StyledText>
									</StyledOpacity>
									<StyledOpacity
										className=''
										onPress={() => handleReminderPress(4)}
									>
										<StyledText className='text-lg text-offwhite'>
											1.5h
										</StyledText>
									</StyledOpacity>
									<StyledOpacity
										className=''
										onPress={() => handleReminderPress(5)}
									>
										<StyledText className='text-lg text-offwhite'>
											2h
										</StyledText>
									</StyledOpacity>
								</StyledView>
							</View>
						</View>
						<StyledView className='mt-5 px-5 w-[80%] border border-outline rounded-full' />
						<View className='flex-row items-center mt-5 px-5'>
							<View className='flex-row justify-between items-center bg-grey py-3 px-5 w-full rounded-xl'>
								<StyledView className='flex-row'>
									<Text className='mr-3 text-lg text-offwhite'>
										View Hidden Posts
									</Text>
								</StyledView>
								<Button
									icon='eye'
									iconColor={'#FFFBFC'}
									iconSize={26}
									width={'w-[65px]'}
									height={'h-[35px]'}
									bgColor={'bg-transparent'}
									borderColor={'border-white'}
									btnStyles='border-2'
									press={() => {
										handleModalPress(
											'hiddenPosts',
											['65%', '85%'],
											'Hidden Posts',
											'',
											setUpHiddenPosts
										);
									}}
								></Button>
							</View>
						</View>
						<StyledView className='mt-5 px-5 w-[80%] border border-outline rounded-full' />

						<View className='flex-row items-center mt-5 px-5'>
							<View className='flex-row justify-between items-center bg-grey py-3 px-5 w-full rounded-xl'>
								<StyledView className='flex-row'>
									{/* <StyledIcon name='warning-outline' size={30} color="#F9A826" className="w-[30px] h-[30px] mr-2"/> */}
									<Text className='mr-3 text-lg text-offwhite'>
										Advanced Settings:
									</Text>
								</StyledView>
								<Button
									icon={
										advancedSettings
											? 'chevron-down-outline'
											: 'chevron-up-outline'
									}
									width={'w-[65px]'}
									height={'h-[35px]'}
									bgColor={'bg-transparent'}
									iconSize={30}
									iconColor={'#F9A826'}
									btnStyles='border-2'
									borderColor={'border-yellow'}
									press={() => toggleAdvancedSettings()}
								></Button>
							</View>
						</View>

						{advancedSettings ? (
							<></>
						) : (
							<>
								<View className='flex-row mt-5 px-5'>
									<View className='justify-between bg-grey border-2 border-yellow py-3 px-5 w-full rounded-xl'>
										<StyledView className='flex-row pb-5 w-full'>
											<StyledIcon
												name='warning-outline'
												size={30}
												color='#F9A826'
												className='w-[30px] h-[30px] mr-2'
											/>
											<Text className='text-lg text-offwhite'>
												Change Password
											</Text>
											<Button
												icon='information-circle-outline'
												width={'w-[30px]'}
												height={'h-[30px]'}
												bgColor={'bg-transparent'}
												iconSize={30}
												iconColor={'#FFFBFC'}
												btnStyles='absolute right-0'
												press={() => {
													handleModalPress(
														'passwordInfo',
														['50%'],
														'Password Info',
														'bg-[#F9A826]'
													);
												}}
											></Button>
										</StyledView>
										<StyledView className='flex-row justify-between'>
											<StyledView className='w-full justify-between flex-row'>
												<Button
													title='Change Password'
													textColor={'text-offwhite'}
													textStyles='font-normal'
													width={'flex-1'}
													height={'h-[35px]'}
													bgColor={'bg-transparent'}
													borderColor={
														'border-offwhite'
													}
													btnStyles='mr-3 border-2'
													press={() => {
														handleModalPress(
															'password',
															['65%', '85%'],
															'Change Password',
															'bg-[#F9A826]'
														);
													}}
												/>
												<View className='w-[10px]' />
												<Button
													icon='mail'
													width={'w-[65px]'}
													height={'h-[35px]'}
													bgColor={'bg-transparent'}
													borderColor={
														'border-offwhite'
													}
													iconSize={26}
													iconColor={'#FFFBFC'}
													btnStyles='border-2'
													press={PasswordReset}
												/>
											</StyledView>
										</StyledView>
									</View>
								</View>
								<View className='flex-row items-center mt-5 px-5'>
									<View className='flex-row justify-between items-center bg-grey border-2 border-yellow py-3 px-5 w-full rounded-xl'>
										<StyledView className='flex-row'>
											<StyledIcon
												name='warning-outline'
												size={30}
												color='#F9A826'
												className='w-[30px] h-[30px] mr-2'
											/>
											<Text className='mr-3 text-lg text-offwhite'>
												Empty Cache
											</Text>
										</StyledView>
										<Button
											icon='sync'
											iconColor={'#FFFBFC'}
											iconSize={26}
											width={'w-[65px]'}
											height={'h-[35px]'}
											bgColor={'bg-transparent'}
											borderColor={'border-white'}
											btnStyles='border-2'
											press={() => {
												handleModalPress(
													'emptyCache',
													['35%'],
													'Empty Cache',
													'bg-[#F9A826]'
												);
											}}
										></Button>
									</View>
								</View>
								<View className='flex-row items-center mt-5 px-5'>
									<View className='flex-row justify-between items-center bg-grey border-2 border-yellow py-3 px-5 w-full rounded-xl'>
										<StyledView className='flex-row'>
											<StyledIcon
												name='warning-outline'
												size={30}
												color='#F9A826'
												className='w-[30px] h-[30px] mr-2'
											/>
											<Text className='mr-3 text-lg text-offwhite'>
												Change Email
											</Text>
										</StyledView>
										<Button
											icon='create-outline'
											iconColor={'#FFFBFC'}
											iconSize={26}
											width={'w-[65px]'}
											height={'h-[35px]'}
											bgColor={'bg-transparent'}
											borderColor={'border-white'}
											btnStyles='border-2'
											press={() => {
												handleModalPress(
													'changeEmail',
													['65%'],
													'Change Email',
													'bg-[#F9A826]'
												);
											}}
										></Button>
									</View>
								</View>
								<StyledView className='mt-5 px-5 w-[80%] border border-outline rounded-full' />
								<View className='flex-row items-center mt-5 px-5'>
									<View className='flex-row justify-between items-center bg-grey border-2 border-red py-3 px-5 w-full rounded-xl'>
										<StyledView className='flex-row'>
											<StyledIcon
												name='skull-outline'
												size={30}
												color='#CC2500'
												className='w-[30px] h-[30px] mr-2'
											/>
											<Text className='mr-3 text-lg text-offwhite'>
												Delete Profile
											</Text>
										</StyledView>
										<Button
											icon='trash-outline'
											iconColor={'#FFFBFC'}
											iconSize={26}
											width={'w-[65px]'}
											height={'h-[35px]'}
											bgColor={'bg-transparent'}
											borderColor={'border-white'}
											btnStyles='border-2'
											press={() => {
												handleModalPress(
													'deleteProfile',
													['65%'],
													'Delete Profile',
													'bg-[#CC2500]'
												);
											}}
										></Button>
									</View>
								</View>
							</>
						)}
						<View className='relative pb-[75px]'></View>
					</StyledView>
				</ScrollView>

				<StyledGradient
					pointerEvents='none'
					start={{ x: 0, y: 0.1 }}
					end={{ x: 0, y: 1 }}
					style={{ height: 120 }}
					className='absolute w-screen'
					colors={['#121212ee', 'transparent']}
				/>
				<StyledView
					style={{
						top: Platform.OS == 'android' ? insets.top + 15 : 15
					}}
					className='absolute w-screen flex items-center justify-between px-[15px]'
				>
					<StyledText className='text-4xl font-bold text-offwhite'>
						Settings
					</StyledText>
				</StyledView>
				<StyledGradient
					pointerEvents='none'
					start={{ x: 0, y: 0.1 }}
					end={{ x: 0, y: 1 }}
					style={{ height: 100, bottom: 0 }}
					className='absolute w-screen rotate-180'
					colors={['#121212ee', 'transparent']}
				/>
			</StyledView>

			<StyledView
				style={{ bottom: insets.bottom }}
				className='absolute w-screen flex flex-row px-[15px] justify-between'
			>
				<Button
					icon='person-circle-outline'
					href='/'
					width={'w-[50px]'}
					height={'h-[50px]'}
					iconSize={30}
				></Button>
				<Button
					icon='log-out-outline'
					width={'w-[50px]'}
					height={'h-[50px]'}
					iconSize={30}
					press={() => {
						handleModalPress('signOut', ['20%']);
					}}
				></Button>
			</StyledView>

			<BottomSheetModal
				ref={bottomSheetModalRef}
				index={0}
				snapPoints={snapPoints}
				handleComponent={() => handles}
				backdropComponent={(backdropProps) => backdrop(backdropProps)}
				keyboardBehavior='extend'
			>
				<StyledView className='flex-1 bg-grey py-3 items-center text-offwhite'>
					{renderContent()}
				</StyledView>
			</BottomSheetModal>
		</StyledSafeArea>
	);
}
