import { Stack } from 'expo-router/stack';
import React, { useRef } from 'react';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { styled } from 'nativewind';
import { ExpandableButton, Button } from '../../components/Buttons';
import { ActionSheetProvider } from '@expo/react-native-action-sheet';
import * as Device from 'expo-device';

const StyledView = styled(View);

export default function Layout() {
	const profileRef = useRef();
	const journalRef = useRef();
	let insets = useSafeAreaInsets();
	let topButtonInset = insets.top > 30 ? insets.top : insets.top + 10;
	return (
		<ActionSheetProvider>
			<>
				<Stack
					screenOptions={{
						headerShown: false
					}}
				/>
				<StyledView
					style={{ top: topButtonInset }}
					className={`w-screen absolute flex flex-row justify-between items-center px-[20px]`}
				>
					<ExpandableButton
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
					{/* if in filtered feed */}
						<StyledView className='items-center'>
							<Button
								btnStyles='w-[200px] w-min-[175px] w-max-[225px]'
								height={'h-[50px]'}					
								title='Circle Name'
								href='/circleSettings'
							/>
						</StyledView>
					{/* end if */}
					<ExpandableButton
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
			</>
		</ActionSheetProvider>
	);
}
