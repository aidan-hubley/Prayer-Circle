import React, { useState, useRef, useCallback } from 'react';
import { FlatList, Text, View, TouchableOpacity, Animated, Image, Alert, TextInput } from 'react-native';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { styled } from 'nativewind';
import { signOut } from 'firebase/auth';
import { Toggle } from '../../components/Toggle';
import { Timer } from '../../components/Timer';
import { Button } from '../../components/Buttons';
import { Terms } from '../../components/Terms';
import { Post } from '../../components/Post';
import Ionicons from '@expo/vector-icons/Ionicons';
import { LinearGradient } from 'expo-linear-gradient';
import { auth } from '../../backend/config';
import { passwordValidation } from '../../backend/functions';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context'; 
import { sendPasswordResetEmail } from 'firebase/auth';
import { updatePassword } from 'firebase/auth';
import { reauthenticateWithCredential, EmailAuthProvider } from 'firebase/auth';
import { handle, backdrop, SnapPoints } from '../../components/BottomSheetModalHelpers';
import { useAuth } from '../context/auth';
import { getHiddenPosts, writeData } from '../../backend/firebaseFunctions';

const StyledView = styled(View);
const StyledIcon = styled(Ionicons);
const StyledText = styled(Text);
const StyledImage = styled(Image);
const StyledSafeArea = styled(SafeAreaView);
const StyledOpacity = styled(TouchableOpacity);
const StyledInput = styled(TextInput);
const StyledAnimatedView = styled(Animated.View);
const StyledGradient = styled(LinearGradient);

