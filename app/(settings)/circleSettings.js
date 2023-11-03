import React, { useState } from 'react';
import {
	Text,
	View,
	Platform,
	Animated,
	ScrollView,
	FlatList
} from 'react-native';
import Modal from 'react-native-modal';
import { styled } from 'nativewind';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button } from '../../components/Buttons';
import { Member } from '../../components/Member.js';
import { LinearGradient } from 'expo-linear-gradient';

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledAnimatedView = styled(Animated.createAnimatedComponent(View));
const StyledScrollView = styled(ScrollView);
const StyledModal = styled(Modal);
const StyledGradient = styled(LinearGradient);

export default function Page() {
	let insets = useSafeAreaInsets();

	const [isModalVisible1, setModalVisible1] = useState(false);
	const toggleModal1 = () => {
		setModalVisible1(!isModalVisible1);
	};

	const [isModalVisible2, setModalVisible2] = useState(false);
	const toggleModal2 = () => {
		setModalVisible2(!isModalVisible2);
	};

	const [isEnabled, setIsEnabled] = useState(false);
	const toggleSwitch = () => setIsEnabled((previousState) => !previousState);
	const togglePosition = React.useRef(new Animated.Value(1)).current;

	const Trevor =
		'https://media.licdn.com/dms/image/C4E03AQEjKbD7qFuQJQ/profile-displayphoto-shrink_200_200/0/1574282480254?e=1701907200&v=beta&t=1BizKLULm5emiKX3xlsRq7twzFTqynOsfTlbRwqNuXI';

	React.useEffect(() => {
		Animated.timing(togglePosition, {
			toValue: isEnabled ? 45 : 5,
			duration: 200,
			useNativeDriver: false
		}).start();
	}, [isEnabled]);

	const dummyData = [
		{
			key: '1',
			name: 'Josh Philips',
			username: 'JoshuaP.149134',
			role: 'own',
			img: Trevor
		},
		{
			key: '2',
			name: 'Alex Muresan',
			username: 'muresanCoder.20',
			role: 'mod',
			img: Trevor
		},
		{
			key: '3',
			name: 'Nason Allen',
			username: 'AllenNasin0987654',
			role: 'mod',
			img: Trevor
		},
		{
			key: '4',
			name: 'Aidan Hubley',
			username: 'HubleyPraying',
			role: 'ban',
			img: Trevor
		},
		{
			key: '5',
			name: 'Trevor Bunch',
			username: 'BunchTrevoraccount',
			role: 'mem',
			img: Trevor
		},
		{
			key: '6',
			name: 'Another Account',
			username: 'ExampleAccount1',
			role: 'sus',
			img: Trevor
		},
		{
			key: '7',
			name: 'Another Account',
			username: 'ExampleAccount2',
			role: 'mem',
			img: Trevor
		},
		{
			key: '8',
			name: 'Another Account',
			username: 'ExampleAccount3',
			role: 'mem',
			img: Trevor
		}
	];

	return (
		<StyledView
			className='bg-offblack flex-1'
			style={{ paddingTop: Platform.OS == 'android' ? insets.top : 0 }}
		>
			<FlatList
				style={{
					backgroundColor: '#121212',
					paddingHorizontal: 15
				}}
				ListHeaderComponent={
					<>
						<StyledView
							className='w-full flex items-center mb-[10px]'
							style={{
								height: 80
							}}
						/>
						<StyledView className='w-full flex items-center justify-center'>
							<Button
								btnStyles='bg-offblack border-[8px] border-purple'
								height={'h-[120px]'}
								width={'w-[120px]'}
								iconSize={70}
								icon='musical-notes'
								iconColor='white'
								href='/mainViewLayout'
							/>
						</StyledView>

						<StyledText className='w-full text-center text-[30px] text-offwhite my-2'>
							Circle Name
						</StyledText>
						<StyledView className='w-full bg-grey border border-[#6666660D] rounded-[20px] p-[10px] my-2'>
							<StyledText className='text-white text-[14px]'>
								This is where the description of the circle will
								go. It will be a short description of the circle
								that will be displayed to users who are
								interested in joining. Admins can edit this
								description by clicking into the box and typing.
							</StyledText>
						</StyledView>
						<StyledView className='border-x border-t border-[#6666660d] mt-2 w-full h-[45px] pt-2 bg-grey rounded-t-[20px] items-center justify-center'>
							<StyledText className='w-full text-center text-[28px] text-white font-[600]'>
								Members
							</StyledText>
						</StyledView>
					</>
				}
				data={dummyData}
				renderItem={({ item }) => {
					return (
						<Member
							name={item.name}
							username={item.username}
							role={item.role}
							img={item.img}
							last={item.key == dummyData.length}
						/>
					);
				}}
				ListFooterComponent={
					<>
						<StyledView
							className='w-full flex items-center mb-[10px]'
							style={{
								height: insets.bottom + 55
							}}
						/>
					</>
				}
			/>
			<StyledGradient
				pointerEvents='none'
				start={{ x: 0, y: 0.1 }}
				end={{ x: 0, y: 1 }}
				style={{ height: 120 }}
				className='absolute w-screen'
				colors={['#121212ee', 'transparent']}
			/>
			<StyledView
				style={{ top: Platform.OS == 'android' ? insets.top + 15 : 15 }}
				className='absolute w-screen flex flex-row items-center justify-between px-[15px]'
			>
				<Button
					btnStyles='rotate-180'
					bgColor='bg-offblack'
					borderColor='border-yellow'
					height={'h-[50px]'}
					width={'w-[50px]'}
					iconSize={30}
					icon='log-out-outline'
					iconColor='#F9A826'
					press={toggleModal1}
				/>
				<StyledText className='text-3xl font-bold text-offwhite'>
					Settings
				</StyledText>
				<Button
					bgColor='bg-offblack'
					borderColor='border-red'
					height={'h-[50px]'}
					width={'w-[50px]'}
					iconSize={30}
					icon='trash-outline'
					iconColor='#CC2500'
					press={toggleModal2}
				/>
			</StyledView>

			<StyledView
				className='absolute flex flex-row w-screen px-[15px] justify-between'
				style={{ bottom: insets.bottom }}
			>
				<Button // Back to Feed Page
					height={'h-[50px]'}
					width={'w-[50px]'}
					iconSize={30}
					icon='arrow-back'
					href='/mainViewLayout'
				/>
				<Button // to Share Page
					height={'h-[50px]'}
					width={'w-[50px]'}
					iconSize={30}
					icon='qr-code'
					href='shareCircle'
				/>
			</StyledView>

			<StyledModal
				className='w-[80%] self-center'
				isVisible={isModalVisible1}
			>
				<StyledView className='bg-offblack border-[5px] border-yellow rounded-2xl h-[60%]'>
					<StyledView className='flex-1 items-center h-[60%]'>
						<StyledText className='top-[6%] text-3xl text-offwhite'>
							Leave this circle?
						</StyledText>

						<Button
							btnStyles='top-[15%] bg-grey border-4 border-purple'
							height={'h-[90px]'}
							width={'w-[90px]'}
							iconSize={60}
							icon='musical-notes'
							iconColor='white'
							href='/mainViewLayout'
						/>

						<StyledText className='top-[20%] text-3xl text-offwhite'>
							Circle Name
						</StyledText>
						{/* Database call to remove from Circle  */}
						<Button
							title='Leave'
							btnStyles={'top-[31%] border-2 border-yellow'}
							bgColor={'bg-offblack'}
							textStyles={'text-yellow'}
							width='w-[70%]'
							press={toggleModal1}
						/>
						<Button
							title='Cancel'
							btnStyles={'top-[37%]'}
							width='w-[70%]'
							press={toggleModal1}
						/>
					</StyledView>
				</StyledView>
			</StyledModal>

			<StyledModal
				className='w-[80%] self-center'
				isVisible={isModalVisible2}
			>
				<StyledView className='bg-offblack border-[5px] border-red rounded-2xl h-[60%]'>
					<StyledView className='flex-1 items-center h-[60%]'>
						<StyledText className='top-[6%] text-3xl text-offwhite'>
							Delete this circle?
						</StyledText>

						<Button
							btnStyles='top-[15%] bg-grey border-4 border-purple'
							height={'h-[90px]'}
							width={'w-[90px]'}
							iconSize={60}
							icon='musical-notes'
							iconColor='white'
							href='/mainViewLayout'
						/>

						<StyledText className='top-[20%] text-3xl text-offwhite'>
							Circle Name
						</StyledText>
						{/* Database call to remove from Circle  */}
						<Button
							title='Delete'
							btnStyles={'top-[31%] border-2 border-red'}
							bgColor={'bg-offblack'}
							textStyles={'text-red'}
							width='w-[70%]'
							press={toggleModal2}
						/>
						<Button
							title='Cancel'
							btnStyles={'top-[37%]'}
							width='w-[70%]'
							press={toggleModal2}
						/>
					</StyledView>
				</StyledView>
			</StyledModal>
		</StyledView>
	);
}
