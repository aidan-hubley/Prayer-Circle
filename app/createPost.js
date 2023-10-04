import React, { useState } from 'react';
import { SafeAreaView, Text, View, TextInput, StatusBar } from 'react-native';
import { styled } from 'nativewind';
import { PostTypeSelector } from '../components/PostTypeSelector';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Button } from '../components/Buttons';

const StyledSafeArea = styled(SafeAreaView);
const StyledView = styled(View);
const StyledText = styled(Text);
const StyledInput = styled(TextInput);

export default function Page() {
	const [title, setTitle] = React.useState('');
	const [body, setBody] = React.useState('');
	const [time, setTime] = React.useState('');

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
							className='bg-offblack text-[18px] w-full text-offwhite border border-offwhite rounded-lg px-3 py-[10px] my-3'
							placeholder={'Title'}
							placeholderTextColor={'#fff'}
							inputMode='text'
							/* autoFocus */
							maxLength={22}
							ref={(input) => {
								this.postTitle = input;
							}}
						/>
						<StyledInput
							className='bg-offblack text-[18px] w-full min-h-[200px] h-[300px] max-h-[50%] text-offwhite border border-offwhite rounded-lg px-3 py-[10px] my-3'
							placeholder={'Write a Post'}
							multiline
							placeholderTextColor={'#fff'}
							inputMode='text'
							maxLength={500}
							ref={(input) => {
								this.postDescription = input;
							}}
						/>
						<PostTypeSelector></PostTypeSelector>
					</StyledView>
				</>
			</KeyboardAwareScrollView>
			<StyledView className='absolute w-screen bottom-10 flex flex-row justify-between px-[15px] mt-auto'>
				<Button
					title='Erase'
					width='w-[125px]'
					href='/feed'
					press={() => {
						this.postTitle.clear();
						this.postDescription.clear();
					}}
				/>
				<Button title='Draw' width='w-[125px]' />
			</StyledView>
		</StyledSafeArea>
	);
}
