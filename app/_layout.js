import { Stack } from 'expo-router';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';

export default function Layout() {
	return (
		<BottomSheetModalProvider>
			<Stack
				screenOptions={{
					headerShown: false
				}}
			></Stack>
		</BottomSheetModalProvider>
	);
}
