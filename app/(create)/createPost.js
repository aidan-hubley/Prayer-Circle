import React, { useRef, useState } from 'react';
import { SafeAreaView, Text, View, TextInput, StatusBar } from 'react-native';
import { styled } from 'nativewind';
import { PostTypeSelector } from '../../components/PostTypeSelector';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Button } from '../../components/Buttons';
import { writeData, generateId } from '../../backend/firebaseFunctions';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from '../../backend/config';
import { readData } from '../../backend/firebaseFunctions';

const StyledSafeArea = styled(SafeAreaView);
const StyledView = styled(View);
const StyledText = styled(Text);
const StyledInput = styled(TextInput);

export default function Page() {
	const [title, setTitle] = useState('');
	const [body, setBody] = useState('');
	const [time, setTime] = useState('');

	const typeRef = useRef();

	return (
		<StyledSafeArea className='bg-offblack border' style={{ flex: 1 }}>
			<KeyboardAwareScrollView>
				<>
					<StyledView className='flex items-center justify-center text-center w-screen h-[100px]'>
						<StyledText className='text-offwhite font-bold text-4xl'>
							Sketch a Post
						</StyledText>
					</StyledView>
					<StyledView className='flex flex-col w-screen items-center py-4 px-[20px]'>
						<StyledInput
							className='bg-offblack text-[18px] w-full text-offwhite border border-offwhite rounded-lg px-3 py-[10px] my-2'
							placeholder={'Title'}
							placeholderTextColor={'#fff'}
							inputMode='text'
							autoCorrect
							maxLength={22}
							ref={(input) => {
								this.postTitle = input;
							}}
							onChangeText={(text) => {
								setTitle(text);
							}}
						/>
						<StyledInput
							className='bg-offblack text-[18px] w-full min-h-[200px] h-[300px] max-h-[50%] text-offwhite border border-offwhite rounded-lg px-3 py-[10px] my-2'
							placeholder={'Write a Post'}
							multiline
							autoCorrect
							autoCapitalize='sentences'
							placeholderTextColor={'#fff'}
							inputMode='text'
							maxLength={500}
							ref={(input) => {
								this.postDescription = input;
							}}
							onChangeText={(text) => {
								setBody(text);
							}}
						/>
						<PostTypeSelector ref={typeRef} />
					</StyledView>
				</>
			</KeyboardAwareScrollView>
			<StyledView className='absolute w-screen bottom-10 flex flex-row justify-between px-[15px] mt-auto'>
				<Button
					title='Erase'
					width='w-[125px]'
					height='h-[60px]'
					href='/mainViewLayout'
					bgColor={'bg-offblack'}
					borderColor={'border-offwhite border-2'}
					textColor={'text-offwhite'}
					press={() => {
						this.postTitle.clear();
						this.postDescription.clear();
					}}
				/>
				<Button
					title='Draw'
					height='h-[60px]'
					width='w-[125px]'
					press={async () => {
						if (title.length == 0 || body.length == 0)
							return alert(
								'Please enter a title and body for your post.'
							);

						let newPostId = generateId();
						let typeSelectedVal = Math.round(
							Math.abs(typeRef.current.selected._value)
						);
						let typeSelected = '';
						if (typeSelectedVal == 0) typeSelected = 'praise';
						else if (typeSelectedVal == 1) typeSelected = 'request';
						else if (typeSelectedVal == 2) typeSelected = 'event';

						let uid = await AsyncStorage.getItem('user');
						let name = await readData(`prayer_circle/users/${uid}`);
						console.log(name);
						name = name.fname + ' ' + name.lname;
						console.log(name);

						let newPost = {
							user: uid,
							profile_img: `https://picsum.photos/${Math.round(
								Math.random() * 1000
							)}`,
							name: name,
							title: title,
							text: body,
							type: typeSelected,
							timestamp: Date.now(),
							comments: {
								empty: true
							},
							reactions: {
								empty: true
							},
							circles: {
								'-NhXfdEbrH1yxRqiajYm': true
							},
							metadata: {
								flag_count: 0
							}
						};
						await writeData(
							`prayer_circle/posts/${newPostId}`,
							newPost,
							true
						);
						await writeData(
							`prayer_circle/circles/-NhYtVYMYvc_HpBK-ohk/posts/${newPostId}`,
							true,
							true
						);
						await writeData(
							`prayer_circle/users/BBAzhYq9VGgofMNO5Jl3cmpT2xe2/posts/${newPostId}`,
							true,
							true
						);

						this.postTitle.clear();
						this.postDescription.clear();
						router.push('/mainViewLayout');
					}}
				/>
			</StyledView>
		</StyledSafeArea>
	);
}
