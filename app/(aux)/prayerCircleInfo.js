import React, { useState, useRef, useMemo, useCallback } from 'react';
import { Text, View, Platform, Image, Animated, ScrollView, Pressable} from 'react-native';
import { styled } from 'nativewind';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button } from '../../components/Buttons';
import { LinearGradient } from 'expo-linear-gradient';
import { BottomSheetModal, BottomSheetFlatList, BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { handle, backdrop, SnapPoints } from '../../components/BottomSheetModalHelpers.js';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Terms } from '../../components/Terms';
import { router } from 'expo-router';

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledImage = styled(Image);
const StyledIcon = styled(Ionicons);
const StyledSafeArea = styled(SafeAreaView);
const StyledScrollView = styled(ScrollView);
const StyledGradient = styled(LinearGradient);
const StyledPressable = styled(Pressable);

export default function Page() {
	const [handles, setHandles] = useState('');
	const [snapPoints, setSnapPoints] = useState([]);
	const [modalContent, setModalContent] = useState(null);
	const bottomSheetModalRef = useRef(null);

	let insets = useSafeAreaInsets();

	// bottom sheet modal
	const handlePresentModalPress = useCallback(() => {
		bottomSheetModalRef.current?.present();
	}, []);

	const handleModalPress = (
		modalContent,
		snapPoints,
		handleText,
		handleColor,
		extra = () => {}
	) => {
		extra();
		setModalContent(modalContent);
		setSnapPoints(snapPoints);
		setHandles(handle(handleText, handleColor));
		bottomSheetModalRef.current?.present();
	};

	const renderContent = () => {
		switch (modalContent) {
			case 'tos':
				return (
					<StyledView className='w-[90%] flex-1'>
						<BottomSheetFlatList
							data={[{ key: 'terms' }]}
							renderItem={({ item }) => <Terms />}
							keyExtractor={(item) => item.key}
							showsVerticalScrollIndicator={false}
						/>
					</StyledView>
				);
			default:
				return (
					<></>
				)			
		}
	};

	return (
		<StyledSafeArea className='bg-offblack border' style={{ flex: 1 }}>
			<StyledView className='flex-1 items-center'>
				<ScrollView>
					<StyledView className='w-full flex items-center'>
						<StyledView
							className='w-full flex items-center mb-[10px]'
							style={{
								height: 30
							}}
						/>
						<StyledPressable 							
							onPress={() => (router.push('http://prayer-circle.com'))}
						>
							<StyledImage
								style={{ width: 300, height: 300 }}
								source={require('../../assets/Dark_Margin.png')}								
							/>
						</StyledPressable>

						<StyledText className='w-full text-center text-[30px] text-offwhite'>
							Our Mission
						</StyledText>
						<StyledView className='w-[95%] bg-grey border border-[#6666660D] rounded-[20px] p-[10px] my-2'>
							<StyledText className='text-white text-center text-[20px]'>
							Unite people of the Christian faith by fostering 
							meaningful interactions and opportunities for prayer. 
							</StyledText>
							<StyledText className='pt-2 text-white text-center text-[20px]'>
							We aim to create a safe and private space for discussion,
							emphasizing the importance of community in spiritual growth.
							</StyledText>
						</StyledView>

						<StyledText className='w-full text-center text-[30px] text-offwhite mt-4'>
							Send Feedback
						</StyledText>
						<StyledView className='w-[95%] bg-grey border border-[#6666660D] rounded-[20px] p-[10px] my-2'>
							<StyledView className='flex w-full gap-y-3 pb-2'>
								
								<StyledView className='flex flex-row w-full h-[35px]'>									
									<StyledView className='pl-2 top-[5px]'>
										<StyledText className={`font-[600] text-offwhite text-[20px]`}>
											Beta Test Review
										</StyledText>
									</StyledView>								
									<StyledPressable 
										className='w-[65px] h-[35px] bg-transparent border-offwhite border rounded-[20px] absolute right-2 top-[5px] justify-center items-center'
										onPress={() => ('/')}
									>	
										<StyledImage
											className='w-[18px] h-[24px]'
											source={require('../../assets/logos/googleForm.png')}
										/>
									</StyledPressable>
								</StyledView>

								<StyledView className='flex flex-row w-full h-[35px]'>									
									<StyledView className='pl-2 top-[5px]'>
										<StyledText className={`font-[600] text-offwhite text-[20px]`}>
											Rate the App
										</StyledText>
									</StyledView>								
									<Button
										icon={Platform.OS == 'android' ? 'logo-google-playstore' : 'logo-apple-appstore'}
										iconColor={'#4285F4'}
										iconSize={26}
										width={'w-[65px]'}
										height={'h-[35px]'}
										bgColor={'bg-transparent'}
										borderColor={'border-offwhite'}										
										btnStyles='border absolute right-2 top-[5px]'
										href={'/'}
									></Button>
								</StyledView>

								<StyledView className='flex flex-row w-full h-[35px]'>									
									<StyledView className='pl-2 top-[5px]'>
										<StyledText className={`font-[600] text-offwhite text-[20px]`}>
											Report a Bug
										</StyledText>
									</StyledView>								
									<Button
										icon='bug'
										iconColor={'#00A55E'}
										iconSize={26}
										width={'w-[65px]'}
										height={'h-[35px]'}
										bgColor={'bg-transparent'}
										borderColor={'border-offwhite'}										
										btnStyles='border absolute right-2 top-[5px]'
										href={'/'}
									></Button>
								</StyledView>

							</StyledView>
							
						</StyledView>

						<StyledText className='w-full text-center text-[30px] text-offwhite mt-4'>
							Connect with Us
						</StyledText>
						<StyledView className='w-[95%] bg-grey border border-[#6666660D] rounded-[20px] p-[10px] my-2'>
							<StyledView className='flex w-full gap-y-3 pb-2'>
								
								<StyledView className='flex flex-row w-full h-[35px]'>									
									<StyledView className='pl-2 top-[5px]'>
										<StyledText className={`font-[600] text-offwhite text-[20px]`}>
											Instagram
										</StyledText>
									</StyledView>								
									<Button
										icon={'logo-instagram'}
										iconColor={'#FFFBFC'}
										iconSize={26}
										width={'w-[65px]'}
										height={'h-[35px]'}
										bgColor={'bg-transparent'}
										borderColor={'border-offwhite'}										
										btnStyles='border absolute right-2 top-[5px]'
										href={'/'}
									></Button>
								</StyledView>

								<StyledView className='flex flex-row w-full h-[35px]'>									
									<StyledView className='pl-2 top-[5px]'>
										<StyledText className={`font-[600] text-offwhite text-[20px]`}>
											Visit the Site
										</StyledText>
									</StyledView>								
									<Button
										icon={'globe-outline'}
										iconColor={'#FFFBFC'}
										iconSize={26}
										width={'w-[65px]'}
										height={'h-[35px]'}
										bgColor={'bg-transparent'}
										borderColor={'border-offwhite'}										
										btnStyles='border absolute right-2 top-[5px]'
										href={'http://prayer-circle.com'}
									></Button>
								</StyledView>

								<StyledView className='flex flex-row w-full h-[35px]'>									
									<StyledView className='pl-2 top-[5px]'>
										<StyledText className={`font-[600] text-offwhite text-[20px]`}>
											Email our Team
										</StyledText>
									</StyledView>								
									<Button
										icon='mail'
										iconColor={'#FFFBFC'}
										iconSize={26}
										width={'w-[65px]'}
										height={'h-[35px]'}
										bgColor={'bg-transparent'}
										borderColor={'border-offwhite'}										
										btnStyles='border absolute right-2 top-[5px]'
										href={'/'}
									></Button>
								</StyledView>

							</StyledView>
							
						</StyledView>

						<StyledText className='w-full text-center text-[30px] text-offwhite mt-4'>
							Our Team
						</StyledText>
						<StyledView className='w-[95%] bg-grey border border-[#6666660D] rounded-[20px] p-[10px] my-2'>
							<StyledView className='flex w-full gap-y-3'>
							
								<StyledView className='flex flex-row w-full'>									
									<StyledImage
										className='rounded-xl'
										style={{ width: 60, height: 60 }}
										source={require('../../assets/devs/aidan.jpg')}
									/>
									<StyledView className='pl-2 bottom-[3px]'>
										<StyledText
											className={`font-[600] text-offwhite text-[20px]`}
										>
											Aidan Hubley
										</StyledText>
										<StyledText className={`text-offwhite text-[14px]`}>
											Team Lead
										</StyledText>
									</StyledView>								
									<Button
										icon='logo-linkedin'
										iconColor={'#FFFBFC'}
										iconSize={26}
										width={'w-[65px]'}
										height={'h-[35px]'}
										bgColor={'bg-transparent'}			
										borderColor={'border-offwhite'}																	
										btnStyles='border absolute right-2 top-[5px]'
										href={'https://www.linkedin.com/in/aidan-hubley-24228322b/'}
									></Button>
								</StyledView>

								<StyledView className='flex flex-row w-full'>									
									<StyledImage
										className='rounded-xl'
										style={{ width: 60, height: 60 }}
										source={require('../../assets/devs/alex.jpg')}
									/>
									<StyledView className='pl-2 bottom-[3px]'>
										<StyledText
											className={`font-[600] text-offwhite text-[20px]`}
										>
											Alex Muresan
										</StyledText>
										<StyledText className={`text-offwhite text-[14px]`}>
											Database Manager
										</StyledText>
									</StyledView>								
									<Button
										icon='logo-linkedin'
										iconColor={'#FFFBFC'}
										iconSize={26}
										width={'w-[65px]'}
										height={'h-[35px]'}
										bgColor={'bg-transparent'}	
										borderColor={'border-offwhite'}																			
										btnStyles='border absolute right-2 top-[5px]'
										href={'https://www.linkedin.com/in/amuresan5833/'}
									></Button>
								</StyledView>

								
								<StyledView className='flex flex-row w-full'>									
									<StyledImage
										className='rounded-xl'
										style={{ width: 60, height: 60 }}
										source={require('../../assets/devs/nason.jpg')}
									/>
									<StyledView className='pl-2 bottom-[3px]'>
										<StyledText
											className={`font-[600] text-offwhite text-[20px]`}
										>
											Nason Allen
										</StyledText>
										<StyledText className={`text-offwhite text-[14px]`}>
											Developer
										</StyledText>
									</StyledView>								
									<Button
										icon='logo-linkedin'
										iconColor={'#FFFBFC'}
										iconSize={26}
										width={'w-[65px]'}
										height={'h-[35px]'}
										bgColor={'bg-transparent'}	
										borderColor={'border-offwhite'}																			
										btnStyles='border absolute right-2 top-[5px]'
										href={'https://www.linkedin.com/in/nason-allen/'}
									></Button>
								</StyledView>

								<StyledView className='flex flex-row w-full'>									
									<StyledImage
										className='rounded-xl'
										style={{ width: 60, height: 60 }}
										source={require('../../assets/devs/andrew.jpg')}
									/>
									<StyledView className='pl-2 bottom-[3px]'>
										<StyledText
											className={`font-[600] text-offwhite text-[20px]`}
										>
											Andrew Roberti
										</StyledText>
										<StyledText className={`text-offwhite text-[14px]`}>
											Developer
										</StyledText>
									</StyledView>								
									<Button
										icon='logo-linkedin'
										iconColor={'#FFFBFC'}
										iconSize={26}
										width={'w-[65px]'}
										height={'h-[35px]'}
										bgColor={'bg-transparent'}		
										borderColor={'border-offwhite'}																		
										btnStyles='border absolute right-2 top-[5px]'
										href={'https://www.linkedin.com/in/andrew-roberti-4724a8263/'}
									></Button>
								</StyledView>

								<StyledView className='flex flex-row w-full'>									
									<StyledImage
										className='rounded-xl'
										style={{ width: 60, height: 60 }}
										source={require('../../assets/devs/justin.jpg')}
									/>
									<StyledView className='pl-2 bottom-[3px]'>
										<StyledText
											className={`font-[600] text-offwhite text-[20px]`}
										>
											Justin Ayres
										</StyledText>
										<StyledText className={`text-offwhite text-[14px]`}>
											Developer
										</StyledText>
									</StyledView>								
									<Button
										icon='logo-linkedin'
										iconColor={'#FFFBFC'}
										iconSize={26}
										width={'w-[65px]'}
										height={'h-[35px]'}
										bgColor={'bg-transparent'}	
										borderColor={'border-offwhite'}																			
										btnStyles='border absolute right-2 top-[5px]'
										href={'https://www.linkedin.com/in/justin-ayres-25576921b/'}
									></Button>
								</StyledView>
							
							</StyledView>
						</StyledView>

						<StyledText className='w-full text-center text-[30px] text-offwhite mt-4'>
							Our Team Stylized
						</StyledText>
						<StyledView className='w-[95%]  border border-[#6666660D] rounded-[20px] p-[10px] my-2'>
							<StyledView className='flex w-full h-auto'>
								
								<StyledView className='z-10 flex'>		
									<StyledPressable
										className='flex-col w-auto items-center justify-center'
										onPress={() => (router.push('https://www.linkedin.com/in/aidan-hubley-24228322b/'))}
									>							
										<StyledImage
											className='rounded-xl'
											style={{ width: 60, height: 60 }}
											source={require('../../assets/devs/aidan.jpg')}
										/>
										<StyledText
											className={`font-[600] text-offwhite text-[20px]`}
										>
											Aidan Hubley
										</StyledText>
										{/* <StyledText className={`text-offwhite text-[14px]`}>
											Team Lead
										</StyledText> */}
									</StyledPressable>							
								</StyledView>

								<StyledView className='z-10 flex-row justify-between pt-3 pb-5'>
									<StyledView className='flex right-2'>		
										<StyledPressable
											className='flex-col w-auto items-center justify-center'
											onPress={() => (router.push('https://www.linkedin.com/in/amuresan5833/'))}
										>							
											<StyledImage
												className='rounded-xl'
												style={{ width: 60, height: 60 }}
												source={require('../../assets/devs/alex.jpg')}
											/>
											<StyledText
												className={`font-[600] text-offwhite text-[20px]`}
											>
												Alex Muresan
											</StyledText>
											{/* <StyledText className={`text-offwhite text-[14px]`}>
												Batabase Manager
											</StyledText> */}
										</StyledPressable>							
									</StyledView>

									<StyledView className='flex left-4'>		
										<StyledPressable
											className='flex-col w-auto items-center justify-center'
											onPress={() => (router.push('https://www.linkedin.com/in/andrew-roberti-4724a8263/'))}
										>							
											<StyledImage
												className='rounded-xl'
												style={{ width: 60, height: 60 }}
												source={require('../../assets/devs/andrew.jpg')}
											/>
											<StyledText
												className={`font-[600] text-offwhite text-[20px]`}
											>
												Andrew Roberti
											</StyledText>
											{/* <StyledText className={`text-offwhite text-[14px]`}>
												Developer
											</StyledText> */}
										</StyledPressable>					
									</StyledView>
								</StyledView>
								
								<StyledView className='z-10 flex-row justify-evenly'>
									<StyledView className='flex'>			
										<StyledPressable
											className='flex-col w-auto items-center justify-center'
											onPress={() => (router.push('https://www.linkedin.com/in/nason-allen/'))}
										>							
											<StyledImage
												className='rounded-xl'
												style={{ width: 60, height: 60 }}
												source={require('../../assets/devs/nason.jpg')}
											/>
											<StyledText
												className={`font-[600] text-offwhite text-[20px]`}
											>
												Nason Allen
											</StyledText>
											{/* <StyledText className={`text-offwhite text-[14px]`}>
												Developer
											</StyledText> */}
										</StyledPressable>							
									</StyledView>

									<StyledView className='flex'>		
										<StyledPressable
											className='flex-col w-auto items-center justify-center'
											onPress={() => (router.push('https://www.linkedin.com/in/justin-ayres-25576921b/'))}
										>							
											<StyledImage
												className='rounded-xl'
												style={{ width: 60, height: 60 }}
												source={require('../../assets/devs/justin.jpg')}
											/>
											<StyledText
												className={`font-[600] text-offwhite text-[20px]`}
											>
												Justin Ayres
											</StyledText>
											{/* <StyledText className={`text-offwhite text-[14px]`}>
												Developer
											</StyledText> */}
										</StyledPressable>							
									</StyledView>
								</StyledView>
							
								<StyledImage
									className='z-0 absolute top-2 self-center justify-center w-[260px] h-[260px]'															
									source={require('../../assets/spiral/spiral.png')}
								/>

							</StyledView>
						</StyledView>

						<View className='relative pb-[75px]'></View>
					</StyledView>
				</ScrollView>

				<StyledGradient
					pointerEvents='none'
					start={{ x: 0, y: 0.1 }}
					end={{ x: 0, y: 1 }}
					style={{ height: 120 }}
					className='absolute w-screen'
					colors={['#121212ee', 'transparent']}
				/>
				<StyledView
					style={{
						top: Platform.OS == 'android' ? 15 : 15 // Need Alex to test this, it's perfect on Andriod
					}}
					className='absolute w-screen flex-row items-center justify-between px-[15px]'
				>
					<StyledText className='text-4xl font-bold text-offwhite'>
						Prayer Circle
					</StyledText>
					<Button
						icon='document-text'
						iconColor={'#FFFBFC'}
						iconSize={26}
						width={'w-[65px]'}
						height={'h-[35px]'}
						bgColor={'bg-transparent'}
						textColor={'text-offwhite'}
						borderColor={'border-offwhite'}
						btnStyles='border-2'
						press={() =>
							handleModalPress(
								'tos',
								['65%', '85%'],
								'Terms of Service',
								''
							)
						}
					></Button>
				</StyledView>
				<StyledGradient
					pointerEvents='none'
					start={{ x: 0, y: 0.1 }}
					end={{ x: 0, y: 1 }}
					style={{ height: 100, bottom: 0 }}
					className='absolute w-screen rotate-180'
					colors={['#121212ee', 'transparent']}
				/>

				<StyledView
					className='absolute flex flex-row w-screen px-[15px] justify-between'
					style={{ bottom: insets.bottom }}
				>
					<Button
						height={'h-[50px]'}
						width={'w-[50px]'}
						iconSize={30}
						icon='arrow-back'
						href='/'
					/>
				</StyledView>

				<BottomSheetModal
					ref={bottomSheetModalRef}
					index={0}
					snapPoints={snapPoints}
					handleComponent={() => handles}
					backdropComponent={(backdropProps) => backdrop(backdropProps)}
					keyboardBehavior='extend'
				>
					<StyledView className='flex-1 bg-grey py-3 items-center text-offwhite'>
						{renderContent()}
					</StyledView>
				</BottomSheetModal>
			</StyledView>
		</StyledSafeArea>
	);
}
