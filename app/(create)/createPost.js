import React, { useEffect, useRef, useState, useCallback } from 'react';
import {
	Text,
	View,
	Image,
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
import { DailyBread } from 'daily-bread';
import {
	BottomSheetModal,
	BottomSheetFlatList,
	BottomSheetModalProvider
} from '@gorhom/bottom-sheet';
import {
	handle,
	backdrop,
	SnapPoints
} from '../../components/BottomSheetModalHelpers.js';

const StyledSafeArea = styled(SafeAreaView);
const StyledImg = styled(Image);
const StyledView = styled(View);
const StyledText = styled(Text);
const StyledInput = styled(TextInput);
const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const bible = new DailyBread();

export default function Page() {	
	const [title, setTitle] = useState('');
	const [body, setBody] = useState('');
	const [book, setBook] = useState('');
	const [chapter, setChapter] = useState('');
	const [verse, setVerse] = useState('');
	const [passage, setPassage] = useState('');
	const [titlepplaceholder, setTitlePlaceholder] = useState('Title');
	const [bodypplaceholder, setBodyPlaceholder] = useState('Write a Post');
	const [userData, setUserData] = useState(auth.currentUser);
	const typeRef = useRef();
	const [showDatePicker, setShowDatePicker] = useState(false);
	const [showVerse, setShowVerse] = useState(false);
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
	const filterRef = useRef();

	const booksOfTheBible = [
		{ name: "Genesis", index: 1 },
		{ name: "Exodus", index: 2 },
		{ name: "Leviticus", index: 3 },
		{ name: "Numbers", index: 4 },
		{ name: "Deuteronomy", index: 5 },
		{ name: "Joshua", index: 6 },
		{ name: "Judges", index: 7 },
		{ name: "Ruth", index: 8 },
		{ name: "1 Samuel", index: 9 },
		{ name: "2 Samuel", index: 10 },
		{ name: "1 Kings", index: 11 },
		{ name: "2 Kings", index: 12 },
		{ name: "1 Chronicles", index: 13 },
		{ name: "2 Chronicles", index: 14 },
		{ name: "Ezra", index: 15 },
		{ name: "Nehemiah", index: 16 },
		{ name: "Esther", index: 17 },
		{ name: "Job", index: 18 },
		{ name: "Psalms", index: 19 },
		{ name: "Proverbs", index: 20 },
		{ name: "Ecclesiastes", index: 21 },
		{ name: "Song of Solomon", index: 22 },
		{ name: "Isaiah", index: 23 },
		{ name: "Jeremiah", index: 24 },
		{ name: "Lamentations", index: 25 },
		{ name: "Ezekiel", index: 62 },
		{ name: "Daniel", index: 27 },
		{ name: "Hosea", index: 28 },
		{ name: "Joel", index: 29 },
		{ name: "Amos", index: 30 },
		{ name: "Obadiah", index: 31 },
		{ name: "Jonah", index: 32 },
		{ name: "Micah", index: 33 },
		{ name: "Nahum", index: 34 },
		{ name: "Habakkuk", index: 35 },
		{ name: "Zephaniah", index: 36 },
		{ name: "Haggai", index: 37 },
		{ name: "Zechariah", index: 38 },
		{ name: "Malachi", index: 39 },
	    { name: "Matthew", index: 40 },
		{ name: "Mark", index: 41 },
		{ name: "Luke", index: 42 },
		{ name: "John", index: 43 },
		{ name: "Acts of the Apostles", index: 44 },
		{ name: "Romans", index: 45 },
		{ name: "1 Corinthians", index: 46 },
		{ name: "2 Corinthians", index: 47 },
		{ name: "Galatians", index: 48 },
		{ name: "Ephesians", index: 49 },
		{ name: "Philippians", index: 50 },
		{ name: "Colossians", index: 51 },
		{ name: "1 Thessalonians", index: 52 },
		{ name: "2 Thessalonians", index: 53 },
		{ name: "1 Timothy", index: 54 },
		{ name: "2 Timothy", index: 55 },
		{ name: "Titus", index: 56 },
		{ name: "Philemon", index: 57 },
		{ name: "Hebrews", index: 58 },
		{ name: "James", index: 59 },
		{ name: "1 Peter", index: 60 },
		{ name: "2 Peter", index: 61 },
		{ name: "1 John", index: 62 },
		{ name: "2 John", index: 63 },
		{ name: "3 John", index: 64 },
		{ name: "Jude", index: 65 },
		{ name: "Revelation", index: 66 },
	];	  

	const [handleText, setHandleText] = useState('');

	// bottom sheet modal
	const bottomSheetModalRef = useRef(null);
	const handlePresentModalPress = useCallback(() => {
		bottomSheetModalRef.current?.present();
	}, []);
	const [modalContent, setModalContent] = useState(null);

	const handleVerse = () => {
		setHandleText('Add Scripture');
		setModalContent('verse');
		handlePresentModalPress();
	};
	const handleInform = () => {
		setHandleText('How to Create a Post');
		setModalContent('info');
		handlePresentModalPress();
	};

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

	const searchVerse = async () => {
		const votd = await bible.votd();
		console.log(votd.text);
		const gen11 = await bible.getOne('Genesis 1:1');
		console.log(gen11.text);
		// const newpassage = book + ' ' + chapter + ':' + verse;
		// console.log(newpassage);
		// newpassage = await bible.getOne(newpassage);
		// setPassage(newpassage.text);
		// console.log(newpassage.text);
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
		<BottomSheetModalProvider>
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
							<TouchableOpacity
								className={'w-[40px] '}
								onPress={() => {handleInform()}}
							>
								<Ionicons
									name={'information-circle-outline'}
									size={34}
									color={'white'}
								/>
							</TouchableOpacity>
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
													onChange={(event, selectedDate) => {
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
													onChange={(event, selectedDate) => {
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
													onChange={(event, selectedDate) => {
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
													onChange={(event, selectedDate) => {
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
							{showVerse == false ? (
								<StyledView className="flex flex-row items-center justify-between w-full my-2">
									<StyledText className='text-[#fefefe80] text-[18px] my-2'>
										Optional: Add Scripture to your post!
									</StyledText>
									<Button
										icon='add'
										width='w-[34px]'
										height='h-[34px]'
										iconColor='#FFFBFC'
										btnStyles={
											'bg-grey border border-outline'
										}
										// press={() => {handleVerse()}}
										press={() => {searchVerse()}}
									/>							
								</StyledView>
							) : (
								<StyledView className="flex flex-row items-center justify-start w-full my-2">
									{/* <StyledImg
										source={require('../../assets/post/bible_outline.png')}
										className='w-[32px] h-[34px]'
									/> */}
									<StyledText className='flex-1 text-center text-[#fefefe80] text-[18px] w-full text-center my-2'>
										{verse}
									</StyledText>
									<Button
										icon='remove'
										width='w-[34px]'
										height='h-[34px]'
										iconColor='#FFFBFC'
										btnStyles={
											'bg-grey border border-outline rotate-[45deg]'
										}
										press={() => {
											setShowVerse(false);
										}}
									/>		
								</StyledView>
							)}
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
										Math.abs(typeRef.current.selected._value)
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
											const writePromises = addCircles.map(
												(circle) => {
													return writeData(
														`prayer_circle/circles/${circle}/posts/${newPostId}`,
														now,
														true
													);
												}
											);
											return Promise.all(writePromises);
										})
										.then(() => {
											// Proceed with other operations after data is successfully written
										})
										.catch((error) => {
											console.error(
												'Error writing data to the database:',
												error
											);
											// Handle error, retry, or notify the user
										});

									setGlobalReload(true);
									router.back();
								}}
							/>
						</StyledView>
					</>
				)}
			</StyledSafeArea>
			<BottomSheetModal
				enableDismissOnClose={true}
				ref={bottomSheetModalRef}
				index={0}
				snapPoints={SnapPoints(['85%'])}
				handleComponent={() => handle(handleText)}
				backdropComponent={(backdropProps) =>
					backdrop(backdropProps)
				}
				keyboardBehavior='extend'
			>
				<StyledView className='flex-1 bg-grey'>
					{modalContent === 'verse' && (
						<>
							<StyledView className='flex flex-row items-center justify-start p-2'>
								<StyledInput className='bg-offblack text-[18px] flex-1 text-offwhite border border-outline rounded-lg px-3 py-[10px] my-2'
									placeholder='Book'
									placeholderTextColor={'#fefefe80'}
									inputMode='text'
									autoCorrect
									maxLength={39}
									onChangeText={(text) => {
										setBook(text);
									}}
								/>
								<StyledInput className='bg-offblack text-[18px] w-[15%] text-offwhite border border-outline rounded-lg px-3 py-[10px] my-2 mx-1'
									placeholder='Ch'
									placeholderTextColor={'#fefefe80'}
									inputMode='numeric'
									autoCorrect
									maxLength={39}	
									onChangeText={(text) => {
										setChapter(text);
									}}								
								/>							
								<StyledInput className='bg-offblack text-[18px] w-[15%] text-offwhite border border-outline rounded-lg px-3 py-[10px] my-2'
									placeholder='#'
									placeholderTextColor={'#fefefe80'}
									inputMode='numeric'
									autoCorrect
									maxLength={39}
									onChangeText={(text) => {
										setVerse(text);
									}}
								/>
							</StyledView>
							<Button
								title='Search Verse'								
								width='w-[95%]'
								height='h-[40px]'								
								btnStyles={
									'bg-grey border border-outline bg-offwhite text-offblack self-center'
								}
								press={() => {searchVerse()}}
							/>
							<StyledView className='flex flex-row items-center justify-start p-2'>
								{passage}
							</StyledView>
						</>
					)}
					{modalContent === 'info' && (
						<StyledView>
						</StyledView>
					)}
				</StyledView>
			</BottomSheetModal>
		</BottomSheetModalProvider>
	);
}