export default function Page() {
	const [hiddenPosts, sethiddenPosts] = useState([]);
	const [currentPassword, setCurrentPassword] = useState('');
	const [newPassword, setNewPassword] = useState('');
	const [confirmPassword, setConfirmPassword] = useState('');
	const [selectedReminder, setSelectedReminder] = useState(
		new Animated.Value(0)
	);
	const [isEnabled, setIsEnabled] = useState(false);
	const [modalContent, setModalContent] = useState(null);
	const insets = useSafeAreaInsets();
	const bottomSheetModalRef = useRef(null);
	const authContext = useAuth();

    async function setUpHiddenPosts() {
        let hp = await getHiddenPosts();
        sethiddenPosts(hp);
    };

    async function unhidePost(postId) {
        let me = await AsyncStorage.getItem('user');

		writeData(`prayer_circle/posts/${postId}/hidden/${me}`, null, true);
		writeData(`prayer_circle/users/${me}/private/hidden_posts/${postId}`, null, true);

        bottomSheetModalRef.current?.dismiss();
	}

	const handlePasswordReset = async () => {
		const user = auth.currentUser;
		if (user && user.email) {
			try {
				await sendPasswordResetEmail(auth, user.email);
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

	const handlePresentModalPress = useCallback(() => {
		bottomSheetModalRef.current?.present();
	}, []);

	const handleTOSModalPress = () => {
        setModalContent('tos');
        handlePresentModalPress();
    };

    const handleUpdProfileInfoModalPress = () => {
        setModalContent('updProfileInfo');
        handlePresentModalPress();
    };

    const handleChangeUsernameModalPress = () => {
        setModalContent('changeUsername');
        handlePresentModalPress();
    };

    const handleUpdateProfilePicModalPress = () => {
        setModalContent('updateProfilePic');
        handlePresentModalPress();
    };

    const handleTimerModalPress = () => {
        setModalContent('timer');
        handlePresentModalPress();
    };

    const handleReminderInfoButtonPress = () => {
        setModalContent('reminder');
        handlePresentModalPress();
    };

    const handleHiddenPostsButtonPress = () => {
        setUpHiddenPosts();
        setModalContent('hiddenPosts');
        handlePresentModalPress();
    };

    const handlePasswordInfoModalPress = () => {
        setModalContent('passwordInfo');
        handlePresentModalPress();
    };

    const handleChangePasswordModalPress = () => {
        setModalContent('password');
        handlePresentModalPress();
    };

    const handleEmailButtonPress = () => {
        setModalContent('changeEmail');
        handlePresentModalPress();
    };

    const handleEmptyCacheModalPress = () => {
        setModalContent('emptyCache');
        handlePresentModalPress();
    };

    const handleDeleteProfileModalPress = () => {
        setModalContent('deleteProfile');
        handlePresentModalPress();
    };

    const handleSignOutModalPress = () => {
        setModalContent('signOut');
        handlePresentModalPress();
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




	const handle = () => {
		switch (modalContent) {
			case 'tos':
                return (
                    <StyledView className='flex items-center justify-center w-screen bg-grey rounded-t-[10px] pt-3'>
                        <StyledText className='text-white font-[600] text-[24px] pb-2'>
                            Terms of Service
                        </StyledText>
                    </StyledView>
                );          
            case 'updProfileInfo':
                return (
                    <StyledView className='flex items-center justify-center w-screen bg-grey rounded-t-[10px] pt-3'>
                        <StyledText className='text-white font-[600] text-[24px] pb-2'>
                            Ways to Update Your Profile
                        </StyledText>
                    </StyledView>
                );
            case 'changeUsername':  
                return (
                    <StyledView className='flex items-center justify-center w-screen bg-grey rounded-t-[10px] pt-3'>
                        <StyledText className='text-white font-[600] text-[24px] pb-2'>
                            Change Username
                        </StyledText>
                    </StyledView>
                );
            case 'updateProfilePic':
                return (
                    <StyledView className='flex items-center justify-center w-screen bg-grey rounded-t-[10px] pt-3'>
                        <StyledText className='text-white font-[600] text-[24px] pb-2'>
                            Update Profile Picture
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
            case 'reminder':
                return (
                    <StyledView className='flex items-center justify-center w-screen bg-grey rounded-t-[10px] pt-3'>
                        <StyledView className='w-[30px] h-[4px] rounded-full bg-[#FFFBFC] mb-3' />
                        <StyledText className='text-white font-[600] text-[24px] pb-2'>
                            Presence Reminder
                        </StyledText>
                    </StyledView>
                );
            case 'hiddenPosts':
                return (
                    <StyledView className='flex items-center justify-center w-screen bg-grey rounded-t-[10px] pt-3'>
                        <StyledText className='text-white font-[600] text-[24px] pb-2'>
                            Hidden Posts
                        </StyledText>
                    </StyledView>
                );
            case 'passwordInfo':
                return (
                    <StyledView className='flex items-center justify-center w-screen bg-grey rounded-t-[10px] pt-3'>
                        <StyledText className='text-white font-[600] text-[24px] pb-2'>
                            Password Info
                        </StyledText>
                    </StyledView>
                );
            case 'password':
                return (
                    <StyledView className='flex items-center justify-center w-screen bg-grey rounded-t-[10px] pt-3'>
                        <StyledView className='w-[30px] h-[4px] rounded-full bg-[#F9A826] mb-3' />
                        <StyledText className='text-yellow font-[600] text-[24px] pb-2'>
                            Change Password
                        </StyledText>
                    </StyledView>
                );        
            case 'changeEmail':
                return (
                    <StyledView className='flex items-center justify-center w-screen bg-grey rounded-t-[10px] pt-3'>
                        <StyledView className='w-[30px] h-[4px] rounded-full bg-[#F9A826] mb-3' />
                        <StyledText className='text-yellow font-[600] text-[24px] pb-2'>
                            Change Email
                        </StyledText>
                    </StyledView>
                );
            case 'emptyCache':
                return (
                    <StyledView className='flex items-center justify-center w-screen bg-grey rounded-t-[10px] pt-3'>
                        <StyledView className='w-[30px] h-[4px] rounded-full bg-[#F9A826] mb-3' />
                        <StyledText className='text-yellow font-[600] text-[24px] pb-2'>
                            Empty Cache
                        </StyledText>
                    </StyledView>
                );
            case 'deleteProfile':
                return (
                    <StyledView className='flex items-center justify-center w-screen bg-grey rounded-t-[10px] pt-3'>
                        <StyledView className='w-[30px] h-[4px] rounded-full bg-[#FFFBFC] mb-3' />
                        <StyledText className='text-white font-[600] text-[24px] pb-2'>
                            Delete Profile
                        </StyledText>
                    </StyledView>
                );
            case 'signOut':
                return (
                    <StyledView className='flex items-center justify-center w-screen bg-grey rounded-t-[10px]'>
                    </StyledView>
                );
            default:
                return null;
		}
	};

    const renderContent = () => {
        switch (modalContent) {
			case 'tos':
				return (
					<StyledView className='flex-1 bg-grey py-3 items-center text-offwhite' style={{ height: '100%' }}>
						<StyledView className="flex-1 w-[90%]" style={{ height: '100%' }}>
							<Terms></Terms>
						</StyledView>
					</StyledView>
				);
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
			case 'reminder':
				return (
					<StyledView className='flex-1 bg-grey py-3 items-center text-offwhite'>
						<StyledText className='mt-3 text-[16px] font-bold text-center text-offwhite'>*Notify you when you have spend too much time on Prayer Cirlce</StyledText>
					</StyledView>
				);
			case 'hiddenPosts':
				return (
					<StyledView className='flex-1 bg-grey py-3 items-center text-offwhite'>
						<StyledView className='w-[90%] flex-1'>
							<FlatList
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
					</StyledView>
				);
			case 'changeEmail':
				return (
					<StyledView className='flex-1 bg-grey py-3 items-center text-offwhite'>
						<StyledInput
							className='mt-5 p-2 w-[80%] border-[1px] border-offwhite rounded-xl text-offwhite'
							placeholder="New Email"
							placeholderTextColor={'#FFFBFC'}
						/>
						<StyledInput
							className='mt-5 p-2 w-[80%] border-[1px] border-offwhite rounded-xl text-offwhite'
							placeholder="Confirm New Email"
							placeholderTextColor={'#FFFBFC'}
						/>
						<Button
							title='Confirm'
							textColor={'text-offwhite'}
							btnStyles='mt-5'
							width='w-[70%]'
							
						/>
					</StyledView>
				);
			case 'emptyCache':
				return (
					<StyledView className='flex-1 bg-grey py-3 items-center text-offwhite'>
						<StyledText className='mt-3 text-[16px] font-bold text-center text-offwhite'>*Clear all cached data</StyledText>
					</StyledView>
				);
			case 'deleteProfile':
				return (
					<StyledView className='flex-1 bg-grey py-3 items-center text-offwhite'>
						<StyledText className='mt-3 text-[16px] font-bold text-center text-offwhite'>*This action cannot be undone</StyledText>
					</StyledView>
				);
			case 'signOut':
				return (
					<StyledView className='flex-1 bg-grey py-3 items-center text-offwhite'>
						<Button
							title='Sign Out'
							btnStyles='mt-3'
							width='w-[70%]'
							press={() => {
								signOut(auth);
								AsyncStorage.removeItem('user');
								AsyncStorage.removeItem('name');
								router.replace('/login');
							}}
						/>
						<StyledText className='mt-3 text-[16px] font-bold text-center text-offwhite'>*You will have to sign back in next time</StyledText>
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

	return (
		<StyledSafeArea className='bg-offblack border' style={{ flex: 1 }}>
			<StyledView className='flex-1 items-center mt-45 pt-10 py-5'>
				<FlatList
					ListHeaderComponent={
						<>
							<StyledView className='w-full flex items-center'>
								<View className="relative pt-[100px]"></View> 

								<View className="flex-row items-center mt-5 px-5">
									<View className="flex-row justify-between items-center bg-grey py-3 px-5 w-full rounded-xl">
										<Text className="mr-3 text-lg text-offwhite">
											Terms of Service
										</Text>
										<Button // TODO: use component
											icon='document'
											iconColor={'#FFFBFC'}
											iconSize={26}                                        
											width={'w-[65px]'}
											height={'h-[35px]'}
											bgColor={'bg-transparent'}
											textColor={'text-offwhite'}
											borderColor={'border-offwhite'}
											btnStyles='border-2'
											press={handleTOSModalPress}
										></Button>
									</View>
								</View>
								<StyledView className='mt-5 px-5 w-[80%] border border-outline rounded-full' />
								<View className="flex-row mt-5 px-5">
									<View className="justify-between bg-grey py-3 px-5 w-full rounded-xl">
										<StyledView className="flex-row pb-5 w-full">
											<Text className="text-lg text-offwhite">
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
												press={handleUpdProfileInfoModalPress}
											></Button>
										</StyledView>
										<StyledView className="flex-row justify-between">
											<StyledView className="w-50 flex-row">
												<Button // TODO: add modal + backend                                                    
													title='Change Username'
													textColor={'text-offwhite'}
													textStyles='font-normal'
													width={'w-[250px]'}
													height={'h-[35px]'}
													bgColor={'bg-transparent'}
													borderColor={'border-offwhite'}
													btnStyles='border-2'
													press={handleChangeUsernameModalPress}
												></Button>
											</StyledView>
											<StyledView className="w-50 flex-row">
												<Button // TODO: add modal + backend
													icon='camera'
													iconColor={'#FFFBFC'}
													width={'w-[65px]'}
													height={'h-[35px]'}
													bgColor={'bg-transparent'}
													borderColor={'border-offwhite'}
													btnStyles='border-2'
													press={handleUpdateProfilePicModalPress}
												></Button>
											</StyledView>
										</StyledView>
									</View>
								</View>
								<StyledView className='mt-5 px-5 w-[80%] border border-outline rounded-full' />
								<View className="flex-row items-center mt-5 px-5">
									<View className="flex-row justify-between items-center bg-grey py-3 px-5 w-full rounded-xl">
										<Text className="mr-3 text-lg text-offwhite">
											All Notifications
										</Text>
										 <StyledView className='flex-row'>
											<StyledIcon name="notifications-outline" size={30} color="#FFFBFC" className="w-[30px] h-[30px] mr-2"/>                                         
											<Toggle />                       
										</StyledView>
									</View>
								</View>
								<View className="flex-row items-center mt-5 px-5">
									<View className="flex-row justify-between items-center bg-grey py-3 px-5 w-full rounded-xl">
										<Text className="mr-3 text-lg text-offwhite">
											Haptics
										</Text>   
										<StyledView className='flex-row'>
											<StyledIcon name="radio-outline" size={30} color="#FFFBFC" className="w-[30px] h-[30px] mr-2"/>                                         
											<Toggle />                       
										</StyledView>
									</View>
								</View>
								<StyledView className='mt-5 px-5 w-[80%] border border-outline rounded-full' />
								<View className="flex-row mt-5 px-5">
									<View className="justify-between bg-grey py-3 px-5 w-full rounded-xl">
										<StyledView className="flex-row pb-5 w-full">
											<Text className="text-lg text-offwhite pr-1">
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
												press={handleTimerModalPress}
											></Button>
										</StyledView>
										<StyledView className="w-full flex-row justify-between">
											<StyledView className="flex-row">
												<StyledImage source={require('../../assets/timers/calendar-day.png')} className="w-[30px] h-[30px] mr-2"/>
												<Toggle onToggleStateChange={handleToggleDaily} /> 
												{/* toggle={true} if local storage is true */}
											</StyledView>
											<StyledView className="flex-row">
												<StyledImage source={require('../../assets/timers/calendar-week.png')} className="w-[30px] h-[30px] mr-2"/>
												<Toggle onToggleStateChange={handleToggleWeekly} />
												{/* toggle={true} if local storage is true */}
											</StyledView>
											<StyledView className="flex-row">
												<StyledIcon name="infinite" size={30} color="#FFFBFC" className="w-[30px] h-[30px] mr-2"/>
												<Toggle onToggleStateChange={handleToggleInfinite} />
												{/* toggle={true} if local storage is true */}
											</StyledView>
										</StyledView>
									</View>
								</View>      
								<View className="flex-row mt-5 px-5">
									<View className="justify-between bg-grey py-3 px-5 w-full rounded-xl">
										<StyledView className="flex-row pb-5 w-full">
											<Text className="text-lg text-offwhite pr-1">
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
												press={handleReminderInfoButtonPress}
											></Button>
										</StyledView>                                
										<StyledView className="w-[98%] flex-row justify-between">
											<StyledAnimatedView
												style={highlightPosition}
												className='absolute flex items-center justify-center rounded-full border border-offwhite w-[45px] h-[30px]'
											></StyledAnimatedView>
											<StyledOpacity className='' onPress={() => handleReminderPress(0)}>
												<StyledText className="text-lg text-offwhite top-[1px]">
													<StyledIcon name="notifications-off-outline" size={22} color="#FFFBFC"/>
												</StyledText>
											</StyledOpacity>                            
											<StyledOpacity className='' onPress={() => handleReminderPress(1)}>
												<StyledText className="text-lg text-offwhite">15m</StyledText>
											</StyledOpacity>
											<StyledOpacity className='' onPress={() => handleReminderPress(2)}>
												<StyledText className="text-lg text-offwhite">30m</StyledText>
											</StyledOpacity>                                    
											<StyledOpacity className='' onPress={() => handleReminderPress(3)}>
												<StyledText className="text-lg text-offwhite">1h</StyledText>
											</StyledOpacity>                                    
											<StyledOpacity className='' onPress={() => handleReminderPress(4)}>
												<StyledText className="text-lg text-offwhite">1.5h</StyledText>
											</StyledOpacity>                                    
											<StyledOpacity className='' onPress={() => handleReminderPress(5)}>
												<StyledText className="text-lg text-offwhite">2h</StyledText>
											</StyledOpacity>                                    
										</StyledView>
									</View>
								</View>
								<StyledView className='mt-5 px-5 w-[80%] border border-outline rounded-full' />                                    
								<View className="flex-row items-center mt-5 px-5">
									<View className="flex-row justify-between items-center bg-grey py-3 px-5 w-full rounded-xl">
										<StyledView className='flex-row'>
											<Text className="mr-3 text-lg text-offwhite">
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
										press={handleHiddenPostsButtonPress}
									></Button>
									</View>
								</View>
								<StyledView className='mt-5 px-5 w-[80%] border border-outline rounded-full' />  
								<View className="flex-row mt-5 px-5">
									<View className="justify-between bg-grey border-2 border-yellow py-3 px-5 w-full rounded-xl">
										<StyledView className="flex-row pb-5 w-full">
											<StyledIcon name='warning-outline' size={30} color="#F9A826" className="w-[30px] h-[30px] mr-2"/>
											<Text className="text-lg text-offwhite">
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
												press={handlePasswordInfoModalPress}
											></Button>
										</StyledView>                                            
										<StyledView className='flex-row justify-between'>
											<StyledView className="w-50">
												<Button
													title='Change Password'
													textColor={'text-offwhite'}
													textStyles='font-normal'
													width={'w-[250px]'}
													height={'h-[35px]'}
													bgColor={'bg-transparent'}
													borderColor={'border-offwhite'}
													btnStyles='mr-3 border-2'
													press={handleChangePasswordModalPress}
												></Button>
											</StyledView>
											<StyledView className="w-50">
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
										</StyledView>
									</View>
								</View>                                  
								<View className="flex-row items-center mt-5 px-5">
									<View className="flex-row justify-between items-center bg-grey border-2 border-yellow py-3 px-5 w-full rounded-xl">
										<StyledView className='flex-row'>
											<StyledIcon name='warning-outline' size={30} color="#F9A826" className="w-[30px] h-[30px] mr-2"/>
											<Text className="mr-3 text-lg text-offwhite">
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
										press={handleEmailButtonPress}
									></Button>
									</View>
								</View>
								<View className="flex-row items-center mt-5 px-5">
									<View className="flex-row justify-between items-center bg-grey border-2 border-yellow py-3 px-5 w-full rounded-xl">
										<StyledView className='flex-row'>
											<StyledIcon name='warning-outline' size={30} color="#F9A826" className="w-[30px] h-[30px] mr-2"/>
											<Text className="mr-3 text-lg text-offwhite">
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
										press={handleEmptyCacheModalPress}
									></Button>
									</View>
								</View>
								
								<StyledView className='mt-5 px-5 w-[80%] border border-outline rounded-full' />
								<View className="flex-row items-center mt-5 px-5">
									<View className="flex-row justify-between items-center bg-grey border-2 border-red py-3 px-5 w-full rounded-xl">
										<StyledView className='flex-row'>
											<StyledIcon name='skull-outline' size={30} color="#CC2500" className="w-[30px] h-[30px] mr-2"/>
											<Text className="mr-3 text-lg text-offwhite">
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
										press={handleDeleteProfileModalPress}
									></Button>
									</View>
								</View>

								<View className="relative pb-[75px]"></View>
							</StyledView>
						</>
					}
				/>

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
					press={handleSignOutModalPress} 
				></Button>
			</StyledView>

			<BottomSheetModal
				enableDismissOnClose={true}
				ref={bottomSheetModalRef}
				index={0}
				snapPoints={
					modalContent === 'tos' ? ['85%'] :
					modalContent === 'updProfileInfo' ? ['65%'] :
					modalContent === 'changeUsername' ? ['65%'] :
					modalContent === 'updateProfilePic' ? ['65%'] :
					modalContent === 'timer' ? ['35%'] :
					modalContent === 'reminder' ? ['35%'] :
					modalContent === 'hiddenPosts' ? ['65%'] :
					modalContent === 'passwordInfo' ? ['65%'] :
					modalContent === 'password' ? [('65%', '85%')] :
					modalContent === 'changeEmail' ? ['65%'] :
					modalContent === 'emptyCache' ? ['65%'] :
					modalContent === 'deleteProfile' ? ['65%'] :
					modalContent === 'signOut' ? ['15%'] :
					['65%', '85%']
				}
				handleComponent={handle}
				backdropComponent={(backdropProps) => backdrop(backdropProps)}
				keyboardBehavior='extend'
			>
				<StyledView className='flex-1 bg-offblack'>
					{renderContent()}
				</StyledView>
			</BottomSheetModal>
		</StyledSafeArea>
	);
}
