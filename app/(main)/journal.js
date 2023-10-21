import React from 'react';
import { Stack } from 'expo-router';
import { SafeAreaView, Text, View, StatusBar } from 'react-native';
import { styled } from 'nativewind';
import { Button } from '../../components/Buttons';
import { router } from '../../backend/config';

const StyledSafeArea = styled(SafeAreaView);
const StyledView = styled(View);
const StyledText = styled(Text);

export default function Page() {
	return (
		<>
			<Stack.Screen></Stack.Screen>
			<StyledSafeArea className='bg-offblack border' style={{ flex: 1 }}>
				<StyledView className='flex-1 items-center mt-20 pt-10'>
					<StyledText className='text-3xl text-white text-center tracking-widest leading-10'>
						Journal
					</StyledText>
					<Button
						title='Prayer Requests'
						press={() => {
							router.push({
								pathname: `/detailedJournal`,
								params: { title: 'Prayer Requests' }
							});
						}}
					></Button>
					<Button
						title='Events'
						press={() => {
							router.push({
								pathname: `/detailedJournal`,
								params: { title: 'Events' }
							});
						}}
					></Button>
					<Button
						title='Praise'
						press={() => {
							router.push({
								pathname: `/detailedJournal`,
								params: { title: 'Praises' }
							});
						}}
					></Button>
				</StyledView>
				<StatusBar style='light-content' />
			</StyledSafeArea>
		</>
	);
}
