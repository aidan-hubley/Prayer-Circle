import React, { useEffect, useRef, useState } from 'react';
import { Text, View, TextInput, TouchableOpacity } from 'react-native';
import { styled } from 'nativewind';
import { PostTypeSelector } from '../../components/PostTypeSelector';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Button } from '../../components/Buttons';
import { writeData, generateId } from '../../backend/firebaseFunctions';
import { router } from 'expo-router';
import {
	SafeAreaView,
	useSafeAreaInsets
} from 'react-native-safe-area-context';
import { useStore } from '../global';
import { Filter } from '../../components/Filter';
import { Ionicons } from '@expo/vector-icons';
import { auth } from '../../backend/config';

const StyledSafeArea = styled(SafeAreaView);
const StyledView = styled(View);
const StyledText = styled(Text);
const StyledInput = styled(TextInput);

export default function Page() {
	const [title, setTitle] = useState('');
	const [body, setBody] = useState('');
	const [time, setTime] = useState('');
	const [userData, setUserData] = useState(auth.currentUser);
	const typeRef = useRef();
	const [showDatePicker, setShowDatePicker] = useState(false);
	const [circles, setGlobalReload, addCircles] = useStore((state) => [
		state.circles,
		state.setGlobalReload,
		state.addCircles
	]);
	const insets = useSafeAreaInsets();

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
							placeholderTextColor={'#fff'}
							inputMode='text'
							autoCorrect
							maxLength={39}
							onChangeText={(text) => {
								setTitle(text);
							}}
						/>
						{showDatePicker && (
							<StyledInput
								className='bg-offblack text-[18px] w-full text-offwhite border border-outline rounded-lg px-3 py-[10px] my-2'
								placeholder={'Event'}
								placeholderTextColor={'#fff'}
								inputMode='text'
								autoCorrect
								maxLength={39}
								onChangeText={(text) => {
									setTitle(text);
								}}
							/>
						)}
						<StyledInput
							className='bg-offblack text-[18px] w-full min-h-[100px] max-h-[150px] text-offwhite border border-outline rounded-lg px-3 py-[10px] my-2'
							placeholder={'Write a Post'}
							multiline
							autoCorrect
							autoCapitalize='sentences'
							placeholderTextColor={'#fff'}
							inputMode='text'
							maxLength={500}
							onChangeText={(text) => {
								setBody(text);
							}}
						/>
					</StyledView>
				</>
			</KeyboardAwareScrollView>

			<Filter open data={circles.slice(2)} multiselect backdropHidden />
			<StyledView className='absolute w-screen bottom-10 flex flex-row justify-around px-[15px] mt-auto'>
				{/* <Button
					title='Erase'
					width='w-[125px]'
					height='h-[60px]'
					bgColor={'bg-offblack'}
					borderColor={'border-offwhite border-2'}
					textColor={'text-offwhite'}
					press={() => {
						router.push('/');
					}}
				/> */}
				<Button
					title='Draw'
					height='h-[60px]'
					width='w-[125px]'
					press={async () => {
						if (title.length == 0 || body.length == 0)
							return alert(
								'Please enter a title and body for your post.'
							);
						if (addCircles.length == 0)
							return alert(
								'Please select 1 or more circles to post to.'
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

						let newPost = {
							user: userData.uid,
							profile_img: userData.photoURL,
							name: userData.displayName,
							title: title,
							text: body,
							type: typeSelected,
							timestamp: now,
							circles,
							metadata: {
								flag_count: 0
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
						});
						router.back();
					}}
				/>
			</StyledView>
		</StyledSafeArea>
	);
}
