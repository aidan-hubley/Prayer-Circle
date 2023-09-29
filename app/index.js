import React from 'react';
import { SafeAreaView, Text, View, StatusBar } from 'react-native';
import { styled } from 'nativewind';
import { PostTypeSelector } from '../components/PostTypeSelector';
import { signOut } from 'firebase/auth';
import { auth, router } from '../backend/config';
import { userLoggedIn } from '../backend/firebaseFunctions';
import AsyncStorage from '@react-native-async-storage/async-storage';

const StyledSafeArea = styled(SafeAreaView);
const StyledView = styled(View);
const StyledText = styled(Text);

export default function Page() {
	userLoggedIn();

	/* AsyncStorage.getItem("user").then((user) => {
		if (!user || user.length == 0) router.push("/login");
		else router.push("/feed");
	}); */
	return (
		<StyledSafeArea className='bg-offblack border' style={{ flex: 1 }}>
			<StyledView className='flex-1 items-center mt-20 pt-10'>
				<PostTypeSelector></PostTypeSelector>
			</StyledView>
		</StyledSafeArea>
	);
}
