import React, { useState, useRef } from 'react';
import {
	SafeAreaView,
	Text,
	View,
	TextInput,
	TouchableOpacity,
	Image, 
	Keyboard
} from 'react-native';
import { styled } from 'nativewind';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Button } from '../../components/Buttons';
import { useActionSheet } from '@expo/react-native-action-sheet';
import { IconSelector } from '../../components/iconSelector';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';
import { createCircle } from '../../backend/firebaseFunctions';
import { ColorPicker, fromHsv } from 'react-native-color-picker'
import Slider from '@react-native-community/slider';

const StyledSafeArea = styled(SafeAreaView);
const StyledView = styled(View);
const StyledText = styled(Text);
const StyledInput = styled(TextInput);
const StyledOpacity = styled(TouchableOpacity);
const StyledImage = styled(Image);
const StyledIcon = styled(Ionicons);
const StyledColorPicker = styled(ColorPicker);

export default function Page() {
	let insets = useSafeAreaInsets();

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');

    const [icon, setIcon] = useState(null);
    const [iconcolor, setIconColor] = useState(null);
	const [bordercolor, setBorderColor] = useState(null);
	
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
						console.log('Icon');
						iconSelectorRef.current.toggleSelector(true);
						break;

					case 2:
						// Canceled
						break;
				}
			}
		);
	};

	const handleIconSelected = (icon, iconcolor) => {
		setIcon(icon);
		setIconColor(iconcolor);
		console.log(icon, iconcolor);
	}

	return (
		<>
			<StyledView
				className='bg-offblack flex-1 h-screen'
				style={{ paddingTop: Platform.OS == 'android' ? insets.top : 0 }}
			>
				<StyledView className='flex items-center justify-center text-center w-screen h-[170px]'>
					<StyledText className='text-offwhite font-bold text-4xl'>
						Form a Circle
					</StyledText>
					<StyledText className='text-offwhite font-bold text-2xl'>
						Select a Color and Icon! 
					</StyledText>
					<StyledText className='text-offwhite font-bold text-2'>
						To select an icon, click the circle below!
					</StyledText>
				</StyledView>
				<StyledView className='relative flex h-[40%] justify-center align-middle items-center content-center'>
					<StyledColorPicker
						className='w-[100%] self-center'
						sliderComponent={Slider}
						hideSliders={true}
						style={{flex: 1}}
						onColorChange={bordercolor => {
							setBorderColor(fromHsv(bordercolor));
						}}
					/>
					<StyledOpacity
						className='absolute h-[40%] aspect-square bg-offblack rounded-full items-center justify-center'
						onPress={() => {
							onPress();								
						}}
					>
						<StyledIcon
							name={icon}
							size={85}
							color={iconcolor}
						/>
					</StyledOpacity>
				</StyledView>
				<StyledView className='w-[80%] flex items-center justify-between self-center absolute bottom-[100px]'>
					<StyledInput
						className='bg-offblack text-[18px] flex-1 h-[42px] w-full text-offwhite border border-offwhite rounded-lg px-3 py-[5px] mr-1'
						placeholder={'Circle Name'}
						placeholderTextColor={'#ffffff66'}
						inputMode='text'
						maxLength={22}
						onChangeText={(text) => {
							setTitle(text);
						}}
						onBlur={() => {
							Keyboard.dismiss();
							this.circleDescription.focus();
						}}
						ref={(input) => {
							this.circleTitle = input;
						}}
					/>
					<StyledInput
						className='bg-offblack text-[18px] w-full h-auto text-offwhite border border-offwhite rounded-lg px-3 py-[10px] my-3'
						placeholder={'Write a bit about this Circle...'}
						placeholderTextColor={'#ffffff66'}
						inputMode='text'
						maxLength={300}
						multiline
						rows={3}
						onChangeText={(text) => {
							setDescription(text);
						}}
						onBlur={() => {
							Keyboard.dismiss();
						}}
						ref={(input) => {
							this.circleDescription = input;
						}}
					/>
				</StyledView>						
				<StyledView
					className='absolute flex flex-row w-screen px-[15px] justify-between bg-offblack pb-5'
					style={{ bottom: insets.bottom }}
				>						
					<Button
						title='Erase'
						width='w-[125px]'
						height='h-[60px]'
						href='/mainViewLayout'
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
						height='h-[60px]'
						width='w-[125px]'
						href='/mainViewLayout'
						press={async () => {
							if (title.length == 0) {
								alert('Please enter a title');
								return;
							}

							let data = {
								title: title,
								description: description,
								iconColor: iconcolor,
								icon: icon,
								timestamp: Date.now(),
								type: 'individual',
								color: bordercolor,
								members: {},
								admin: {},
								owner: false
							};
							createCircle(data);
							this.circleTitle.clear();
							this.circleDescription.clear();
							alert('Circle Successfully Created');
						}}
					/>
				</StyledView>
				<IconSelector
					onIconSelected={handleIconSelected}
					// close={updateIcon}
					ref={iconSelectorRef}
				/>
			</StyledView>
		</>		
	);
}