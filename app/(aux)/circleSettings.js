import React, { useEffect, useState, useRef, useCallback } from 'react';
import {
	Text,
	View,
	Platform,
	FlatList,
	ActivityIndicator
} from 'react-native';
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
import { router } from 'expo-router';

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledGradient = styled(LinearGradient);

export default function Page() {
	useEffect(() => {
		setUserData(auth.currentUser);
	}, [auth.currentUser]);
	const [userData, setUserData] = useState(auth.currentUser);
	const [memberData, setMemberData] = useState([]);
	const [userQueueData, setUserQueueData] = useState([]);
	const [description, setDescription] = useState('');
	const [
		filter,
		currentFilterName,
		currentFilterIcon,
		currentFilterColor,
		currentFilterIconColor,
		currentCircleRole,
		setCurrentCircleRole,
		setFilter,
		setFilterName,
		setGlobalReload,
		setFilterReload
	] = useStore((state) => [
		state.filter,
		state.currentFilterName,
		state.currentFilterIcon,
		state.currentFilterColor,
		state.currentFilterIconColor,
		state.currentCircleRole,
		state.setCurrentCircleRole,
		state.setFilter,
		state.setFilterName,
		state.setGlobalReload,
		state.setFilterReload
	]);
	let insets = useSafeAreaInsets();
	const [handleText, setHandleText] = useState('');

	// bottom sheet modal
	const bottomSheetModalRef = useRef(null);
	const handlePresentModalPress = useCallback(() => {
		bottomSheetModalRef.current?.present();
	}, []);
	const [modalContent, setModalContent] = useState(null);

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

	const renderContent = () => { };
	const updateUserQueueData = async (uid) => {
		setUserQueueData(
			userQueueData.filter((obj) => Object.keys(obj)[0] !== uid)
		);
		setUp();
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

			if (targetUserList[i][0] === auth.currentUser.uid) {
				setCurrentCircleRole(role);
			}

			circleMembersData.push({
				name: name,
				role: role,
				img: img,
				uid: targetUserList[i][0]
			});
		}
		return circleMembersData;
	}

	async function makeCircleUserQueueList(circle) {
		let circleMembersData = [];
		let targetUserList = Object.entries(
			(await readData(
				`prayer_circle/circles/${circle}/awaitingEntry/`
			)) || {}
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
				[targetUserList[i][0]]: {
					name: name,
					role: role,
					img: img
				}
			});
		}
		return circleMembersData;
	}

	function sortUsers(array) {
		let data = array;
		const statusesOrder = [
			'owner',
			'admin',
			'member',
			'suspended',
			'banned'
		];
		data.sort((a, b) => {
			return (
				statusesOrder.indexOf(a.role) - statusesOrder.indexOf(b.role)
			);
		});

		setMemberData(data);
	}

	async function leaveCircle(circle, user) {
		deleteData(`prayer_circle/circles/${circle}/members/${user}`);
		deleteData(`prayer_circle/users/${user}/private/circles/${circle}`);
		setFilter('unfiltered');
		setFilterName('Prayer Circle');
		setGlobalReload(true);
		setFilterReload(true);
		router.push('/');
	}
	async function deleteCircle(circle) {
		// Database call to remove circle from database
		let membersList = Object.keys(
			(await readData(`prayer_circle/circles/${circle}/members/`)) || {}
		); // Get list of members in circle
		for (let member of membersList) {
			deleteData(
				`prayer_circle/users/${member}/private/circles/${circle}`
			); //Removes circle from users' circles list
		}

		let postList = Object.keys(
			(await readData(`prayer_circle/circles/${circle}/posts/`)) || {}
		); // Get list of posts in circle
		for (let post of postList) {
			deleteData(`prayer_circle/posts/${post}/circles/${circle}`); //Removes circle from posts' circles list
			// this is intentional, because just because a post exists in 1 circle doesn't mean that the creator would want it to be deleted
		}
		deleteData(`prayer_circle/circles/${circle}`); // Removes circle from list of circles

		setFilter('unfiltered');
		setFilterName('Prayer Circle');
		setGlobalReload(true);
		setFilterReload(true);
		router.push('/');
	}

	async function setUp(hard) {
		let description = await readData(
			`prayer_circle/circles/${filter}/description`
		);
		setDescription(description);
		if (hard) setMemberData([]);
		let data = await makeCircleUserList(filter);
		sortUsers(data);
		data = await makeCircleUserQueueList(filter);
		setUserQueueData(data);
	}

	useEffect(() => {
		(async () => {
			setUp();
		})();
	}, []);

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
							{description && (
								<StyledView className='w-full bg-grey border border-[#6666660D] rounded-[10px] p-[10px] my-2'>
									<StyledText className='text-white text-[14px]'>
										{description}
									</StyledText>
								</StyledView>
							)}
							<StyledView className='border-x border-t border-[#6666660d] mt-2 w-full h-[60px] bg-grey rounded-t-[10px] items-center justify-center'>
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
								uid={item.uid}
								last={
									memberData.indexOf(item) + 1 ==
									memberData.length
								}
								setUp={setUp}
							/>
						);
					}}
					ListEmptyComponent={
						<StyledView className='border-x border-b border-[#6666660d] w-full h-[140px] bg-grey rounded-b-[10px] items-center justify-center'>
							<ActivityIndicator size={'large'} />
						</StyledView>
					}
					ListFooterComponent={
						<StyledView className='w-full h-[100px] bg-offblack' />
					}
					extraData={memberData}
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
					{currentCircleRole !== 'owner' ? (
						<Button
							btnStyles='rotate-180 border-2'
							bgColor='bg-offblack'
							borderColor='#F9A826'
							height={'h-[50px]'}
							width={'w-[50px]'}
							iconSize={30}
							icon='log-out-outline'
							iconColor='#F9A826'
							press={handleLeavePress}
						/>
					) : (
						<View
							style={{
								width: 50,
								height: 50,
								borderWidth: 2,
								borderColor: 'transparent',
								backgroundColor: 'transparent'
							}}
						/>
					)}
					<StyledText className='text-4xl font-bold text-offwhite'>
						Settings
					</StyledText>
					{currentCircleRole === 'owner' ? (
						<Button
							btnStyles='border-2'
							bgColor='bg-offblack'
							borderColor='#CC2500'
							height={'h-[50px]'}
							width={'w-[50px]'}
							iconSize={30}
							icon='trash-outline'
							iconColor='#CC2500'
							press={handleDeletePress}
						/>
					) : (
						<View
							style={{
								width: 50,
								height: 50,
								borderWidth: 2,
								borderColor: 'transparent',
								backgroundColor: 'transparent'
							}}
						/>
					)}
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

					{userQueueData.length > 0 && (
						<Button // Queue
							title={`Queue: ${userQueueData.length}`}
							height={'h-[50px]'}
							width={'w-[200px]'}
							press={handleQueuePress}
						/>
					)}
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
					snapPoints={modalContent === 'queue' ? SnapPoints(['65%']) : SnapPoints(['37%'])}
					handleComponent={() => handle(handleText)}
					backdropComponent={(backdropProps) =>
						backdrop(backdropProps)
					}
					keyboardBehavior='extend'
				>
					<StyledView className='flex-1 bg-grey'>
						{modalContent === 'queue' && (
							<StyledView className='flex-1 bg-grey py-3 items-center text-offwhite'>
								<BottomSheetFlatList
									data={userQueueData}
									keyExtractor={(item) =>
										Object.keys(item)[0]
									}
									renderItem={({ item }) => {
										let key = Object.keys(item)[0];
										let values = Object.values(item)[0];
										return (
											<MemberQueue
												name={values.name}
												img={values.img}
												uid={key}
												circle={filter}
												updateUserQueueData={(uid) => {
													updateUserQueueData(uid);
												}}
											/>
										);
									}}
								/>
							</StyledView>
						)}
						{modalContent === 'leave' && (
							<StyledView className='flex-1 items-center h-[60%]'>
								<Button
									btnStyles='top-[5%] bg-grey border-4'
									height={'h-[90px]'}
									width={'w-[90px]'}
									iconSize={60}
									icon={currentFilterIcon}
									iconColor={currentFilterIconColor}
									href='/'
									borderColor={currentFilterColor}
								/>

								<StyledText className='top-[10%] text-3xl text-offwhite'>
									{currentFilterName}
								</StyledText>
								{/* Database call to remove from Circle  */}
								<Button
									title='Leave this Circle'
									btnStyles={
										'top-[18%] border-2 border-yellow'
									}
									bgColor={'bg-offblack'}
									textStyles={'text-yellow'}
									width='w-[70%]'
									press={() => {
										leaveCircle(filter, userData.uid);
									}}
								/>
							</StyledView>
						)}
						{modalContent === 'delete' && (
							<StyledView className='flex-1 items-center h-[60%]'>
								<Button
									btnStyles='top-[5%] bg-grey border-4'
									height={'h-[90px]'}
									width={'w-[90px]'}
									iconSize={60}
									icon={currentFilterIcon}
									iconColor={currentFilterIconColor}
									href='/'
									borderColor={currentFilterColor}
								/>
								<StyledText className='top-[10%] text-3xl text-offwhite'>
									{currentFilterName}
								</StyledText>
								{/* Database call to remove from Circle  */}
								<Button
									title='Delete this Circle'
									btnStyles={'top-[18%] border-2 border-red'}
									bgColor={'bg-offblack'}
									textStyles={'text-red'}
									width='w-[70%]'
									press={() => {
										deleteCircle(filter);
									}}
								/>
							</StyledView>
						)}
					</StyledView>
				</BottomSheetModal>
			</StyledView>
		</BottomSheetModalProvider>
	);
}
