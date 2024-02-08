import React, { useEffect, useState, useRef, useMemo, useCallback } from 'react';
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
import { MemberQueue } from '../../components/MemberQueue.js';
import { LinearGradient } from 'expo-linear-gradient';
import { useStore } from '../global';
import { readData, writeData } from '../../backend/firebaseFunctions.js';
import { getDatabase, ref, query, orderByValue, equalTo, get, child } from "firebase/database";
import {
	BottomSheetModal,
	BottomSheetFlatList,
	BottomSheetModalProvider
} from '@gorhom/bottom-sheet';
import {
	handle,
	backdrop,
	SnapPoints
} from '../../components/BottomSheetModalHelpers.js';

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledAnimatedView = styled(Animated.createAnimatedComponent(View));
const StyledScrollView = styled(ScrollView);
const StyledModal = styled(Modal);
const StyledGradient = styled(LinearGradient);

export default function Page() {
		const [
		filter,
		currentFilterName,
		currentFilterIcon,
		currentFilterColor,
		currentFilterDescription,
		currentFilterIconColor,
	] = useStore((state) => [
		state.filter,
		state.currentFilterName,
		state.currentFilterIcon,
		state.currentFilterColor,
		state.currentFilterDescription,
		state.currentFilterIconColor,
	]);
	let insets = useSafeAreaInsets();

	const [isModalVisible1, setModalVisible1] = useState(false);
	const toggleModal1 = () => {
		setModalVisible1(!isModalVisible1);
	};

	const [isModalVisible2, setModalVisible2] = useState(false);
	const toggleModal2 = () => {
		setModalVisible2(!isModalVisible2);
	};

	// bottom sheet modal
	const bottomSheetModalRef = useRef(null);
	const handlePresentModalPress = useCallback(() => {
		bottomSheetModalRef.current?.present();
	}, []);
	const [modalContent, setModalContent] = useState(null);

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

	const dummyData2 = [
		{
			key: '1',
			name: 'Shiela Sunrise',
			username: 'GotHops00',
			img: Trevor
		},
		{
			key: '2',
			name: 'James Byrd',
			username: 'NamesByrd...JamesByrd',
			img: Trevor
		},
		{
			key: '3',
			name: 'Bentley Lastname',
			username: 'TotallyNotBartholomew',
			img: Trevor
		},
		{
			key: '4',
			name: 'Agent 9',
			username: 'MonkeyModeActivated',
			img: Trevor
		}
	];

	const handleQueuePress = () => {
		setModalContent('queue');
		handlePresentModalPress();
	};

	const renderContent = () => {
		switch (modalContent) {
			case 'queue':
				return (
					<StyledView className='flex-1 bg-grey py-3 items-center text-offwhite'>
						<BottomSheetFlatList
							data={circleMembersData}
							renderItem={({ item }) => {
								return (
									<MemberQueue
										name={item.name}
										username={item.username}
										img={item.img}
										last={item.key == circleMembersData.length}
									/>
								);
							}}
						/>
					</StyledView>
				);
			default:
				return null;
		}
	};

	async function makeCircleUserList(circle) {
		console.log("start makeCircleUserList");
		console.log("Passed circle: " + circle);
		let circleMembersData = [];
		let targetUserList = Object.keys(
			(await readData(`prayer_circle/circles/${circle}/members/`)) || {}
		);
		console.log("Target user list " + targetUserList);
		let keySomething = 1;
	
		for (targetUser in targetUserList) {
	
			let data = await readData(`prayer_circle/users/${targetUser}/public`) || {};
			let name = data.fname + " " + data.lname;
	
			let username = "";
			const db = getDatabase();
			const pathRef = ref(db, 'usernames/');
			const q = query(pathRef, orderByValue(), equalTo(targetUser));

			get(q)
			.then((snapshot) => {
				if (snapshot.exists()) {
				username = child(snapshot, targetUser).key;
				console.log('Value found');
				} else {
				console.log('Value not found');
				}
			})
			.catch((error) => {
				console.error(error);
			});
	
			let role = ""
				try {
					role = Object.values(
					(await readData(`prayer_circle/users/${targetUser}/private/circles/${circle}/role`)) || {}
				);
			} catch {
				if (role == {} || role == null || role == undefined) {
					role = "member";
					writeData(`prayer_circle/users/${targetUser}/private/circles/${circle}/role`, role, false);
				}
			}
			let img = Object.values(
				(await readData(`prayer_circle/users/${targetUser}/public/profile_img`)) || {}
			);

			keySomething++;
	
			circleMembersData.push({
				key: keySomething.toString(),
				name: name,
				username: username,
				role: role,
				img: img
			});
		}
	
		console.log("circleSettingsData: " + circleMembersData);
		return circleMembersData;
	}

	let description = null;
	let circleMembersData = null;

	useEffect(() => {

		(async () => {
			//read data from db for description using `filter` as the key
			description = await readData(`prayer_circle/circles/${circle}/description`) || {};
			circleMembersData = makeCircleUserList(filter);
			console.log('filter', filter);
		})();
	}, [filter])

	return (
		<BottomSheetModalProvider>
			<StyledView
				className='bg-offblack flex-1'
				style={{
					paddingTop: Platform.OS == 'android' ? insets.top : 0
				}}
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
									btnStyles='bg-offblack border-[8px]'
									height={'h-[120px]'}
									width={'w-[120px]'}
									iconSize={70}
									icon={currentFilterIcon}
									iconColor={currentFilterIconColor}
									href='/'
									borderColor={currentFilterColor}
								/>
							</StyledView>

							<StyledText className='w-full text-center text-[30px] text-offwhite my-2'>
								{currentFilterName}
							</StyledText>
							<StyledView className='w-full bg-grey border border-[#6666660D] rounded-[20px] p-[10px] my-2'>
								<StyledText className='text-white text-[14px]'>
									{currentFilterDescription}
								</StyledText>
							</StyledView>
							<StyledView className='border-x border-t border-[#6666660d] mt-2 w-full h-[45px] pt-2 bg-grey rounded-t-[20px] items-center justify-center'>
								<StyledText className='w-full text-center text-[28px] text-white font-[600]'>
									Members
								</StyledText>
							</StyledView>
						</>
					}
					data={circleMembersData}
					renderItem={({ item }) => {
						return (
							<Member
								name={item.name}
								username={item.username}
								role={item.role}
								img={item.img}
								last={item.key == circleMembersData.length}
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
					style={{
						top: Platform.OS == 'android' ? insets.top + 15 : 15
					}}
					className='absolute w-screen flex flex-row items-center justify-between px-[15px]'
				>
					<Button
						btnStyles='rotate-180 border-2'
						bgColor='bg-offblack'
						borderColor='border-yellow'
						height={'h-[50px]'}
						width={'w-[50px]'}
						iconSize={30}
						icon='log-out-outline'
						iconColor='#F9A826'
						press={toggleModal1}
					/>
					<StyledText className='text-4xl font-bold text-offwhite'>
						Settings
					</StyledText>
					<Button
						btnStyles='border-2'
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
						href='/'
					/>
					<Button // Queue
						title='Queue: 4'
						height={'h-[50px]'}
						width={'w-[200px]'}
						press={handleQueuePress}
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
								icon={currentFilterIcon}
								iconColor={currentFilterIconColor}
								href='/'
								borderColor={currentFilterColor}
							/>

							<StyledText className='top-[20%] text-3xl text-offwhite'>
								{currentFilterName}
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
								icon={currentFilterIcon}
								iconColor={currentFilterIconColor}
								href='/'
								borderColor={currentFilterColor}
							/>

							<StyledText className='top-[20%] text-3xl text-offwhite'>
								{currentFilterName}
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

				<BottomSheetModal
					enableDismissOnClose={true}
					ref={bottomSheetModalRef}
					index={0}
					snapPoints={SnapPoints(['65%'])}
					handleComponent={() => handle('User Queue')}
					backdropComponent={(backdropProps) =>
						backdrop(backdropProps)
					}
					keyboardBehavior='extend'
				>
					<StyledView className='flex-1 bg-offblack'>
						{renderContent()}
					</StyledView>
				</BottomSheetModal>
			</StyledView>
		</BottomSheetModalProvider>
	);
}
