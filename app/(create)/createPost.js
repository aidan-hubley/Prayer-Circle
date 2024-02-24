import React, { useEffect, useRef, useState } from 'react';
import {
	Text,
	View,
	TextInput,
	TouchableOpacity,
	Pressable,
	Animated
} from 'react-native';
import { styled } from 'nativewind';
import { PostTypeSelector } from '../../components/PostTypeSelector';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Button } from '../../components/Buttons';
import { writeData, generateId } from '../../backend/firebaseFunctions';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useStore, notify } from '../global';
import { Filter } from '../../components/Filter';
import { Ionicons } from '@expo/vector-icons';
import { auth } from '../../backend/config';
import DateTimePicker from 'react-native-ui-datepicker';
import dayjs from 'dayjs';
import { formatDateAndTime, isTimeBefore } from '../../backend/functions';
import { encrypt, decrypt } from 'react-native-simple-encryption';

const StyledSafeArea = styled(SafeAreaView);
const StyledView = styled(View);
const StyledText = styled(Text);
const StyledInput = styled(TextInput);
const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export default function Page() {
	const [title, setTitle] = useState('');
	const [body, setBody] = useState('');
	const [startDate, setStartDate] = useState(null);
	const [endDate, setEndDate] = useState(null);
	const [getDate, setGetDate] = useState(dayjs);
	const [getWhichDate, setGetWhichDate] = useState(null);
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
	const [dateTimePickerShown, setDateTimePickerShown] = useState(false);
	const dtpOpacity = useRef(new Animated.Value(0)).current;

	const dtpInter = dtpOpacity.interpolate({
		inputRange: [0, 1],
		outputRange: [0, 1]
	});

	const toggleDateTimePicker = () => {
		Animated.spring(dtpOpacity, {
			toValue: dateTimePickerShown ? 0 : 1,
			duration: 200,
			useNativeDriver: true
		}).start();
		setDateTimePickerShown(!dateTimePickerShown);
	};

	const handleSelect = (index) => {
		if (index == 2) {
			setShowDatePicker(true);
		} else {
			setShowDatePicker(false);
		}
	};

	useEffect(() => {
		setUserData(auth.currentUser);
	}, [auth.currentUser]);

	useEffect(() => {
		setAddCircles([]);
	}, []);

	return (
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
							placeholder={'Title'}
							placeholderTextColor={'#fefefe80'}
							inputMode='text'
							autoCorrect
							maxLength={39}
							onChangeText={(text) => {
								setTitle(text);
							}}
						/>
						{showDatePicker && (
							<View className='w-full flex flex-row justify-between'>
								<Pressable
									className='bg-offblack w-[48%] border border-outline rounded-lg px-3 py-[10px] my-2'
									onPress={() => {
										setGetWhichDate('start');
										toggleDateTimePicker();
									}}
								>
									<Text
										className='text-[18px]'
										style={{
											color: startDate
												? '#fefefe'
												: '#fefefe80'
										}}
									>
										{startDate
											? formatDateAndTime(startDate)
											: 'Start'}
									</Text>
								</Pressable>
								<Pressable
									className='bg-offblack w-[48%] border border-outline rounded-lg px-3 py-[10px] my-2'
									onPress={() => {
										setGetWhichDate('end');
										toggleDateTimePicker();
									}}
								>
									<Text
										className='text-[18px]'
										style={{
											color: endDate
												? '#fefefe'
												: '#fefefe80'
										}}
									>
										{endDate
											? formatDateAndTime(endDate)
											: 'End'}
									</Text>
								</Pressable>
							</View>
						)}
						<StyledInput
							className='bg-offblack text-[18px] w-full min-h-[100px] max-h-[150px] text-offwhite border border-outline rounded-lg px-3 py-[10px] my-2'
							placeholder={'Write a Post'}
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

			<Filter open data={circles.slice(3)} multiselect backdropHidden />
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
						if (typeSelectedVal == 0) typeSelected = 'praise';
						else if (typeSelectedVal == 1) typeSelected = 'request';
						else if (typeSelectedVal == 2) typeSelected = 'event';

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
									typeSelected === 'event' ? startDate : null,
								end: typeSelected === 'event' ? endDate : null
							}
						};
						await writeData(
							`prayer_circle/posts/${newPostId}`,
							newPost,
							true
						);
						for (let circle of addCircles) {
							await writeData(
								`prayer_circle/circles/${circle}/posts/${newPostId}`,
								now,
								true
							);
						}
						writeData(
							`prayer_circle/users/${userData.uid}/private/posts/${newPostId}`,
							now,
							true
						).then(() => {
							setGlobalReload(true);
							router.back();
						});
					}}
				/>
			</StyledView>
			<AnimatedPressable
				className='absolute w-screen h-screen items-center justify-center bg-[#12121280]'
				onPress={() => {
					if (getWhichDate === 'start') {
						setStartDate(getDate);
						toggleDateTimePicker();
					} else {
						let start = startDate.split(' ');
						let end = getDate.split(' ');
						if (
							start[0] === end[0] &&
							isTimeBefore(start[1], end[1])
						) {
							return notify(
								'Invalid Date',
								'Please select a valid end time.',
								'#CC2500'
							);
						} else {
							setEndDate(getDate);
							toggleDateTimePicker();
						}
					}
				}}
				style={{ opacity: dtpInter }}
				pointerEvents={dateTimePickerShown ? 'auto' : 'none'}
			>
				<View className='w-[80%] max-w-[340px] border border-outline bg-offblack py-2 px-2 rounded-2xl'>
					<DateTimePicker
						mode='single'
						date={getDate}
						onChange={(params) => {
							setGetDate(params.date);
						}}
						selectedItemColor='#5946B2'
						timePicker
						minDate={
							getWhichDate === 'start'
								? new Date().setDate(new Date().getDate() - 1)
								: startDate
						}
						calendarTextStyle={{ color: '#FEFEFE' }}
						headerTextStyle={{ color: '#FEFEFE', fontSize: 18 }}
						weekDaysTextStyle={{ color: '#FEFEFE' }}
						monthContainerStyle={{ backgroundColor: '#121212' }}
						yearContainerStyle={{ backgroundColor: '#121212' }}
						headerButtonColor='#FEFEFE'
						dayContainerStyle={{
							borderRadius: 8
						}}
						headerButtonsPosition='right'
						timePickerContainerStyle={{
							color: '#FEFEFE',
							backgroundColor: '#121212'
						}}
					/>
				</View>
			</AnimatedPressable>
		</StyledSafeArea>
	);
}
