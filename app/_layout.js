import { Stack } from 'expo-router/stack';
import React from 'react';

import { ActionSheetProvider } from '@expo/react-native-action-sheet';

export default function Layout() {
	return (
		<ActionSheetProvider>
			<Stack
				screenOptions={{
					headerShown: false
				}}
			></Stack>
		</ActionSheetProvider>
	);
}
