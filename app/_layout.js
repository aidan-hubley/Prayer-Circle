import { Stack } from 'expo-router/stack';
import React, { useRef } from 'react';
import { View } from 'react-native';
import { styled } from 'nativewind';
import { ExpandableButton } from '../components/Buttons';
import { ActionSheetProvider } from '@expo/react-native-action-sheet';

const StyledView = styled(View);

export default function Layout() {
	const profileRef = useRef();
	const journalRef = useRef();

	return (
		<ActionSheetProvider>
			<>
				<Stack
					screenOptions={{
						headerShown: false
					}}
				>
					<Stack.Screen name='login' />
				</Stack>

				{/* <ExpandableButton
					btnStyles='absolute top-20 left-5'
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
					btnStyles='absolute top-20 right-5'
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
				/> */}
			</>
		</ActionSheetProvider>
	);
}
