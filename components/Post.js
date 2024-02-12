import React, { useState, useRef, useEffect, useCallback } from 'react';
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
	TouchableWithoutFeedback
} from 'react-native';
import { styled } from 'nativewind';
import Ionicons from '@expo/vector-icons/Ionicons';
import { timeSince } from '../backend/functions';
import { writeData, readData, generateId } from '../backend/firebaseFunctions';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Haptics from 'expo-haptics';
import { BottomSheetModal, BottomSheetFlatList } from '@gorhom/bottom-sheet';
import { Comment } from './Comment';
import { useStore } from '../app/global';
/* import { PostTypeSelector } from './PostTypeSelector'; */
import { Button } from './Buttons';
import CachedImage from 'expo-cached-image';
import shorthash from 'shorthash';
import { backdrop, handle, SnapPoints } from './BottomSheetModalHelpers';
import { auth } from '../backend/config';
import { formatDateAndTime } from '../backend/functions';

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
	const [iconType, setIconType] = useState(`${post.icon}_outline`);
	const iconAnimation = useRef(new Animated.Value(1)).current;
	const [toolbarShown, setToolbar] = useState(false);
	const [lastTap, setLastTap] = useState(null);
	const [commentData, setCommentData] = useState([]);
	const [newComment, setNewComment] = useState('');
	const [setGlobalReload, setJournalReload] = useStore((state) => [
		state.setGlobalReload,
		state.setJournalReload
	]);
	const [bottomSheetType, setBottomSheetType] = useState('');
	const [editTitle, setEditTitle] = useState(post.title);
	const [editContent, setEditContent] = useState(post.content);
	const [title, setTitle] = useState(post.title);
	const [content, setContent] = useState(post.content);
	const [edited, setEdited] = useState(post.edited);
	const [userData, setUserData] = useState(auth?.currentUser);
	const [bookmarked, setBookmarked] = useState(false);
	const [eventDate, setEventDate] = useState('');
	const newCommentRef = useRef(null);
	const timer = useRef(null);
	const bottomSheetModalRef = useRef(null);
	const typeRef = useRef(null);
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
	const tS = timeSince(post.timestamp);

	// bottom sheet modal
	const handlePresentModalPress = useCallback(() => {
		bottomSheetModalRef.current?.present();
	}, []);

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

	const commentsView = () => {
		return (
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
						<StyledIcon
							name='send'
							size={30}
							className='text-green'
						/>
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
								username={item[1].name}
								content={item[1].content}
								edited={item[1].edited}
								timestamp={item[1].timestamp}
								img={item[1].profile_img}
							/>
						);
					}}
					keyExtractor={(item) => item[0]}
				/>
			</StyledView>
		);
	};

	const editView = () => {
		return (
			<TouchableWithoutFeedback onPress={Keyboard.dismiss}>
				<StyledView className='flex-1 bg-grey'>
					<StyledView className='flex flex-col w-screen items-center py-4 px-[20px]'>
						<StyledInput
							className='bg-offblack text-[18px] w-full text-offwhite border border-outline rounded-lg px-3 py-[10px]'
							placeholder={'Title'}
							placeholderTextColor={'#ffffff40'}
							inputMode='text'
							autoCorrect
							maxLength={39}
							defaultValue={editTitle}
							onChangeText={(text) => {
								setEditTitle(text);
							}}
						/>
						<StyledInput
							className='bg-offblack text-[18px] w-full min-h-[100px] h-[200px] max-h-[400px] text-offwhite border border-outline rounded-lg px-3 py-[10px] my-2'
							placeholder={'Write a Post'}
							multiline
							autoCorrect
							autoCapitalize='sentences'
							placeholderTextColor={'#ffffff40'}
							inputMode='text'
							maxLength={500}
							defaultValue={editContent}
							onChangeText={(text) => {
								setEditContent(text);
							}}
						/>
						{/* <PostTypeSelector ref={typeRef} /> TODO: add functionality */}
						<StyledView className='w-full flex flex-row justify-between'>
							<Button
								title='Cancel'
								btnStyles={'bg-grey border-2 border-offwhite'}
								textStyles={'text-offwhite'}
								width={'w-[48%]'}
								press={() => {
									bottomSheetModalRef.current?.dismiss();
									setEditTitle(post.title);
									setEditContent(post.content);
								}}
							/>
							<Button
								title='Save'
								width={'w-[48%]'}
								press={editPost}
							/>
						</StyledView>
					</StyledView>
				</StyledView>
			</TouchableWithoutFeedback>
		);
	};

	const ToolbarButton = (props) => {
		return (
			<StyledOpacity
				className='flex items-center justify-center w-[30px] h-[30px]'
				activeOpacity={0.4}
				onPress={() => {
					Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
					if (props.onPress) props.onPress();
				}}
			>
				<StyledIcon
					name={props.icon}
					size={props.size}
					color={props.color}
				/>
			</StyledOpacity>
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
		for (let circle of Object.keys(post.data.circles)) {
			await writeData(
				`prayer_circle/circles/${circle}/posts/${post.id}`,
				null,
				true
			);
		}
		await writeData(
			`prayer_circle/users/${userData.uid}/private/posts/${post.id}`,
			null,
			true
		);
		await writeData(`prayer_circle/posts/${post.id}`, null, true);
		setTimeout(() => {
			setGlobalReload(true);
		}, 100);
	}

	async function hidePost() {
		writeData(
			`prayer_circle/posts/${post.id}/hidden/${userData.uid}`,
			true,
			true
		);
		writeData(
			`prayer_circle/users/${userData.uid}/private/hidden_posts/${post.id}`,
			true,
			true
		);
		toggleToolbar();

		setGlobalReload(true);
	}

	const toggleBookmark = async (postId, postData) => {
		try {
			// Check if the post ID already exists in AsyncStorage
			const storedPosts = await AsyncStorage.getItem('bookmarkedPosts');
			const existingPosts = storedPosts ? JSON.parse(storedPosts) : [];

			const postIndex = existingPosts.findIndex(
				(post) => post.id === postId
			);

			if (postIndex !== -1) {
				// Post exists, remove it
				existingPosts.splice(postIndex, 1);
				await AsyncStorage.setItem(
					'bookmarkedPosts',
					JSON.stringify(existingPosts)
				);
				setBookmarked(false);
			} else {
				// Post doesn't exist, add it
				const newPost = { id: postId, data: postData };
				existingPosts.push(newPost);
				await AsyncStorage.setItem(
					'bookmarkedPosts',
					JSON.stringify(existingPosts)
				);
				setBookmarked(true);
			}
			setJournalReload(true);
		} catch (error) {
			console.error('Error toggling bookmark:', error.message);
		}
	};

	async function editPost() {
		let updatedData = post.data;

		updatedData.title = editTitle;
		setTitle(editTitle);

		updatedData.text = editContent;
		setContent(editContent);

		updatedData.edited = true;
		setEdited(true);

		writeData(`prayer_circle/posts/${post.id}`, updatedData, true);

		bottomSheetModalRef.current?.dismiss();
		setTimeout(() => {
			setGlobalReload(true);
		}, 100);
	}

	// post setup
	const setUp = async (postId) => {
		try {
			// Check if the post ID already exists in AsyncStorage
			const storedPosts = await AsyncStorage.getItem('bookmarkedPosts');
			const existingPosts = storedPosts ? JSON.parse(storedPosts) : [];

			let keys = [];

			existingPosts.forEach((post) => {
				keys.push(post.id);
			});

			if (keys.includes(postId)) {
				setBookmarked(true);
			}
		} catch (error) {
			console.error('Error toggling bookmark:', error.message);
		}

		if (post.icon == 'event') getEventDate();
		await populateComments(post.comments);
	};

	const getEventDate = () => {
		const start = formatDateAndTime(post?.data?.metadata?.start);
		const end = formatDateAndTime(post?.data?.metadata?.end);
		let date = '';

		console.log(start.split(', ')[0]);
		if (start === end) {
			date = start;
		} else if (start.split(', ')[0] === end.split(', ')[0]) {
			date = `${start.split(', ')[0]}, ${start.split(', ')[1]} - ${
				end.split(', ')[1]
			}`;
		}

		setEventDate(date);
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
			let comment = {
				content: newComment,
				edited: false,
				timestamp: timestamp,
				user: userData.uid,
				name: userData.displayName,
				profile_img: userData.photoURL
			};

			//write data
			await writeData(
				`prayer_circle/posts/${post.id}/comments/${commentId}`,
				timestamp,
				true
			);
			await writeData(
				`prayer_circle/users/${userData.uid}/private/comments/${commentId}`,
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
		setUp(post.id);
	}, []);
	useEffect(() => {
		setUserData(auth?.currentUser);
	}, [auth]);

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
								<CachedImage
									cacheKey={shorthash.unique(post.img)}
									style={{
										width: 44,
										height: 44,
										borderRadius: 8,
										display: post.owned ? 'none' : 'flex'
									}}
									source={{
										uri: post.img,
										expiresIn: 2_628_288
									}}
								/>
								<StyledView
									className={`${post.owned ? '' : 'ml-2'}`}
								>
									<StyledText className='text-offwhite font-bold text-[20px]'>
										{title?.length > 21
											? title.substring(0, 21) + '...'
											: title}
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
												edited ? '' : 'hidden'
											} text-white`}
										>
											(edited)
										</StyledText>
									</StyledView>
								</StyledView>
							</StyledView>
							{post.icon == 'event' && (
								<StyledView className='flex flex-row items-center mb-2'>
									<StyledText className='text-white font-bold text-[16px]'>
										{eventDate}
									</StyledText>
								</StyledView>
							)}
							<StyledView className='flex flex-row items-center w-[95%]'>
								<StyledText className='text-white mt-[2px] pb-[10px]'>
									{content?.length > 300
										? content.substring(0, 297) + '...'
										: content}
								</StyledText>
							</StyledView>
						</StyledView>
						<StyledView className='flex flex-col w-[15%] items-center justify-between'>
							<StyledPressable
								className='rounded-full aspect-square flex items-center justify-center'
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
									<ToolbarButton
										icon={'trash-outline'}
										color={'#CC2500'}
										size={29}
										onPress={() => {
											deletePost();
										}}
									/>
									<ToolbarButton
										icon={'cog-outline'}
										size={29}
										color='#F9A826'
										onPress={() => {}}
									/>
									<ToolbarButton
										icon={'create-outline'}
										size={29}
										color='#00A55E'
										onPress={() => {
											setBottomSheetType('Edit');
											handlePresentModalPress();
										}}
									/>
								</>
							) : (
								<>
									<ToolbarButton
										icon={'flag-outline'}
										size={29}
										color='#CC2500'
										onPress={() => {}}
									/>
									<ToolbarButton
										icon={'eye-off-outline'}
										size={29}
										color='#F9A826'
										onPress={() => {
											hidePost();
										}}
									/>
									<ToolbarButton
										icon={
											bookmarked
												? 'bookmark'
												: 'bookmark-outline'
										}
										size={29}
										color='#00A55E'
										onPress={() => {
											toggleBookmark(post.id, post.data);
										}}
									/>
								</>
							)}
							<ToolbarButton
								icon={'chatbubble-outline'}
								size={29}
								color='#5946B2'
								onPress={() => {
									setBottomSheetType('Comments');
									handlePresentModalPress();
								}}
							/>
							<StyledOpacity
								className='flex w-[29px] h-[29px] border-2 border-offwhite rounded-full justify-center'
								activeOpacity={0.4}
								onPress={() => {
									Haptics.impactAsync(
										Haptics.ImpactFeedbackStyle.Light
									);
									/* TODO: Implment modal on press that displays all the circles a post is in OR filter to circle */
								}}
							/>
						</StyledView>
					</StyledView>
				</StyledAnimatedView>
			</StyledView>
			<BottomSheetModal
				enableDismissOnClose={true}
				ref={bottomSheetModalRef}
				index={0}
				snapPoints={SnapPoints(['85%'])}
				handleComponent={() => handle(bottomSheetType)}
				backdropComponent={(backdropProps) => backdrop(backdropProps)}
				keyboardBehavior='extend'
			>
				{bottomSheetType === 'Comments' && commentsView()}
				{bottomSheetType === 'Edit' && editView()}
			</BottomSheetModal>
		</StyledPressable>
	);
};
