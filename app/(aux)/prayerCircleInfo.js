import React, { useState, useRef } from 'react';
import { Text, View, Platform, Image, ScrollView, Pressable, Linking, Dimensions } from 'react-native';
import { styled } from 'nativewind';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button } from '../../components/Buttons';
import { LinearGradient } from 'expo-linear-gradient';
import { BottomSheetModal, BottomSheetFlatList } from '@gorhom/bottom-sheet';
import { handle, backdrop } from '../../components/BottomSheetModalHelpers.js';
import { auth } from '../../backend/config';
import { Terms } from '../../components/Terms';
import { router } from 'expo-router';

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledImage = styled(Image);
const StyledSafeArea = styled(SafeAreaView);
const StyledGradient = styled(LinearGradient);
const StyledPressable = styled(Pressable);

export default function Page() {
	const [handles, setHandles] = useState('');
	const [snapPoints, setSnapPoints] = useState([]);
	const [modalContent, setModalContent] = useState(null);
	const [userData] = useState(auth?.currentUser);
	const bottomSheetModalRef = useRef(null);

	let insets = useSafeAreaInsets();

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
        <>
            <StyledView className='bg-offblack' style={{width: Dimensions.get("window").width}}>
                <ScrollView contentContainerStyle={{paddingHorizontal: 20, alignItems: "center"}}>
                    <StyledPressable 							
                        onPress={() => (router.push('http://prayer-circle.com'))}
                        className="mt-[40px]"
                    >
                        <StyledImage
                            style={{ width: 300, height: 300 }}
                            source={require('../../assets/Dark_Margin.png')}								
                        />
                    </StyledPressable>

                    <StyledText className='w-full font-[600] text-center text-[30px] text-offwhite'>
                        Our Mission
                    </StyledText>
                    <StyledView className='w-full bg-grey border border-[#6666660D] rounded-[10px] p-[10px] my-2'>
                        <StyledText className='text-white text-center text-[18px]'>
                        Our mission is to unite people of the Christian faith by fostering 
                        meaningful interactions and opportunities for prayer. 
                        </StyledText>
                        <StyledText className='pt-4 text-white text-center text-[18px]'>
                        We aim to create a safe and private space for discussion,
                        emphasizing the importance of community in spiritual growth.
                        </StyledText>
                    </StyledView>

                    <StyledView className='flex-row justify-between items-center w-full bg-grey border border-[#6666660D] rounded-[10px] py-[10px] px-[15px] my-2'>								
                        <StyledText className={`text-offwhite text-[20px]`}>
                            Review TOS
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
                            btnStyles='border'
                            press={() =>
                                handleModalPress(
                                    'tos',
                                    ['65%', '85%'],
                                    'Terms of Service',
                                    ''
                                )
                            }
                        />
                    </StyledView>

                    <StyledText className='w-full font-[600] text-center text-[30px] text-offwhite my-4'>
                        Send Feedback
                    </StyledText>
                    <StyledView className='w-full bg-grey border border-[#6666660D] rounded-[10px] px-[15px] gap-y-3'>
                        <StyledView className='flex flex-row w-full justify-between items-center'>									
                            <StyledText className={`text-offwhite text-[20px]`}>
                                Beta Test Feedback
                            </StyledText>					
                            <StyledPressable 
                                className='w-[65px] h-[35px] bg-transparent border-offwhite border rounded-[20px] justify-center items-center'
                                onPress={() => ('/')}
                            >	
                                <StyledImage
                                    className='w-[18px] h-[24px]'
                                    source={require('../../assets/logos/googleForm.png')}
                                />
                            </StyledPressable>
                        </StyledView>
                        <StyledView className='flex flex-row w-full justify-between items-center'>									
                            <StyledText className={`text-offwhite text-[20px]`}>
                                Rate the App
                            </StyledText>				
                            <Button
                                icon={Platform.OS == 'android' ? 'logo-google-playstore' : 'logo-apple-appstore'}
                                iconColor={'#4285F4'}
                                iconSize={26}
                                width={'w-[65px]'}
                                height={'h-[35px]'}
                                bgColor={'bg-transparent'}
                                borderColor={'border-offwhite'}										
                                btnStyles='border'
                                href={'/'}
                            ></Button>
                        </StyledView>
                        <StyledView className='flex flex-row w-full justify-between items-center mb-3'>									
                                <StyledText className={`text-offwhite text-[20px]`}>
                                    Report a Bug
                                </StyledText>		
                            <Button
                                icon='bug'
                                iconColor={'#00A55E'}
                                iconSize={26}
                                width={'w-[65px]'}
                                height={'h-[35px]'}
                                bgColor={'bg-transparent'}
                                borderColor={'border-offwhite'}										
                                btnStyles='border'
                                href={'/'}
                            ></Button>
                        </StyledView>
                    </StyledView>

                    <StyledText className='w-full font-[600] text-center text-[30px] text-offwhite my-4'>
                        Connect with Us
                    </StyledText>
                    <StyledView className='w-[95%] bg-grey border border-[#6666660D] rounded-[10px] px-[15px] gap-y-3'>
                        <StyledView className='flex flex-row w-full justify-between items-center'>									
                            <StyledText className={`text-offwhite text-[20px]`}>
                                Instagram
                            </StyledText>				
                            <Button
                                icon={'logo-instagram'}
                                iconColor={'#FFFBFC'}
                                iconSize={26}
                                width={'w-[65px]'}
                                height={'h-[35px]'}
                                bgColor={'bg-transparent'}
                                borderColor={'border-offwhite'}										
                                btnStyles='border'
                                href={'https://www.instagram.com/prayercircleapp?igsh=bDQ1cTJqbW5oc25l'}
                            ></Button>
                        </StyledView>

                        <StyledView className='flex flex-row w-full justify-between items-center'>									
                            <StyledText className={`text-offwhite text-[20px]`}>
                                Visit the Site
                            </StyledText>						
                            <Button
                                icon={'globe-outline'}
                                iconColor={'#FFFBFC'}
                                iconSize={26}
                                width={'w-[65px]'}
                                height={'h-[35px]'}
                                bgColor={'bg-transparent'}
                                borderColor={'border-offwhite'}										
                                btnStyles='border'
                                href={'http://prayer-circle.com'}
                            ></Button>
                        </StyledView>

                        <StyledView className='flex flex-row w-full justify-between items-center mb-3'>									
                            <StyledText className={`text-offwhite text-[20px]`}>
                                Email our Team
                            </StyledText>			
                            <Button
                                icon='mail'
                                iconColor={'#FFFBFC'}
                                iconSize={26}
                                width={'w-[65px]'}
                                height={'h-[35px]'}
                                bgColor={'bg-transparent'}
                                borderColor={'border-offwhite'}										
                                btnStyles='border'
                                press={() => Linking.openURL('mailto:devs.prayercircle@gmail.com?subject=Prayer Circle User &body=Hello Prayer Circle Devs, %0A %0A [add your message here] %0A %0A Account Name: ' + userData.displayName + ' %0A Account Email: ' + userData?.email + '')}      
                            ></Button>
                        </StyledView>					
                    </StyledView>

                    <StyledText className='w-full font-[600] text-center text-[30px] text-offwhite my-4'>
                        Our Team
                    </StyledText>
                    <StyledView className='w-[95%] bg-grey border border-[#6666660D] rounded-[10px] px-[15px] gap-y-3'>
                        <StyledView className='flex flex-row w-full justify-between items-center'>	
                            <View className="flex-row">
                                <StyledImage
                                    className='rounded-[6px]'
                                    style={{ width: 40, height: 40 }}
                                    source={require('../../assets/devs/aidan.jpg')}
                                />
                                <StyledView className='pl-2'>
                                    <StyledText
                                        className={`text-offwhite text-[20px]`}
                                    >
                                        Aidan Hubley
                                    </StyledText>
                                    <StyledText className={`text-offwhite text-[14px]`}>
                                        Team Lead
                                    </StyledText>
                                </StyledView>
                            </View>						
                            <Button
                                icon='logo-linkedin'
                                iconColor={'#FFFBFC'}
                                iconSize={26}
                                width={'w-[65px]'}
                                height={'h-[35px]'}
                                bgColor={'bg-transparent'}			
                                borderColor={'border-offwhite'}																	
                                btnStyles='border'
                                href={'https://www.linkedin.com/in/aidan-hubley-24228322b/'}
                            ></Button>
                        </StyledView>

                        <StyledView className='flex flex-row w-full justify-between items-center'>			
                            <View className="flex-row">
                                <StyledImage
                                    className='rounded-[6px]'
                                    style={{ width: 40, height: 40 }}
                                    source={require('../../assets/devs/alex.jpg')}
                                />
                                <StyledView className='pl-2'>
                                    <StyledText
                                        className={`text-offwhite text-[20px]`}
                                    >
                                        Alexandru Muresan
                                    </StyledText>
                                    <StyledText className={`text-offwhite text-[14px]`}>
                                        Lead Developer
                                    </StyledText>
                                </StyledView>			
                            </View>											
                            <Button
                                icon='logo-linkedin'
                                iconColor={'#FFFBFC'}
                                iconSize={26}
                                width={'w-[65px]'}
                                height={'h-[35px]'}
                                bgColor={'bg-transparent'}	
                                borderColor={'border-offwhite'}																			
                                btnStyles='border'
                                href={'https://www.linkedin.com/in/amuresan5833/'}
                            ></Button>
                        </StyledView>

                        
                        <StyledView className='flex flex-row w-full justify-between items-center'>		
                            <View className="flex-row">
                                <StyledImage
                                    className='rounded-[6px]'
                                    style={{ width: 40, height: 40 }}
                                    source={require('../../assets/devs/nason.jpg')}
                                />
                                <StyledView className='pl-2'>
                                    <StyledText
                                        className={`text-offwhite text-[20px]`}
                                    >
                                        Nason Allen
                                    </StyledText>
                                    <StyledText className={`text-offwhite text-[14px]`}>
                                        Developer
                                    </StyledText>
                                </StyledView>			
                            </View>					
                            <Button
                                icon='logo-linkedin'
                                iconColor={'#FFFBFC'}
                                iconSize={26}
                                width={'w-[65px]'}
                                height={'h-[35px]'}
                                bgColor={'bg-transparent'}	
                                borderColor={'border-offwhite'}																			
                                btnStyles='border'
                                href={'https://www.linkedin.com/in/nason-allen/'}
                            ></Button>
                        </StyledView>

                        <StyledView className='flex flex-row w-full justify-between items-center'>		
                            <View className="flex-row">
                                <StyledImage
                                    className='rounded-[6px]'
                                    style={{ width: 40, height: 40 }}
                                    source={require('../../assets/devs/andrew.jpg')}
                                />
                                <StyledView className='pl-2'>
                                    <StyledText
                                        className={`text-offwhite text-[20px]`}
                                    >
                                        Andrew Roberti
                                    </StyledText>
                                    <StyledText className={`text-offwhite text-[14px]`}>
                                        Developer
                                    </StyledText>
                                </StyledView>			
                            </View>					
                            <Button
                                icon='logo-linkedin'
                                iconColor={'#FFFBFC'}
                                iconSize={26}
                                width={'w-[65px]'}
                                height={'h-[35px]'}
                                bgColor={'bg-transparent'}		
                                borderColor={'border-offwhite'}																		
                                btnStyles='border'
                                href={'https://www.linkedin.com/in/andrew-roberti-4724a8263/'}
                            ></Button>
                        </StyledView>

                        <StyledView className='flex flex-row w-full justify-between items-center'>	
                            <View className="flex-row">								
                                <StyledImage
                                    className='rounded-[6px]'
                                    style={{ width: 40, height: 40 }}
                                    source={require('../../assets/devs/justin.jpg')}
                                />
                                <StyledView className='pl-2'>
                                    <StyledText
                                        className={`text-offwhite text-[20px]`}
                                    >
                                        Justin Ayres
                                    </StyledText>
                                    <StyledText className={`text-offwhite text-[14px]`}>
                                        Security
                                    </StyledText>
                                </StyledView>								
                            </View>
                            <Button
                                icon='logo-linkedin'
                                iconColor={'#FFFBFC'}
                                iconSize={26}
                                width={'w-[65px]'}
                                height={'h-[35px]'}
                                bgColor={'bg-transparent'}	
                                borderColor={'border-offwhite'}																			
                                btnStyles='border'
                                href={'https://www.linkedin.com/in/justin-ayres-25576921b/'}
                            ></Button>
                        </StyledView>
                    </StyledView>
                    
                    {/* Styled View of team */}
                    {/* <StyledView className='w-[95%] p-[10px] my-2'>
                        <StyledView className='flex w-full h-auto'>
                            
                            <StyledView className='z-10 flex bottom-2'>		
                                <StyledPressable
                                    className='flex-col w-auto items-center justify-center'
                                    onPress={() => (router.push('https://www.linkedin.com/in/aidan-hubley-24228322b/'))}
                                >							
                                    <StyledImage
                                        className='rounded-xl'
                                        style={{ width: 60, height: 60 }}
                                        source={require('../../assets/devs/aidan.jpg')}
                                    />
                                    <StyledText className={`font-[600] text-offwhite text-[20px]`}>
                                        Aidan Hubley
                                    </StyledText>
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
                                        <StyledText className={`font-[600] text-offwhite text-[20px]`}>
                                            Alex Muresan
                                        </StyledText>
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
                                        <StyledText className={`font-[600] text-offwhite text-[20px]`}>
                                            Andrew Roberti
                                        </StyledText>
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
                                        <StyledText className={`font-[600] text-offwhite text-[20px]`}>
                                            Nason Allen
                                        </StyledText>
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
                                        <StyledText className={`font-[600] text-offwhite text-[20px]`}>
                                            Justin Ayres
                                        </StyledText>
                                    </StyledPressable>							
                                </StyledView>
                            </StyledView>
                        
                            <StyledImage
                                className='z-0 absolute top-2 self-center justify-center w-[260px] h-[260px]'															
                                source={require('../../assets/spiral/spiral.png')}
                            />

                        </StyledView>
                    </StyledView> */}
                    <View style={{width: "100%", height: insets.bottom + 80}}/>
                </ScrollView>
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
						top: Platform.OS == 'android' ? insets.top + 15 : 15
					}}
					className='absolute w-screen flex flex-row items-center justify-center px-[15px]'
				>
					<StyledText className='text-4xl font-bold text-offwhite'>
						Prayer Circle
					</StyledText>
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
					<Button // to Share Page
						height={'h-[50px]'}
						width={'w-[50px]'}
						iconSize={30}
						icon='share'
						href='/'
					/>
				</StyledView>
        </>
	);
}
