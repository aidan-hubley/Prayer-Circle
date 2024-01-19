import React, {
	useState,
	useRef,
	useEffect,
	useMemo,
	useCallback
} from 'react';
import {
	Text,
	View,
	Image,
	Pressable,
	TouchableOpacity,
	Animated,
	RefreshControl,
	TextInput,
	Keyboard,
	KeyboardAvoidingView
} from 'react-native';
import { styled } from 'nativewind';
import Ionicons from '@expo/vector-icons/Ionicons';
import { timeSince } from '../backend/functions';
import {
	writeData,
	readData,
	generateId,
	deleteData
} from '../backend/firebaseFunctions';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Haptics from 'expo-haptics';
import {
	BottomSheetModal,
	BottomSheetFlatList,
	BottomSheetBackdrop
} from '@gorhom/bottom-sheet';
import { Comment } from './Comment';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useStore } from '../app/global';

const StyledImage = styled(Image);
const StyledView = styled(View);
const StyledText = styled(Text);
const StyledPressable = styled(Pressable);
const StyledOpacity = styled(TouchableOpacity);
const StyledAnimatedView = styled(Animated.createAnimatedComponent(View));
const AnimatedImage = Animated.createAnimatedComponent(StyledImage);
const StyledIcon = styled(Ionicons);
const StyledInput = styled(TextInput);

