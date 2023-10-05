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
			<Stack
				screenOptions={{
					headerShown: false
				}}
			/>
		</ActionSheetProvider>
	);
}
