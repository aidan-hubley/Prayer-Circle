import React from 'react';
import { Stack } from 'expo-router';
import {
	Text,
	View,
	StatusBar,
	ScrollView,
	TouchableOpacity
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { styled } from 'nativewind';
import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from '../../backend/config';

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledScrollView = styled(ScrollView);
const StyledOpacity = styled(TouchableOpacity);

export default function JournalPage() {
	let insets = useSafeAreaInsets();
	return (
		<StyledView className='bg-offblack h-screen w-screen'>
			<StyledScrollView className='px-[15px]'>
				<StyledView
					className='w-screen'
					style={{ height: insets.top + 100 }}
				></StyledView>
				<StyledOpacity
					className='w-full max-w-[500px] items-center rounded-[20px] bg-grey mb-[20px]'
					onPress={() => {
						router.push({
							pathname: `/detailedJournal`,
							params: { title: 'Events' }
						});
					}}
				>
					<StyledText className='w-full text-3xl font-bold text-center text-offwhite pt-1'>
						Events
					</StyledText>
					<StyledView className='flex flex-col w-full justify-start items-center rounded-b-[20px] pt-[4px] pb-[10px]'>
						<StyledView className='w-[90%] flex flex-row justify-between'>
							<StyledView className=' flex flex-row'>
								<StyledView className=' items-center justify-center'>
									<Ionicons
										name={'calendar'}
										size={24}
										color='white'
									/>
								</StyledView>
								<StyledView className='ml-[8px]'>
									<StyledText className='font-bold text-[18px] text-white'>
										Event Title
									</StyledText>
									<StyledText className='text-white text-[12px]'>
										Person who posted
									</StyledText>
								</StyledView>
							</StyledView>
							<StyledView className=' flex flex-col items-end justify-center'>
								<StyledText className='font-[600] text-[18px] text-white'>
									Date
								</StyledText>
								<StyledText className='text-white text-right'>
									Time
								</StyledText>
							</StyledView>
						</StyledView>

						<StyledView className='w-[90%] border-t border-outline mt-[5px] mb-[3px]'></StyledView>

						<StyledView className='w-[90%] flex flex-row justify-between'>
							<StyledView className=' flex flex-row'>
								<StyledView className=' items-center justify-center'>
									<Ionicons
										name={'calendar'}
										size={24}
										color='white'
									/>
								</StyledView>
								<StyledView className='ml-[8px]'>
									<StyledText className='font-bold text-[18px] text-white'>
										Event Title
									</StyledText>
									<StyledText className='text-white text-[12px]'>
										Person who posted
									</StyledText>
								</StyledView>
							</StyledView>
							<StyledView className=' flex flex-col items-end justify-center'>
								<StyledText className='font-[600] text-[18px] text-white'>
									Date
								</StyledText>
								<StyledText className='text-white text-right'>
									Time
								</StyledText>
							</StyledView>
						</StyledView>
					</StyledView>

					{/* Copy lines 83-112 for every event saved to journal, either manually or with a repeating backend element*/}
				</StyledOpacity>
				<StyledOpacity
					className='w-full max-w-[500px] items-center rounded-[20px] bg-grey mb-[20px]'
					onPress={() => {
						router.push({
							pathname: `/detailedJournal`,
							params: { title: 'Prayer Requests' }
						});
					}}
				>
					<StyledText className='w-full text-3xl font-bold text-center text-offwhite pt-1'>
						Prayer Requests
					</StyledText>
					<StyledView className='flex flex-col w-full justify-start items-center rounded-b-[20px] pt-[4px] pb-[10px]'>
						<StyledView className='w-[90%] flex flex-row justify-between'>
							<StyledView className=' flex flex-row'>
								<StyledView className=' items-center justify-center'>
									<Ionicons
										name={'hand-left'}
										size={24}
										color='white'
									/>
								</StyledView>
								<StyledView className='ml-[8px]'>
									<StyledText className='font-bold text-[18px] text-white'>
										Prayer #1
									</StyledText>
									<StyledText className='text-white text-[12px]'>
										Person who posted
									</StyledText>
								</StyledView>
							</StyledView>
							<StyledView className=' flex flex-col items-end justify-center'>
								<StyledText className='text-[13px] text-white'>
									17h
								</StyledText>
							</StyledView>
						</StyledView>

						<StyledView className='w-[90%] border-t border-outline mt-[5px] mb-[3px]'></StyledView>

						<StyledView className='w-[90%] flex flex-row justify-between'>
							<StyledView className=' flex flex-row'>
								<StyledView className=' items-center justify-center'>
									<Ionicons
										name={'hand-left'}
										size={24}
										color='white'
									/>
								</StyledView>
								<StyledView className='ml-[8px]'>
									<StyledText className='font-bold text-[18px] text-white'>
										Request #2
									</StyledText>
									<StyledText className='text-white text-[12px]'>
										Person who posted
									</StyledText>
								</StyledView>
							</StyledView>
							<StyledView className=' flex flex-col items-end justify-center'>
								<StyledText className='text-[13px] text-white'>
									17h
								</StyledText>
							</StyledView>
						</StyledView>
					</StyledView>
				</StyledOpacity>

				<StyledOpacity
					className='w-full max-w-[500px] items-center rounded-[20px] bg-grey mb-[20px]'
					onPress={() => {
						router.push({
							pathname: `/detailedJournal`,
							params: { title: 'Praise' }
						});
					}}
				>
					<StyledText className='w-full text-3xl font-bold text-center text-offwhite pt-1'>
						Praise
					</StyledText>
					<StyledView className='flex flex-col w-full justify-start items-center rounded-b-[20px] pt-[4px] pb-[10px]'>
						<StyledView className='w-[90%] flex flex-row justify-between'>
							<StyledView className=' flex flex-row'>
								<StyledView className=' items-center justify-center'>
									<Ionicons
										name={'megaphone'}
										size={24}
										color='white'
									/>
								</StyledView>
								<StyledView className='ml-[8px]'>
									<StyledText className='font-bold text-[18px] text-white'>
										Praise #1
									</StyledText>
									<StyledText className='text-white text-[12px]'>
										Person who posted
									</StyledText>
								</StyledView>
							</StyledView>
							<StyledView className=' flex flex-col items-end justify-center'>
								<StyledText className='text-[13px] text-white'>
									17h
								</StyledText>
							</StyledView>
						</StyledView>

						<StyledView className='w-[90%] border-t border-outline mt-[5px] mb-[3px]'></StyledView>

						<StyledView className='w-[90%] flex flex-row justify-between'>
							<StyledView className=' flex flex-row'>
								<StyledView className=' items-center justify-center'>
									<Ionicons
										name={'megaphone'}
										size={24}
										color='white'
									/>
								</StyledView>
								<StyledView className='ml-[8px]'>
									<StyledText className='font-bold text-[18px] text-white'>
										Praise #2
									</StyledText>
									<StyledText className='text-white text-[12px]'>
										Person who posted
									</StyledText>
								</StyledView>
							</StyledView>
							<StyledView className=' flex flex-col items-end justify-center'>
								<StyledText className='text-[13px] text-white'>
									17h
								</StyledText>
							</StyledView>
						</StyledView>

						<StyledView className='w-[90%] border-t border-outline mt-[5px] mb-[3px]'></StyledView>

						<StyledView className='w-[90%] flex flex-row justify-between'>
							<StyledView className=' flex flex-row'>
								<StyledView className=' items-center justify-center'>
									<Ionicons
										name={'megaphone'}
										size={24}
										color='white'
									/>
								</StyledView>
								<StyledView className='ml-[8px]'>
									<StyledText className='font-bold text-[18px] text-white'>
										Praise #3
									</StyledText>
									<StyledText className='text-white text-[12px]'>
										Person who posted
									</StyledText>
								</StyledView>
							</StyledView>
							<StyledView className=' flex flex-col items-end justify-center'>
								<StyledText className='text-[13px] text-white'>
									17h
								</StyledText>
							</StyledView>
						</StyledView>
					</StyledView>
				</StyledOpacity>
			</StyledScrollView>
		</StyledView>
	);
}