export const Post = (post) => {
	// variables
	const tS = timeSince(post.timestamp);
	const [iconType, setIconType] = useState(`${post.icon}_outline`);
	const [commentIcon, setCommentIcon] = useState(post.icon);
	const iconAnimation = useRef(new Animated.Value(1)).current;
	const [toolbarShown, setToolbar] = useState(false);
	const [me, setMe] = useState('');
	const [lastTap, setLastTap] = useState(null);
	const [commentData, setCommentData] = useState([]);
	const [newComment, setNewComment] = useState('');
	const newCommentRef = useRef(null);
	const timer = useRef(null);
	const bottomSheetModalRef = useRef(null);
	const images = {
		praise: {
			outline: require('../assets/post/praise_outline.png'),
			nonOutline: require('../assets/post/praise.png')
		},
		event: {
			outline: require('../assets/post/calendar_outline.png'),
			nonOutline: require('../assets/post/calendar.png')
		},
		request: {
			outline: require('../assets/post/prayer_outline.png'),
			nonOutline: require('../assets/post/prayer.png')
		},
		prayer: {
			outline: require('../assets/post/prayer_outline.png'),
			nonOutline: require('../assets/post/prayer.png')
		}
	};

	// bottom sheet modal
	const snapPoints = useMemo(() => ['85%'], []);
	const handlePresentModalPress = useCallback(() => {
		bottomSheetModalRef.current?.present();
	}, []);
	const handleSheetChanges = useCallback((index) => {}, []);

	// animations
	const toolbarVal = useRef(new Animated.Value(0)).current;
	const toolbarHeightInter = toolbarVal.interpolate({
		inputRange: [0, 0.5, 0.75, 1],
		outputRange: [2, 10, 40, 51]
	});
	const toolbarOpactiyInter = toolbarVal.interpolate({
		inputRange: [0, 1],
		outputRange: [0, 1]
	});
	const toolbarMarginInter = toolbarVal.interpolate({
		inputRange: [0, 1],
		outputRange: [0, 8]
	});
	const toolbarStyle = {
		height: toolbarHeightInter,
		opacity: toolbarOpactiyInter,
		marginTop: 4,
		marginBottom: toolbarMarginInter
	};
	const spinInter = toolbarVal.interpolate({
		inputRange: [0, 1],
		outputRange: ['0deg', '180deg']
	});

	const spiralStyle = {
		transform: [{ rotate: spinInter }]
	};

	const onCommentChange = (e) => {
		setNewComment(e.nativeEvent.text);
	};

	let insets = useSafeAreaInsets();

	const handle = () => {
		return (
			<StyledView className='flex items-center justify-center w-screen bg-grey rounded-t-[10px] pt-3'>
				<StyledView className='w-[30px] h-[4px] rounded-full bg-[#dddddd11] mb-3' />
				<StyledText className='text-white font-[600] text-[24px]'>
					Comments
				</StyledText>
			</StyledView>
		);
	};

	const backdrop = (backdropProps) => {
		return (
			<BottomSheetBackdrop
				{...backdropProps}
				opacity={0.5}
				appearsOnIndex={0}
				disappearsOnIndex={-1}
				enableTouchThrough={true}
			/>
		);
	};

	//functions
	function getTypeSource(iconType, isOutline) {
		const iconKey = iconType.replace('_outline', '');
		if (!['praise', 'event', 'request', 'prayer'].includes(iconKey)) {
			console.error(`Invalid icon type: ${iconType}`);
			return;
		}
		if (post.owned) {
			return images[iconKey].nonOutline;
		}
		return isOutline ? images[iconKey].outline : images[iconKey].nonOutline;
	}

	function toggleIcon() {
		Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
		const iconKey = iconType.replace('_outline', '');
		if (['praise', 'event', 'request', 'prayer'].includes(iconKey)) {
			setIconType(
				iconType.includes('outline') ? iconKey : iconKey + '_outline'
			);

			Animated.sequence([
				Animated.timing(iconAnimation, {
					toValue: 1.5,
					duration: 100,
					useNativeDriver: true
				}),
				Animated.timing(iconAnimation, {
					toValue: 1,
					duration: 100,
					useNativeDriver: true
				})
			]).start();
		}
	}

	function toggleToolbar() {
		Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
		setToolbar(!toolbarShown);
		Animated.spring(toolbarVal, {
			toValue: toolbarShown ? 0 : 1,
			duration: 100,
			useNativeDriver: false
		}).start();
	}

	// db related functions
	async function deletePost() {
		const me = await AsyncStorage.getItem('user');
		await writeData(
			`prayer_circle/circles/-NiN-27IuGR02mcGS2CS/posts/${post.id}`,
			null,
			true
		);
		await writeData(
			`prayer_circle/users/${me}/private/posts/${post.id}`,
			null,
			true
		);
		writeData(`prayer_circle/posts/${post.id}`, null, true).then(() => {
			setTimeout(() => {
				post.refresh();
			}, 100);
		});
	}

	async function hidePost(postId) {
		writeData(`prayer_circle/posts/${postId}/hidden/${me}`, true, true);
		toggleToolbar();

		post.refresh();
	}

	// post setup
	const setUp = async () => {
		let uid = await AsyncStorage.getItem('user');
		setMe(uid);

		await populateComments(post.comments);
	};

	const populateComments = async (comments) => {
		if (typeof comments == 'undefined' || comments == false) return;
		comments = Object.entries(comments);

		if (comments.length > 1) {
			comments.sort((a, b) => {
				return b[1] - a[1];
			});
		}

		let commentList = [];
		for (let comment of comments) {
			let data =
				(await readData(`prayer_circle/comments/${comment[0]}`)) || {};
			commentList.push([comment[0], data]);
		}
		await setCommentData(commentList);
	};

	const postComment = async () => {
		if (newComment.length > 0) {
			//get current comments
			let currentComments =
				(await readData(`prayer_circle/posts/${post.id}/comments`)) ||
				{};

			//prep data
			let commentId = generateId();
			let timestamp = Date.now();
			let displayName = await AsyncStorage.getItem('name');
			let comment = {
				content: newComment,
				edited: false,
				timestamp: timestamp,
				user: me,
				username: displayName
			};

			//write data
			await writeData(
				`prayer_circle/posts/${post.id}/comments/${commentId}`,
				timestamp,
				true
			);
			await writeData(
				`prayer_circle/users/${me}/private/comments/${commentId}`,
				true,
				true
			);
			await writeData(
				`prayer_circle/comments/${commentId}`,
				comment,
				true
			);
			//clear input
			setNewComment('');
			newCommentRef.current.clear();

			currentComments[commentId] = timestamp;
			//render new comment
			await populateComments(currentComments);
		}
	};

	useEffect(() => {
		setUp();
	}, []);

	return (
		<StyledPressable className='w-full max-w-[500px]'>
			<StyledView className='flex flex-col justify-start items-center w-full bg-[#EBEBEB0D] border border-[#6666660D] rounded-[20px] h-auto pt-[10px] my-[5px]'>
				<StyledPressable
					onPressIn={() => {
						const now = Date.now();
						if (lastTap && now - lastTap < 300) {
							clearTimeout(timer.current);
							toggleIcon();
						} else {
							setLastTap(now);
							timer.current = setTimeout(() => {}, 300);
						}
					}}
					onLongPress={() => {
						toggleToolbar();
					}}
				>
					<StyledView className='w-full flex flex-row justify-between px-[10px]'>
						<StyledView className=' w-[88%]'>
							<StyledView className='flex flex-row mb-2 '>
								<StyledImage
									className={`${
										post.owned ? 'hidden' : 'flex'
									} rounded-lg`}
									style={{ width: 44, height: 44 }}
									source={{
										uri: post.img
									}}
								/>
								<StyledView
									className={`${post.owned ? '' : 'ml-2'}`}
								>
									<StyledText className='text-offwhite font-bold text-[20px]'>
										{post.title?.length > 21
											? post.title.substring(0, 21) +
											  '...'
											: post.title}
									</StyledText>
									<StyledView className='flex flex-row'>
										<StyledText
											className={`${
												post.owned ? 'hidden' : ''
											} text-white`}
										>
											{post.user} •{' '}
										</StyledText>
										<StyledText className={`text-white`}>
											{tS}{' '}
										</StyledText>
										<StyledText
											className={`${
												post.edited ? 'flex' : 'hidden'
											} text-white`}
										>
											(edited){post.edited}
										</StyledText>
									</StyledView>
								</StyledView>
							</StyledView>
							<StyledView className='flex flex-row items-center w-[95%]'>
								<StyledText className='text-white mt-[2px] pb-[10px]'>
									{post.content?.length > 300
										? post.content.substring(0, 297) + '...'
										: post.content}
								</StyledText>
							</StyledView>
						</StyledView>
						<StyledView className='flex flex-col w-[12%] items-center justify-between'>
							<StyledPressable
								className='rounded-full aspect-square flex items-center justify-center' // bg-radial gradient??
								onPress={toggleIcon}
							>
								<AnimatedImage
									className='w-[26px] h-[26px]'
									style={{
										transform: [{ scale: iconAnimation }]
									}}
									source={getTypeSource(
										iconType,
										post.owned
											? false
											: iconType.includes('outline')
									)}
								/>
							</StyledPressable>
							<StyledPressable
								className='flex items-center justify-center w-[39px] aspect-square mb-[2px]'
								onPress={() => {
									toggleToolbar();
								}}
							>
								<AnimatedImage
									className='w-[32px] h-[32px]'
									style={spiralStyle}
									source={require('../assets/spiral/spiral.png')}
								/>
							</StyledPressable>
						</StyledView>
					</StyledView>
				</StyledPressable>
				<StyledAnimatedView
					style={toolbarStyle}
					className='px-[10px] w-full overflow-hidden'
				>
					<StyledView className='w-full overflow-hidden rounded-full bg-offblack border border-outline'>
						<StyledView className='flex flex-row justify-around items-center w-full h-[49px]'>
							{post.owned || post.ownedToolBar ? (
								<>
									<StyledOpacity
										className='flex items-center justify-center w-[30px] h-[30px]'
										activeOpacity={0.4}
										onPress={deletePost}
									>
										<StyledIcon
											name={'trash-outline'}
											size={29}
											color='#CC2500'
										/>
									</StyledOpacity>
									<StyledOpacity
										className='flex items-center justify-center w-[30px] h-[30px]'
										activeOpacity={0.4}
									>
										<StyledIcon
											name={'cog-outline'}
											size={29}
											color='#F9A826'
										/>
									</StyledOpacity>
									<StyledOpacity
										className='flex items-center justify-center w-[30px] h-[30px]'
										activeOpacity={0.4}
									>
										<StyledIcon
											name={'create-outline'}
											size={29}
											color='#00A55E'
										/>
									</StyledOpacity>
								</>
							) : (
								<>
									<StyledOpacity
										className='flex items-center justify-center w-[30px] h-[30px]'
										activeOpacity={0.4}
									>
										<StyledIcon
											name={'flag-outline'}
											size={29}
											color='#CC2500'
										/>
									</StyledOpacity>
									<StyledOpacity
										className='flex items-center justify-center w-[30px] h-[30px]'
										activeOpacity={0.4}
										onPressOut={() => hidePost(post.id)}
									>
										<StyledIcon
											name={'eye-off-outline'}
											size={29}
											color='#F9A826'
										/>
									</StyledOpacity>
									<StyledOpacity
										className='flex items-center justify-center w-[30px] h-[30px]'
										activeOpacity={0.4}
									>
										<StyledIcon
											name={'bookmark-outline'}
											size={29}
											color='#00A55E'
										/>
									</StyledOpacity>
								</>
							)}
							<StyledOpacity
								className='flex items-center justify-center w-[30px] h-[30px]'
								activeOpacity={0.4}
								onPress={() => {
									Haptics.impactAsync(
										Haptics.ImpactFeedbackStyle.Light
									);
									handlePresentModalPress();
								}}
							>
								<StyledIcon
									name={'chatbubble-outline'}
									size={29}
									color='#5946B2'
								/>
							</StyledOpacity>
							<StyledOpacity
								className='flex w-[29px] h-[29px] border-2 border-offwhite rounded-full justify-center'
								activeOpacity={0.4}
								onPress={() => {}}
							/>
						</StyledView>
					</StyledView>
				</StyledAnimatedView>
			</StyledView>
			<BottomSheetModal
				enableDismissOnClose={true}
				ref={bottomSheetModalRef}
				index={0}
				snapPoints={snapPoints}
				onChange={handleSheetChanges}
				handleComponent={handle}
				backdropComponent={(backdropProps) => backdrop(backdropProps)}
				keyboardBehavior='extend'
			>
				<StyledView className='flex-1 bg-grey'>
					<StyledView className='w-full h-auto flex items-center my-3'>
						<StyledInput
							className='w-[90%] min-h-[40px] bg-[#ffffff11] rounded-[10px] pl-3 pr-[50px] py-3 text-white text-[16px]'
							placeholder='Write a comment...'
							placeholderTextColor='#ffffff66'
							multiline={true}
							scrollEnabled={false}
							ref={newCommentRef}
							onChangeText={(text) => {
								setNewComment(text);
							}}
						/>
						<StyledOpacity
							className='absolute top-[10px] right-[8%]'
							onPress={async () => {
								Keyboard.dismiss();
								await postComment();
							}}
						>
							<StyledText className='text-green font-[500] text-[18px]'>
								Post
							</StyledText>
						</StyledOpacity>
					</StyledView>
					<BottomSheetFlatList
						data={commentData}
						contentContainerStyle={{
							display: 'flex',
							flexDirection: 'column',
							justifyContent: 'center',
							alignItems: 'center',
							width: '100%'
						}}
						refreshControl={
							<RefreshControl
								onRefresh={() => {
									console.log('getting comments');
									{
										/* TODO: add refresh button that will pull new comments from db */
									}
								}}
								refreshing={false}
								tintColor='#ebebeb'
							/>
						}
						renderItem={({ item }) => {
							return (
								<Comment
									id={item[0]}
									user={item[1].user}
									username={item[1].username}
									content={item[1].content}
									edited={item[1].edited}
									timestamp={item[1].timestamp}
									img={item[1].img}
								/>
							);
						}}
						keyExtractor={(item) => item[0]}
					/>
				</StyledView>
			</BottomSheetModal>
		</StyledPressable>
	);
};
