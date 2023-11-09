import { Stack } from 'expo-router/stack';
import React from 'react';

export default function Layout() {
	return (
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
	);
}
