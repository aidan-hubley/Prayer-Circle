import React, { useState } from 'react';
import { SafeAreaView, Text, View, TouchableOpacity, Animated, ScrollView } from 'react-native';
import Modal from "react-native-modal";
import { styled } from 'nativewind';
import { Button } from '../components/Buttons';
import { Member } from '../components/Member.js';

const StyledSafeArea = styled(SafeAreaView);
const StyledView = styled(View);
const StyledText = styled(Text);
const StyledAnimatedView = styled(Animated.createAnimatedComponent(View));
const StyledScrollView = styled(ScrollView);

export default function Page() {

	const [modalVisible, setModalVisible] = useState(false);

	const [isEnabled, setIsEnabled] = useState(false);
	const toggleSwitch = () => setIsEnabled(previousState => !previousState);
	const togglePosition = React.useRef(new Animated.Value(1)).current;

	const Trevor = "https://media.licdn.com/dms/image/C4E03AQEjKbD7qFuQJQ/profile-displayphoto-shrink_200_200/0/1574282480254?e=1701907200&v=beta&t=1BizKLULm5emiKX3xlsRq7twzFTqynOsfTlbRwqNuXI";

	React.useEffect(() => {
		Animated.timing(togglePosition, {
		toValue: isEnabled ? 45 : 5,
		duration: 200,
		useNativeDriver: false,
		}).start();
	}, [isEnabled]);

	return (
		<StyledSafeArea className='bg-offblack border' style={{ flex: 1 }}>
			<StyledView className='flex-1 items-center'>
				{/* <StyledView className='absolute top-0 w-full h-[60px] bg-grey justify-center items-center'/> */}
					<Button // Leave Circle
						btnStyles='absolute left-5 top-10 bg-grey rotate-180'
						height={'h-[60px]'}
						width={'w-[60px]'}
						iconSize={40}
						icon='log-out'
						iconColor='#F9A826'
						onPress={() => setModalVisible(true)}
					/>
					<StyledText className='absolute top-10 text-3xl text-offwhite bg-grey h-[60px] px-[35px] py-[12px] rounded-full'>
						Settings
					</StyledText>
					<Button // Delete Circle
						btnStyles='absolute right-5 top-10 bg-grey'
						height={'h-[60px]'}
						width={'w-[60px]'}
						iconSize={40}
						icon='trash'
						iconColor='#CC2500'
					/>
				{/* </StyledView> */}

				{/* DOES NOT WORK! */}

				<Modal
					animationType="slide"
					transparent={false}
					visible={modalVisible}
					onRequestClose={() => {
					Alert.alert('Modal has been closed.');
					setModalVisible(!modalVisible);
					}}>
					<StyledView>
						<StyledView>
							<StyledText>Hello World!</StyledText>
							<StyledText onPress={() => setModalVisible(!modalVisible)}>Hide Modal</StyledText>
						</StyledView>
					</StyledView>
				</Modal>

				<StyledView className='top-[130px] w-[85%] gap-y-8 flex'>
					<StyledView className="bg-grey h-[60px] py-[9px] px-[50px] rounded-xl justify-center items-center">
						<Button
							btnStyles='absolute left-5 bg-grey border-2 border-purple mr-3'
							height={'h-[45px]'}
							width={'w-[45px]'}
							iconSize={30}
							icon='musical-notes'
							iconColor='white'
							href='/feed'
						/>
						<StyledText className='font-bold text-3xl text-offwhite'>
							Circle Name
						</StyledText>
					</StyledView>
					<StyledView className="bg-grey h-[60px] py-[12px] rounded-xl pl-5 flex flex-row">
						<StyledText className='font-bold text-3xl text-offwhite'>
							Notifications
						</StyledText>
						<TouchableOpacity onPress={toggleSwitch}>
							<StyledView
								className='left-[50px] pt-9 w-[80px] h-[30px] rounded-full'
								style={{
									backgroundColor: isEnabled ? "#00A55E" : '#F9A826',
								}}
							>
								<StyledAnimatedView
									className='absolute top-1 w-[28px] h-[28px] rounded-full bg-white	'
									style={{
										left: togglePosition,
									}}
								/>
							</StyledView>
						</TouchableOpacity>
					</StyledView>
					<StyledView className="bg-grey h-[425px] py-[12px] rounded-xl pl-5">
						<StyledText className='font-bold text-3xl text-offwhite'>
							Members
						</StyledText>
						<StyledScrollView className="">
							<Member img={Trevor} name="Josh Philips" username="JoshuaP.149134" role="own"></Member>
							<Member img={Trevor} name="Alex Muresan" username="muresanCoder.20" role="mod"></Member>
							<Member img={Trevor} name="Nason Allen" username="AllenNasin0987654" role="mod"></Member>
							<Member img={Trevor} name="Aidan Hubley" username="HubleyPraying" role="ban"></Member>
							<Member img={Trevor} name="Trevor Bunch" username="BunchTrevoraccount" role="mem"></Member>
							<Member img={Trevor} name="Another Account" username="ExampleAccount1" role="sus"></Member>
							<Member img={Trevor} name="Another Account" username="ExampleAccount2" role="mem"></Member>
							<Member img={Trevor} name="Another Account" username="ExampleAccount3" role="mem"></Member>
							<Member img={Trevor} name="Another Account" username="ExampleAccount4" role="mem"></Member>
							<Member img={Trevor} name="Another Account" username="ExampleAccount5" role="mem"></Member>
							<Member img={Trevor} name="Another Account" username="ExampleAccount6" role="mem"></Member>
							<Member img={Trevor} name="Last Account" username="ExampleAccount7" role="ban"></Member>
						</StyledScrollView>
					</StyledView>
				</StyledView>

				<Button // to Share Page
					btnStyles='absolute right-5 bottom-5'
					height={'h-[60px]'}
					width={'w-[60px]'}
					iconSize={40}
					icon='qr-code'
					href='shareCircle'
				/>
				<Button // Back to Feed Page
					btnStyles='absolute left-5 bottom-5'
					height={'h-[60px]'}
					width={'w-[60px]'}
					iconSize={40}
					icon='arrow-back'
					href='/feed'
				/>
			</StyledView>
		</StyledSafeArea>
	);
}