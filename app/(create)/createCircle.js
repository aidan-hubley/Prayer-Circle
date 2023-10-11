import React, { useState, useRef } from 'react';
import {
	SafeAreaView,
	Text,
	View,
	TextInput,
	TouchableOpacity,
	Image,
	StatusBar
} from 'react-native';
import { styled } from 'nativewind';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Button } from '../../components/Buttons';
import { useActionSheet } from '@expo/react-native-action-sheet';
import { IconSelector } from '../../components/iconSelector';
import Ionicons from '@expo/vector-icons/Ionicons';

const StyledSafeArea = styled(SafeAreaView);
const StyledView = styled(View);
const StyledText = styled(Text);
const StyledInput = styled(TextInput);
const StyledOpacity = styled(TouchableOpacity);
const StyledImage = styled(Image);
const StyledIcon = styled(Ionicons);

export default function Page() {
	const [title, setTitle] = useState('');
	const [body, setBody] = useState('');
	const [circleIcon, setCircleIcon] = useState('');

	const iconSelectorRef = useRef();

	const { showActionSheetWithOptions } = useActionSheet();

	const onPress = () => {
		showActionSheetWithOptions(
			{
				options: ['Image', 'Icon', 'Cancel'],
				cancelButtonIndex: 2,
				userInterfaceStyle: 'dark'
			},
			(selectedIndex) => {
				switch (selectedIndex) {
					case 0:
						console.log('Image');

						break;

					case 1:
						iconSelectorRef.current.toggleSelector(true);
						break;

					case 2:
					// Canceled
				}
			}
		);
	};

	function updateIcon() {
		setTimeout(() => {
			setCircleIcon(iconSelectorRef.current.icon);
		}, 100);
	}

	return (
		<StyledSafeArea className='bg-offblack border' style={{ flex: 1 }}>
			<>
				<KeyboardAwareScrollView>
					<>
						<StyledView className='flex items-center justify-center text-center w-screen h-[100px]'>
							<StyledText className='text-offwhite font-bold text-4xl'>
								Form a Circle
							</StyledText>
						</StyledView>
						<StyledView className='flex flex-col w-screen items-center px-[20px]'>
							<StyledOpacity
								className='w-[120px] h-[120px] border-[5px] items-center justify-center border-purple rounded-full mb-5'
								onPress={() => {
									onPress();
								}}
							>
								{/* <StyledImage
									className='w-full h-full rounded-full'
									source={{
										uri: 'https://picsum.photos/435'
									}}
								/> */}
								<StyledIcon
									name={circleIcon}
									size={80}
									color={'#ffffff'}
								/>
							</StyledOpacity>

							<StyledView className='w-full flex flex-row items-center justify-between'>
								<StyledInput
									className='bg-offblack text-[18px] flex-1 h-[42px] text-offwhite border border-offwhite rounded-lg px-3 py-[5px] mr-1'
									placeholder={'Circle Name'}
									placeholderTextColor={'#fff'}
									inputMode='text'
									/* autoFocus */
									maxLength={22}
									ref={(input) => {
										this.circleTitle = input;
									}}
								/>
								<StyledView className='w-[50px] h-[42px] ml-1 rounded-lg bg-purple border border-offwhite'></StyledView>
							</StyledView>
							<StyledInput
								className='bg-offblack text-[18px] w-full min-h-[100px] h-[200px] max-h-[50%] text-offwhite border border-offwhite rounded-lg px-3 py-[10px] my-3'
								placeholder={'Write a Post'}
								multiline
								placeholderTextColor={'#fff'}
								inputMode='text'
								maxLength={500}
								ref={(input) => {
									this.circleDescription = input;
								}}
							/>
						</StyledView>
					</>
				</KeyboardAwareScrollView>
				<StyledView className='absolute w-screen bottom-10 flex flex-row justify-between px-[15px] mt-auto'>
					<Button
						title='Erase'
						width='w-[125px]'
						height='h-[60px]'
						href='/feed'
						bgColor={'bg-offblack'}
						borderColor={'border-offwhite border-2'}
						textColor={'text-offwhite'}
						press={() => {
							this.circleTitle.clear();
							this.circleDescription.clear();
						}}
					/>
					<Button
						title='Draw'
						href='/imageUpload'
						height='h-[60px]'
						width='w-[125px]'
					/>
				</StyledView>
				<IconSelector
					close={() => updateIcon()}
					ref={iconSelectorRef}
				/>
			</>
		</StyledSafeArea>
	);
}
