{/* In the future, Leave Circle and Delete circle code could be parameterized and merged */}
import React, { useEffect, useState, useRef, useCallback } from 'react';
import { Text, View, Platform, Animated, FlatList } from 'react-native';
import Modal from 'react-native-modal';
import { styled } from 'nativewind';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button } from '../../components/Buttons';
import { Member } from '../../components/Member.js';
import { MemberQueue } from '../../components/MemberQueue.js';
import { LinearGradient } from 'expo-linear-gradient';
import { useStore } from '../global';
import { readData, deleteData } from '../../backend/firebaseFunctions.js';
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
import { auth } from '../../backend/config';

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledModal = styled(Modal);
const StyledGradient = styled(LinearGradient);

export default function Page() {

	useEffect(() => {
		setUserData(auth.currentUser);
	}, [auth.currentUser]);
	const [userData, setUserData] = useState(auth.currentUser);

	async function leaveCircle(circle, user) { // Database call to remove user from circle
		// x = await readData(`prayer_circle/circles/${circle}/members/${user}`); path test read
		// deleteData(`prayer_circle/circles/${circle}/members/${user}`);
	}
	async function deleteCircle(circle) { // Database call to remove circle from database
		
		membersList = Object.entries(
			(await readData(`prayer_circle/circles/${circle}/members/`)) || {}
		); // Get list of members in circle; consider combining this with the identical call in another function below
		for (i = 0; i < membersList.length; i++) {
		// 	deleteData(`prayer_circle/users/${membersList[i]}/private/${circle}`); //Removes circle from users' circles list
		};
	
		postList = Object.entries(
			(await readData(`prayer_circle/circles/${circle}/posts/`)) || {}
		); // Get list of members in circle; consider combining this with the identical call in another function below
		for (j = 0; j < postList.length; j++) { // Cycles through every post
			localPost = postList[j]; // currently observed post in the loop
			// deleteData(`prayer_circle/posts/${localPost}/circles/${circle}`); //Removes circle from posts' circles list
		
			if (prayer_circle/posts/localPost/circles == null) {
			// 	deleteData(`prayer_circle/posts/${localPost}`);
			};
		}
		// deleteData(`prayer_circle/circles/${circle}`); // Removes circle from list of circles
	}

	const [memberData, setMemberData] = useState([]);
	const [
		filter,
		currentFilterName,
		currentFilterIcon,
		currentFilterColor,
		currentFilterDescription,
		currentFilterIconColor
	] = useStore((state) => [
		state.filter,
		state.currentFilterName,
		state.currentFilterIcon,
		state.currentFilterColor,
		state.currentFilterDescription,
		state.currentFilterIconColor
	]);
	let insets = useSafeAreaInsets();
	const [handleText, setHandleText] = useState('');

	// bottom sheet modal
	const bottomSheetModalRef = useRef(null);
	const handlePresentModalPress = useCallback(() => {
		bottomSheetModalRef.current?.present();
	}, []);
	const [modalContent, setModalContent] = useState(null);

	const [isEnabled, setIsEnabled] = useState(false);
	const toggleSwitch = () => setIsEnabled((previousState) => !previousState);
	const togglePosition = React.useRef(new Animated.Value(1)).current;

	React.useEffect(() => {
		Animated.timing(togglePosition, {
			toValue: isEnabled ? 45 : 5,
			duration: 200,
			useNativeDriver: false
		}).start();
	}, [isEnabled]);

	const handleQueuePress = () => {
		setHandleText('User Queue');
		setModalContent('queue');
		handlePresentModalPress();
	};
	const handleLeavePress = () => {
		setHandleText('');
		setModalContent('leave');
		handlePresentModalPress();
	};
	const handleDeletePress = () => {
		setHandleText('');
		setModalContent('delete');
		handlePresentModalPress();
	};

	const renderContent = () => {
		switch (modalContent) {
			case 'queue':
				return (
					<StyledView className='flex-1 bg-grey py-3 items-center text-offwhite'>
						<BottomSheetFlatList
							data={memberData}
							renderItem={({ item }) => {
								return (
									<MemberQueue
										name={item.name}
										img={item.img}
										last={item.key == memberData.length}
									/>
								);
							}}
						/>
					</StyledView>
				);
			case 'leave':
				return (
					// <StyledView className='bg-offblack border-[5px] border-yellow rounded-2xl h-[60%]'>
						<StyledView className='flex-1 items-center h-[60%]'>
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
								title='Leave this Circle'
								btnStyles={'top-[31%] border-2 border-yellow'}
								bgColor={'bg-offblack'}
								textStyles={'text-yellow'}
								width='w-[70%]'
								press={leaveCircle(filter, userData.uid)}
							/>
						</StyledView>
					// </StyledView>
				);
			case 'delete':
				return (
					<StyledView className='flex-1 items-center h-[60%]'>
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
							title='Delete this Circle'
							btnStyles={'top-[31%] border-2 border-red'}
							bgColor={'bg-offblack'}
							textStyles={'text-red'}
							width='w-[70%]'
							press={deleteCircle(filter)}
						/>
					</StyledView>
				);
			default:
				return null;
		}
	};

	async function makeCircleUserList(circle) {
		let circleMembersData = [];
		let targetUserList = Object.entries(
			(await readData(`prayer_circle/circles/${circle}/members/`)) || {}
		);
		for (i = 0; i < targetUserList.length; i++) {
			let data =
				(await readData(
					`prayer_circle/users/${targetUserList[i][0]}/public`
				)) || {};
			let name = data.fname + ' ' + data.lname;

			let role = targetUserList[i][1];
			let img = data.profile_img;
			circleMembersData.push({
				name: name,
				role: role,
				img: img
			});
		}
		return circleMembersData;
	}

	useEffect(() => {
		(async () => {
			let data = await makeCircleUserList(filter);
			setMemberData(data);
		})();
	}, [filter]);

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
					data={memberData}
					renderItem={({ item }) => {
						return (
							<Member
								name={item.name}
								role={item.role}
								img={item.img}
								last={
									memberData.indexOf(item) + 1 ==
									memberData.length
								}
							/>
						);
					}}
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
						press={handleLeavePress}
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
						press={handleDeletePress}
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

				<BottomSheetModal
					enableDismissOnClose={true}
					ref={bottomSheetModalRef}
					index={0}
					snapPoints={SnapPoints(['65%'])}
					handleComponent={() => handle(handleText)}
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
