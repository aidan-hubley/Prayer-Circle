import { Stack } from 'expo-router/stack';
import React, { useRef } from 'react';
import { SafeAreaView } from 'react-native';
import { styled } from 'nativewind';
import { ExpandableButton } from '../../components/Buttons';
import { ActionSheetProvider } from '@expo/react-native-action-sheet';

const StyledSafeArea = styled(SafeAreaView);

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
				/>

				<ExpandableButton
					btnStyles='absolute top-[7%] left-5'
					height={'h-[60px]'}
					iconSize={40}
					icon='journal-outline'
					expanded={false}
					expandedWidth={'70%'}
					collapsedWidth={60}
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
					btnStyles='absolute top-[7%] right-5'
					height={'h-[60px]'}
					iconSize={45}
					icon='person-circle-outline'
					expanded={false}
					expandedWidth={'70%'}
					collapsedWidth={60}
					title='Profile'
					href='/profile'
					expandedHref='/feed'
					ref={profileRef}
					press={() => {
						if (journalRef.current.pressed)
							journalRef.current.toggleButton();
					}}
				/>
			</>
		</ActionSheetProvider>
	);
}
