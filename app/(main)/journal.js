import React from 'react';
import { Stack } from 'expo-router';
import { SafeAreaView, Text, View, StatusBar } from 'react-native';
import { styled } from 'nativewind';
import Ionicons from '@expo/vector-icons/Ionicons';
import Icon from 'react-native-ionicons'
import { Button } from '../../components/Buttons';

const StyledView = styled(View);
const StyledText = styled(Text);

// import {
// 	SafeAreaView,
// 	SafeAreaProvider,
// 	SafeAreaInsetsContext,
// 	useSafeAreaInsets,
//   } from 'react-native-safe-area-context'; //Won't necessarilly need all of these

  const StyledSafeArea = styled(SafeAreaView);

export default function Page() {
	return (
		<>
			<Stack.Screen></Stack.Screen>
			<StyledSafeArea className='bg-offblack border' style={{ flex: 1 }}>
				<StyledView className='flex flex-col items-center pt-[200px]'>{/*change pt for top border*/}
					{/* <StyledView className='flex flex-col items-center justify-center w-full pb-[10px]'>
						<StyledText className="text-3xl text-white text-center tracking-widest leading-10">
							Praises
						</StyledText>
						{/* <Button
							title='2'
							width='w-[125px]'
							href='feed'
							// press={() => {
							// 	this.postTitle.clear();
							// 	this.postDescription.clear();
							// }}
						/> */}
					{/*</StyledView> */}
				</StyledView>
				<StyledView className='w-full max-w-[500px] items-center'>
					<StyledView className='flex flex-col justify-start items-center bg-grey rounded-t-[20px] h-auto  pt-[10px]'>
						<StyledView className='w-full flex flex-row px-[10px]'>
							<StyledView className=' w-[95%] ml-2'>
								<StyledText className='text-white text-center'>
									<StyledView className='ml-2 text-center'>
										<StyledText className='text-3xl text-white text-center tracking-widest leading-10'>
											Events
										</StyledText>
									</StyledView>
								</StyledText>
							</StyledView>
						</StyledView>
					</StyledView>
					<StyledView className='flex flex-col justify-start items-center bg-grey rounded-b-[20px] h-auto  py-[10px] mb-[10px]'>
						<StyledView className='w-full flex flex-row px-[10px]'>
							<StyledView className=' w-[7%] ml-2 items-center pt-[8px]'>
								<Ionicons
									// src={'./assets/calendar-clear-outline'}
									name={'calendar'}
									size={29}
									color='white'
								/>
							</StyledView>
							<StyledView className=' w-[70%] ml-2'>
								<StyledText className='font-[600] text-xl text-white'>
									Event Title
								</StyledText>
								<StyledText className='text-white'>
									Person who posted
								</StyledText>
							</StyledView>
							<StyledView className=' flex flex-col w-[15.5%] items-center justify-between'>
								<StyledText className='font-[600] text-xl text-white'>
									Date
								</StyledText>
								<StyledText className='text-white'>
									Time
								</StyledText>
							</StyledView>
						</StyledView>
						<StyledView className='w-full flex flex-row px-[10px]'>
							<StyledView className='my-[10px] items-center h-[2px] bg-outline w-[97%]'></StyledView>
						</StyledView>
						<StyledView className='w-full flex flex-row px-[10px]'>
							<StyledView className=' w-[7%] ml-2 items-center pt-[8px]'>
								<Ionicons
									// src={'./assets/calendar-clear-outline'}
									name={'calendar'}
									size={29}
									color='white'
								/>
							</StyledView>
							<StyledView className=' w-[70%] ml-2'>
								<StyledText className='font-[600] text-xl text-white'>
									Event Title
								</StyledText>
								<StyledText className='text-white'>
									Person who posted
								</StyledText>
							</StyledView>
							<StyledView className=' flex flex-col w-[15.5%] items-center justify-between'>
								<StyledText className='font-[600] text-xl text-white'>
									Date
								</StyledText>
								<StyledText className='text-white'>
									Time
								</StyledText>
							</StyledView>
						</StyledView>
					</StyledView>
					
					{/* Copy lines 83-112 for every event saved to journal, either manually or with a repeating backend element*/}
				</StyledView>
				
				<StyledView className='w-full max-w-[500px] items-center'>
					<StyledView className='flex flex-col justify-start items-center bg-grey rounded-t-[20px] h-auto  pt-[10px]'>
						<StyledView className='w-full flex flex-row px-[10px]'>
							<StyledView className=' w-[95%] ml-2'>
								<StyledText className='text-white text-center'>
									<StyledView className='ml-2 text-center'>
										<StyledText className='text-3xl text-white text-center tracking-widest leading-10'>
											Prayer Requests
										</StyledText>
									</StyledView>
								</StyledText>
							</StyledView>
						</StyledView>
					</StyledView>
					<StyledView className='flex flex-col justify-start items-center bg-grey rounded-b-[20px] h-auto  py-[10px] mb-[10px]'>
						<StyledView className='w-full flex flex-row px-[10px]'>
							<StyledView className=' w-[7%] ml-2 items-center pt-[8px]'>
								<Ionicons
									name={'hand-right'}
									size={29}
									color='white'
								/>
							</StyledView>
							<StyledView className=' w-[70%] ml-2'>
								<StyledText className='font-[600] text-xl text-white'>
									Pray For My Dog
								</StyledText>
								<StyledText className='text-white'>
									Justin Davis
								</StyledText>
							</StyledView>
							<StyledView className=' flex flex-col w-[15.5%] items-center justify-between'>
								<StyledText className='font-[400] text-white'>
									17h
								</StyledText>
								<StyledText className='text-white'>
									
								</StyledText>
							</StyledView>
						</StyledView>
					</StyledView>
				</StyledView>

				<StyledView className='w-full max-w-[500px] items-center pb-[50px]'>
					<StyledView className='flex flex-col justify-start items-center bg-grey rounded-t-[20px] h-auto  pt-[10px]'>
						<StyledView className='w-full flex flex-row px-[10px]'>
							<StyledView className=' w-[95%] ml-2'>
								<StyledText className='text-white text-center'>
									<StyledView className='ml-2 text-center'>
										<StyledText className='text-3xl text-white text-center tracking-widest leading-10'>
											Praises
										</StyledText>
									</StyledView>
								</StyledText>
							</StyledView>
						</StyledView>
					</StyledView>
					<StyledView className='flex flex-col justify-start items-center bg-grey rounded-b-[20px] h-auto  py-[10px] mb-[10px]'>
						<StyledView className='w-full flex flex-row px-[10px]'>
							<StyledView className=' w-[7%] ml-2 items-center pt-[8px]'>
								<Ionicons
									name={'megaphone'}
									size={29}
									color='white'
								/>
							</StyledView>
							<StyledView className=' w-[70%] ml-2'>
								<StyledText className='font-[600] text-xl text-white'>
									New Car
								</StyledText>
								<StyledText className='text-white'>
									Justin Davis
								</StyledText>
							</StyledView>
							<StyledView className=' flex flex-col w-[15.5%] items-center justify-between'>
								<StyledText className='font-[400] text-white'>
									17h
								</StyledText>
								<StyledText className='text-white'>
									
								</StyledText>
							</StyledView>
						</StyledView>
					</StyledView>
				</StyledView>

			</StyledSafeArea>
		</>
	);
}