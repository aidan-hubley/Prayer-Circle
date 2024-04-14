import React, { useState, useRef } from 'react';
import {
	Text,
	View,
	TextInput,
	TouchableOpacity,
	Keyboard
} from 'react-native';
import { styled } from 'nativewind';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Button } from '../../components/Buttons';
import { IconSelector } from '../../components/iconSelector';
import {
	useSafeAreaInsets,
	SafeAreaView
} from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';
import { createCircle } from '../../backend/firebaseFunctions';
import { ColorPicker, fromHsv } from 'react-native-color-picker';
import Slider from '@react-native-community/slider';
import { router } from 'expo-router';
import { useStore, notify } from '../global';
import { Loading } from '../../components/Loading';

const StyledSafeArea = styled(SafeAreaView);
const StyledView = styled(View);
const StyledText = styled(Text);
const StyledInput = styled(TextInput);
const StyledOpacity = styled(TouchableOpacity);
const StyledIcon = styled(Ionicons);
const StyledColorPicker = styled(ColorPicker);

export default function Page() {
	const [title, setTitle] = useState('');
	const [description, setDescription] = useState('');
	const [icon, setIcon] = useState(null);
	const [iconColor, setIconColor] = useState(null);
	const iconSelectorRef = useRef();
	const circleColorRef = useRef();
	const setFilterReload = useStore((state) => state.setFilterReload);
	const [uploading, setUploading] = useState(false);
	let insets = useSafeAreaInsets();

	const handleIconSelected = (icon, iconColor) => {
		setIcon(icon);
		setIconColor(iconColor);
	};

	return (
		<>
			<StyledSafeArea className='bg-offblack flex-1'>
				<KeyboardAwareScrollView
					bounces={false}
					keyboardShouldPersistTaps='handled'
				>
					<StyledView className='bg-offblack flex-1 flex flex-col items-center'>
						<StyledView className='flex items-center justify-center text-center w-screen'>
							<StyledText className='text-offwhite font-bold text-4xl'>
								Form a Circle
							</StyledText>
							<StyledText className='text-offwhite text-2xl'>
								Select a Color and Icon!
							</StyledText>
							<StyledText className='text-offwhite text-[15px]'>
								To select an icon, click the circle below!
							</StyledText>
						</StyledView>
						<StyledView className='relative  flex w-screen aspect-square justify-center items-center mt-4 mb-2'>
							<StyledColorPicker
								className='w-[100%]'
								ref={circleColorRef}
								sliderComponent={Slider}
								hideSliders={true}
								style={{ flex: 1 }}
							/>
							<StyledOpacity
								className='absolute h-[40%] aspect-square bg-offblack rounded-full items-center justify-center'
								onPress={() => {
									iconSelectorRef.current.toggleSelector(
										true
									);
								}}
							>
								<StyledIcon
									name={icon}
									size={85}
									color={iconColor}
								/>
							</StyledOpacity>
						</StyledView>
						<StyledView className='w-full h-auto flex items-center justify-between px-[15px]'>
							<StyledInput
								className='bg-offblack text-[18px] h-[42px] w-full text-offwhite border border-offwhite rounded-lg px-3 py-[5px]'
								placeholder={'Circle Name'}
								placeholderTextColor={'#ffffff66'}
								inputMode='text'
								maxLength={22}
								onChangeText={(text) => {
									setTitle(text);
								}}
								onBlur={() => {
									Keyboard.dismiss();
								}}
							/>
							<StyledInput
								className='bg-offblack text-[18px] w-full min-h-[42px] text-offwhite border border-offwhite rounded-lg px-3 py-[10px] my-3'
								placeholder={'Write a bit about this Circle...'}
								placeholderTextColor={'#ffffff66'}
								inputMode='text'
								maxLength={300}
								multiline
								rows={3}
								onChangeText={(text) => {
									setDescription(text);
								}}
								returnKeyType='done'
								blurOnSubmit={true}
								onBlur={() => {
									Keyboard.dismiss();
								}}
							/>
						</StyledView>
					</StyledView>
				</KeyboardAwareScrollView>
				<StyledView
					className='absolute flex flex-row w-screen px-[15px] justify-between bg-offblack pb-5'
					style={{ bottom: insets.bottom }}
				>
					<Button
						title='Erase'
						width='w-[125px]'
						height='h-[60px]'
						href='/'
						bgColor={'bg-offblack'}
						borderColor={'#FFFBFC'}
						borderWidth={'border-2'}
						textColor={'text-offwhite'}
					/>
					<Button
						title='Draw'
						height='h-[60px]'
						width='w-[125px]'
						press={async () => {
							setUploading(true);
							if (title?.length == 0) {
								notify(
									'Error',
									'Please enter a title',
									'#CC2500'
								);
								return;
							}

							let borderColor = fromHsv(
								circleColorRef.current.state.color
							);

							let data = {
								title: title,
								description: description,
								iconColor: iconColor,
								icon: icon,
								timestamp: Date.now(),
								type: 'individual',
								color: borderColor,
								members: {},
								admin: {},
								usersAwaitingEntry: {},
								owner: false
							};

							if (title === 'Tutorial') {
								notify(
									'Error',
									'Please choose another title',
									'#CC2500'
								);
								return;
							}

							await createCircle(data);
							setUploading(false);
							notify(
								'Circle Successfully Created',
								'You can access your new circle from the filter.',
								'#00A55E'
							);
							setTimeout(() => {
								setFilterReload(true);
							}, 600);

							router.push('/');
						}}
					/>
				</StyledView>
				<IconSelector
					onIconSelected={handleIconSelected}
					ref={iconSelectorRef}
				/>
			</StyledSafeArea>
			<Loading
				loading={uploading}
				circle
				text={'Creating Circle...'}
				width={'w-[80%] max-w-[500px]'}
				height={'h-[200px] max-h-[500px]'}
				allowEvents={uploading ? 'auto' : 'none'}
			/>
		</>
	);
}
