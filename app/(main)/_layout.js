import { Stack } from 'expo-router/stack';
import React, { useRef } from 'react';
import { SafeAreaView, View } from 'react-native';
import { styled } from 'nativewind';
import { ExpandableButton } from '../../components/Buttons';
import { ActionSheetProvider } from '@expo/react-native-action-sheet';
import * as Device from 'expo-device';

const StyledSafeArea = styled(SafeAreaView);
const StyledView = styled(View);

export default function Layout() {
	const profileRef = useRef();
	const journalRef = useRef();

	let ExtraSafeArea =
		Device.brand === 'Apple' &&
		(Device.modelName.split(' ')[1] == 'X' ||
			Device.modelName.split(' ')[1] >= 11);

	return (
		<ActionSheetProvider>
			<StyledSafeArea className='flex-1'>
				<StyledView className='absolute top-0 w-screen h-screen'>
					<Stack
						screenOptions={{
							headerShown: false
						}}
					/>
				</StyledView>
				<StyledView className=' w-screen flex flex-row justify-between items-center px-[20px] pt-[5px]'>
					<ExpandableButton
						pointerEvents='auto'
						btnStyles={`${ExtraSafeArea ? '' : 'top-[5px]'}`}
						height={'h-[50px]'}
						iconSize={35}
						icon='journal-outline'
						expanded={false}
						expandedWidth={'70%'}
						collapsedWidth={50}
						title='Journal'
						href='/journal'
						expandedHref='/feed'
						ref={journalRef}
						press={() => {
							if (profileRef.current.pressed)
								profileRef.current.toggleButton();
						}}
					/>
					<ExpandableButton
						btnStyles={`${ExtraSafeArea ? '' : 'top-[5px]'}`}
						height={'h-[50px]'}
						iconSize={40}
						icon='person-circle-outline'
						expanded={false}
						expandedWidth={'70%'}
						collapsedWidth={50}
						title='Profile'
						href='/profile'
						expandedHref='/feed'
						ref={profileRef}
						press={() => {
							if (journalRef.current.pressed)
								journalRef.current.toggleButton();
						}}
					/>
				</StyledView>
			</StyledSafeArea>
		</ActionSheetProvider>
	);
}
