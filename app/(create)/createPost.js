import React, { useEffect, useRef, useState } from 'react';
import {
	Text,
	View,
	TextInput,
	TouchableOpacity,
	Pressable,
	Animated,
	Platform,
	Keyboard
} from 'react-native';
import { styled } from 'nativewind';
import { PostTypeSelector } from '../../components/PostTypeSelector';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Button } from '../../components/Buttons';
import {
	writeData,
	generateId,
	readData
} from '../../backend/firebaseFunctions';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useStore, notify } from '../global';
import { Filter } from '../../components/Filter';
import { Ionicons } from '@expo/vector-icons';
import { auth } from '../../backend/config';
import { encrypt } from 'react-native-simple-encryption';
import DateTimePicker from '@react-native-community/datetimepicker';
import { formatTimestamp } from '../../backend/functions';
import { Loading } from '../../components/Loading';

const StyledSafeArea = styled(SafeAreaView);
const StyledView = styled(View);
const StyledText = styled(Text);
const StyledInput = styled(TextInput);
const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export default function Page() {
	const [title, setTitle] = useState('');
	const [body, setBody] = useState('');
	const [titlepplaceholder, setTitlePlaceholder] = useState('Title');
	const [bodypplaceholder, setBodyPlaceholder] = useState('Write a Post');
	const [userData, setUserData] = useState(auth.currentUser);
	const typeRef = useRef();
	const [showDatePicker, setShowDatePicker] = useState(false);
	const [circles, setGlobalReload, addCircles, setAddCircles] = useStore(
		(state) => [
			state.circles,
			state.setGlobalReload,
			state.addCircles,
			state.setAddCircles
		]
	);
	const [startDate, setStartDate] = useState(new Date());
	const [endDate, setEndDate] = useState(new Date());
	const [startDateShow, setStartDateShow] = useState(false);
	const [endDateShow, setEndDateShow] = useState(false);
	const [startTimeShow, setStartTimeShow] = useState(false);
	const [endTimeShow, setEndTimeShow] = useState(false);
	const [isKeyboardVisible, setKeyboardVisible] = useState(false);
	const [uploading, setUploading] = useState(false);
	const filterRef = useRef();

	const handleSelect = (index) => {
		if (index == 0) {
			setShowDatePicker(false);
			setTitlePlaceholder('Annoucement Title');
			setBodyPlaceholder('Annoucement Description');
		}
		if (index == 1) {
			setShowDatePicker(false);
			setTitlePlaceholder('Praise Title');
			setBodyPlaceholder('Praise Description');
		}
		if (index == 2) {
			setShowDatePicker(false);
			setTitlePlaceholder('Request Title');
			setBodyPlaceholder('Request Description');
		}
		if (index == 3) {
			setShowDatePicker(true);
			setTitlePlaceholder('Event Title');
			setBodyPlaceholder('Event Description');
		}
		if (index == 4) {
			setShowDatePicker(false);
			setTitlePlaceholder('Thought Title');
			setBodyPlaceholder('Thought Description');
		}
	};

	useEffect(() => {
		setUserData(auth.currentUser);
	}, [auth.currentUser]);

	useEffect(() => {
		setAddCircles([]);
	}, []);

	useEffect(() => {
		const keyboardDidShowListener = Keyboard.addListener(
			'keyboardDidShow',
			() => {
				setKeyboardVisible(true); // or some other action
			}
		);
		const keyboardDidHideListener = Keyboard.addListener(
			'keyboardDidHide',
			() => {
				setKeyboardVisible(false); // or some other action
			}
		);

		return () => {
			keyboardDidHideListener.remove();
			keyboardDidShowListener.remove();
		};
	}, []);

	return (
		<>
			<StyledSafeArea className='bg-offblack flex-1'>
				<KeyboardAwareScrollView bounces={false}>
					<>
						<StyledView className='flex items-center flex-row justify-between text-center w-screen pt-[20px] px-[15px]'>
							<TouchableOpacity
								className={'w-[40px] '}
								onPress={() => {
									router.back();
								}}
							>
								<Ionicons
									name={'chevron-back'}
									size={34}
									color={'white'}
								/>
							</TouchableOpacity>
							<StyledText className='text-offwhite font-bold text-4xl'>
								Sketch a Post
							</StyledText>
							<View className={'w-[40px] h-[40px] '}></View>
						</StyledView>
						<StyledView className='flex flex-col w-screen items-center py-3 px-[20px]'>
							<PostTypeSelector
								ref={typeRef}
								onSelect={handleSelect}
							/>
							<StyledInput
								className='bg-offblack text-[18px] w-full text-offwhite border border-outline rounded-lg px-3 py-[10px] my-2'
								placeholder={titlepplaceholder}
								placeholderTextColor={'#fefefe80'}
								inputMode='text'
								autoCorrect
								maxLength={39}
								onChangeText={(text) => {
									setTitle(text);
								}}
							/>
							{showDatePicker && (
								<>
									<View className='flex flex-row items-center justify-start w-full mb-2'>
										<Text className='text-offwhite text-[18px] pl-2'>
											Start:{' '}
										</Text>
										{(Platform.OS === 'android'
											? startDateShow
											: true) && (
											<DateTimePicker
												value={startDate}
												mode={'date'}
												display='default'
												onChange={(
													event,
													selectedDate
												) => {
													setStartDate(selectedDate);
													setStartDateShow(false);
												}}
											/>
										)}
										{(Platform.OS === 'android'
											? startTimeShow
											: true) && (
											<DateTimePicker
												value={startDate}
												mode={'time'}
												is24Hour={false}
												display={
													Platform.OS === 'android'
														? 'spinner'
														: 'default'
												}
												onChange={(
													event,
													selectedDate
												) => {
													setStartDate(selectedDate);
													setStartTimeShow(false);
												}}
											/>
										)}
										{Platform.OS === 'android' && (
											<>
												<Pressable
													className='bg-grey py-[5px] px-[10px] rounded-[8px] ml-[6px]'
													onPress={() => {
														setStartDateShow(true);
													}}
												>
													<Text className='text-offwhite text-[16px]'>
														{
															formatTimestamp(
																startDate.getTime(),
																-new Date().getTimezoneOffset(),
																-new Date().getTimezoneOffset()
															).split(', ')[0]
														}
														,{' '}
														{new Date().getYear() +
															1900}
													</Text>
												</Pressable>
												<Pressable
													className='bg-grey py-[5px] px-[10px] rounded-[8px] ml-[6px]'
													onPress={() => {
														setStartTimeShow(true);
													}}
												>
													<Text className='text-offwhite text-[16px]'>
														{
															formatTimestamp(
																startDate.getTime(),
																-new Date().getTimezoneOffset(),
																-new Date().getTimezoneOffset()
															).split(', ')[1]
														}
													</Text>
												</Pressable>
											</>
										)}
									</View>
									<View className='flex flex-row items-center justify-start w-full mb-2'>
										<Text className='text-offwhite text-[18px] pl-2'>
											End:{' '}
										</Text>
										{(Platform.OS === 'android'
											? endDateShow
											: true) && (
											<DateTimePicker
												value={endDate}
												mode={'date'}
												display='default'
												onChange={(
													event,
													selectedDate
												) => {
													setEndDate(selectedDate);
													setEndDateShow(false);
												}}
											/>
										)}
										{(Platform.OS === 'android'
											? endTimeShow
											: true) && (
											<DateTimePicker
												value={endDate}
												mode={'time'}
												is24Hour={false}
												display={
													Platform.OS === 'android'
														? 'spinner'
														: 'default'
												}
												onChange={(
													event,
													selectedDate
												) => {
													setEndDate(selectedDate);
													setEndTimeShow(false);
												}}
											/>
										)}
										{Platform.OS === 'android' && (
											<>
												<Pressable
													className='bg-grey py-[5px] px-[10px] rounded-[8px] ml-[6px]'
													onPress={() => {
														setEndDateShow(true);
													}}
												>
													<Text className='text-offwhite text-[16px]'>
														{
															formatTimestamp(
																endDate.getTime(),
																-new Date().getTimezoneOffset(),
																-new Date().getTimezoneOffset()
															).split(', ')[0]
														}
														,{' '}
														{new Date().getYear() +
															1900}
													</Text>
												</Pressable>
												<Pressable
													className='bg-grey py-[5px] px-[10px] rounded-[8px] ml-[6px]'
													onPress={() => {
														setEndTimeShow(true);
													}}
												>
													<Text className='text-offwhite text-[16px]'>
														{
															formatTimestamp(
																endDate.getTime(),
																-new Date().getTimezoneOffset(),
																-new Date().getTimezoneOffset()
															).split(', ')[1]
														}
													</Text>
												</Pressable>
											</>
										)}
									</View>
								</>
							)}
							<StyledInput
								className='bg-offblack text-[18px] w-full min-h-[100px] max-h-[150px] text-offwhite border border-outline rounded-lg px-3 py-[10px] my-2'
								placeholder={bodypplaceholder}
								multiline
								autoCorrect
								autoCapitalize='sentences'
								placeholderTextColor={'#fefefe80'}
								inputMode='text'
								maxLength={500}
								onChangeText={(text) => {
									setBody(text);
								}}
							/>
						</StyledView>
					</>
				</KeyboardAwareScrollView>

				{(Platform.OS === 'android' ? !isKeyboardVisible : true) && (
					<>
						<Filter
							open
							data={circles.slice(3)}
							multiselect
							backdropHidden
							ref={filterRef}
						/>
						<StyledView className='absolute w-screen bottom-10 flex flex-row justify-around px-[15px] mt-auto'>
							<Button
								title='Draw'
								height='h-[60px]'
								width='w-[125px]'
								press={async () => {
									if (title.length == 0 || body.length == 0)
										return notify(
											'Error Posting',
											'Please enter a title and body for your post.',
											'#CC2500'
										);
									if (addCircles.length == 0)
										return notify(
											'Error Posting',
											'Please select 1 or more circles to post to.',
											'#CC2500'
										);

									let newPostId = generateId();
									let now = Date.now();
									let typeSelectedVal = Math.round(
										Math.abs(
											typeRef.current.selected._value
										)
									);
									let typeSelected = '';
									if (typeSelectedVal == 0)
										typeSelected = 'annoucement';
									else if (typeSelectedVal == 1)
										typeSelected = 'praise';
									else if (typeSelectedVal == 2)
										typeSelected = 'request';
									else if (typeSelectedVal == 3)
										typeSelected = 'event';
									else if (typeSelectedVal == 4)
										typeSelected = 'thought';

									let circles = {};
									addCircles.forEach((circle) => {
										circles[circle] = true;
									});

									if (
										typeSelected === 'event' &&
										(!startDate || !endDate)
									)
										return notify(
											'Error Posting',
											'Please select a start and end date for your event.',
											'#CC2500'
										);
									setUploading(true);
									let newPost = {
										user: userData.uid,
										profile_img: userData.photoURL,
										name: userData.displayName,
										title: encrypt(newPostId, title),
										body: encrypt(newPostId, body),
										type: typeSelected,
										timestamp: now,
										circles,
										metadata: {
											flag_count: 0,
											start:
												typeSelected === 'event'
													? startDate.getTime()
													: null,
											end:
												typeSelected === 'event'
													? endDate.getTime()
													: null,
											timezone_offset:
												typeSelected === 'event'
													? -new Date().getTimezoneOffset()
													: null
										},
										settings: {
											viewable_comments:
												(await readData(
													`prayer_circle/users/${userData.uid}/private/post_preferences/comments`
												)) || false,
											viewable_interactions:
												(await readData(
													`prayer_circle/users/${userData.uid}/private/post_preferences/interactions`
												)) || 'private'
										}
									};
									writeData(
										`prayer_circle/users/${userData.uid}/private/posts/${newPostId}`,
										now,
										true
									)
										.then(() => {
											return writeData(
												`prayer_circle/posts/${newPostId}`,
												newPost,
												true
											);
										})
										.then(() => {
											const writePromises =
												addCircles.map((circle) => {
													return writeData(
														`prayer_circle/circles/${circle}/posts/${newPostId}`,
														now,
														true
													);
												});
											return Promise.all(writePromises);
										})
										.then(() => {
											setUploading(true);
											// Proceed with other operations after data is successfully written
										})
										.catch((error) => {
											console.error(
												'Error writing data to the database:',
												error
											);
											setUploading(false);
											// Handle error, retry, or notify the user
										});
									setGlobalReload(true);
									setTimeout(() => {
										router.back();
									}, 1000);
								}}
							/>
						</StyledView>
					</>
				)}
			</StyledSafeArea>
			<Loading
				loading={uploading}
				circle
				text={'Creating Post...'}
				width={'w-[80%] max-w-[500px]'}
				height={'h-[200px] max-h-[500px]'}
				allowEvents={uploading ? 'auto' : 'none'}
			/>
		</>
	);
}
