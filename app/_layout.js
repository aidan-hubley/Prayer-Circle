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
			>
				<Stack.Screen
					name='(settings)/circleSettings'
					options={{ presentation: 'modal' }}
				/>
				<Stack.Screen
					name='(settings)/shareCircle'
					options={{ presentation: 'modal' }}
				/>
			</Stack>
		</ActionSheetProvider>
	);
}
