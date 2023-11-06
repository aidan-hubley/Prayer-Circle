import React, { useState, useRef } from 'react';
import {
	SafeAreaView,
	Text,
	View,
	TextInput,
	TouchableOpacity,
	Image
} from 'react-native';
import { styled } from 'nativewind';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Button } from '../../components/Buttons';
import { useActionSheet } from '@expo/react-native-action-sheet';
import { IconSelector } from '../../components/iconSelector';
import Ionicons from '@expo/vector-icons/Ionicons';
import { createCircle } from '../../backend/firebaseFunctions';
import { ColorPicker } from 'react-native-color-picker'
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
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');

    const [circleIcon, setCircleIcon] = useState(null);
    const [circleColor, setCircleColor] = useState(null);

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

	function updateIcon() {
        const selectedIcon = iconSelectorRef.current.getSelectedIcon();
        const selectedColor = iconSelectorRef.current.getSelectedColor();
        if (selectedIcon) {
            setCircleIcon(selectedIcon);
            setCircleColor(selectedColor);
        }
    }

	return (
		<StyledSafeArea className='bg-offblack flex-1'>
			<>
				{/* <KeyboardAwareScrollView bounces={false}> */}
					<>
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
					<StyledView className='bottom-[10%] items-center h-screen w-screen'>
						<StyledColorPicker
							className='w-full h-[400px]'
							sliderComponent={Slider}
							hideSliders={true}
							onColorSelected={color => alert(`Color selected: ${color}`)}
							style={{flex: 1}}
						/>
						<StyledOpacity
							className='relative bottom-[50%] w-[167px] h-[167px] items-center justify-center bg-offblack rounded-full'
							onPress={() => {
								onPress();
								// updateIcon();
							}}
						>
							<StyledIcon
								name={circleIcon}
								size={80}
								color={circleColor}
							/>
						</StyledOpacity>
					</StyledView>
							{/* <StyledView className='w-full flex flex-row items-center justify-between'>
								<StyledInput
									className='bg-offblack text-[18px] flex-1 h-[42px] text-offwhite border border-outline rounded-lg px-3 py-[5px] mr-1'
									placeholder={'Circle Name'}
									placeholderTextColor={'#ffffff66'}
									inputMode='text'
									maxLength={22}
									onChangeText={(text) => {
										setTitle(text);
									}}
									onBlur={() => {
										this.circleDescription.focus();
									}}
									ref={(input) => {
										this.circleTitle = input;
									}}
								/>
							</StyledView>
							<StyledInput
								className='bg-offblack text-[18px] w-full h-auto text-offwhite border border-outline rounded-lg px-3 py-[10px] my-3'
								placeholder={'Write a bit about this Circle...'}
								placeholderTextColor={'#ffffff66'}
								inputMode='text'
								maxLength={300}
								multiline
								rows={3}
								onChangeText={(text) => {
									setDescription(text);
								}}
								ref={(input) => {
									this.circleDescription = input;
								}}
							/> */}
					</>
				{/* </KeyboardAwareScrollView> */}
				<StyledView className='absolute w-screen bottom-10 flex flex-row justify-between px-[15px] mt-auto'>
					<Button
						title='Erase'
						width='w-[125px]'
						height='h-[60px]'
						href='/mainViewLayout'
						bgColor={'bg-offblack'}
						borderColor={'border-offwhite border-2'}
						textColor={'text-offwhite'}
						// press={() => {
						// 	this.circleTitle.clear();
						// 	this.circleDescription.clear();
						// }}
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
								iconColor: `#fff`,
								icon: circleIcon,
								timestamp: Date.now(),
								type: 'individual',
								color: '#5946B2',
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
					close={updateIcon}
					ref={iconSelectorRef}
				/>
			</>
		</StyledSafeArea>
	);
}
