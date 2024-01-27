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
import { router } from '../../backend/config';
import { useStore } from '../global';

const StyledSafeArea = styled(SafeAreaView);
const StyledView = styled(View);
const StyledText = styled(Text);
const StyledInput = styled(TextInput);
const StyledOpacity = styled(TouchableOpacity);
const StyledIcon = styled(Ionicons);
const StyledColorPicker = styled(ColorPicker);

export default function Page() {
	let insets = useSafeAreaInsets();

	const [title, setTitle] = useState('');
	const [description, setDescription] = useState('');

	const [icon, setIcon] = useState(null);
	const [iconColor, setIconColor] = useState(null);

	const setFilterReload = useStore((state) => state.setFilterReload);

	const iconSelectorRef = useRef();
	const circleColorRef = useRef();

	const handleIconSelected = (icon, iconColor) => {
		setIcon(icon);
		setIconColor(iconColor);
	};

	return (
		<StyledSafeArea className="bg-offblack flex-1">
			<KeyboardAwareScrollView bounces={false}>
				<StyledView className="bg-offblack flex-1 flex flex-col items-center">
					<StyledView className="flex items-center justify-center text-center w-screen">
						<StyledText className="text-offwhite font-bold text-4xl">
							Form a Circle
						</StyledText>
						<StyledText className="text-offwhite text-2xl">
							Select a Color and Icon!
						</StyledText>
						<StyledText className="text-offwhite text-[15px]">
							To select an icon, click the circle below!
						</StyledText>
					</StyledView>
					<StyledView className="relative  flex w-screen aspect-square justify-center items-center mt-4 mb-2">
						<StyledColorPicker
							className="w-[100%]"
							ref={circleColorRef}
							sliderComponent={Slider}
							hideSliders={true}
							style={{ flex: 1 }}
						/>
						<StyledOpacity
							className="absolute h-[40%] aspect-square bg-offblack rounded-full items-center justify-center"
							onPress={() => {
								iconSelectorRef.current.toggleSelector(true);
							}}
						>
							<StyledIcon
								name={icon}
								size={85}
								color={iconColor}
							/>
						</StyledOpacity>
					</StyledView>
					<StyledView className="w-full h-auto flex items-center justify-between px-[15px]">
						<StyledInput
							className="bg-offblack text-[18px] h-[42px] w-full text-offwhite border border-offwhite rounded-lg px-3 py-[5px]"
							placeholder={'Circle Name'}
							placeholderTextColor={'#ffffff66'}
							inputMode="text"
							maxLength={22}
							onChangeText={(text) => {
								setTitle(text);
							}}
							onBlur={() => {
								Keyboard.dismiss();
							}}
							ref={(input) => {
								this.circleTitle = input;
							}}
						/>
						<StyledInput
							className="bg-offblack text-[18px] w-full h-[42px] text-offwhite border border-offwhite rounded-lg px-3 py-[10px] my-3"
							placeholder={'Write a bit about this Circle...'}
							placeholderTextColor={'#ffffff66'}
							inputMode="text"
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
				</StyledView>
			</KeyboardAwareScrollView>
			<StyledView
				className="absolute flex flex-row w-screen px-[15px] justify-between bg-offblack pb-5"
				style={{ bottom: insets.bottom }}
			>
				<Button
					title="Erase"
					width="w-[125px]"
					height="h-[60px]"
					href="/mainViewLayout"
					bgColor={'bg-offblack'}
					borderColor={'border-offwhite border-2'}
					textColor={'text-offwhite'}
					press={() => {
						this.circleTitle.clear();
						this.circleDescription.clear();
					}}
				/>
				<Button
					title="Draw"
					height="h-[60px]"
					width="w-[125px]"
					press={async () => {
						if (title.length == 0) {
							alert('Please enter a title');
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
						await createCircle(data);
						this.circleTitle.clear();
						this.circleDescription.clear();
						alert('Circle Successfully Created');
						setFilterReload(true);

						router.push('/mainViewLayout');
					}}
				/>
			</StyledView>
			<IconSelector
				onIconSelected={handleIconSelected}
				ref={iconSelectorRef}
			/>
		</StyledSafeArea>
	);
}
