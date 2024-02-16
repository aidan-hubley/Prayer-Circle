import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
	Text,
	View,
	Image,
	Pressable,
	TouchableOpacity,
	Animated,
	TextInput,
	Keyboard,
	TouchableWithoutFeedback,
	Dimensions,
	TouchableHighlight
} from 'react-native';
import { styled } from 'nativewind';
import Ionicons from '@expo/vector-icons/Ionicons';
import { timeSince, formatDateAndTime } from '../backend/functions';
import {
	writeData,
	readData,
	generateId,
	getFilterCircles,
	getCircles
} from '../backend/firebaseFunctions';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Haptics from 'expo-haptics';
import { BottomSheetModal, BottomSheetFlatList } from '@gorhom/bottom-sheet';
import { Comment } from './Comment';
import { useStore } from '../app/global';
import { PostTypeSelector } from './PostTypeSelector';
import { Button } from './Buttons';
import CachedImage from 'expo-cached-image';
import shorthash from 'shorthash';
import { backdrop, handle, SnapPoints } from './BottomSheetModalHelpers';
import { auth } from '../backend/config';
import { Interaction } from '../components/Interaction';
import { decrypt, encrypt } from 'react-native-simple-encryption';

const StyledImage = styled(Image);
const StyledView = styled(View);
const StyledText = styled(Text);
const StyledPressable = styled(Pressable);
const StyledOpacity = styled(TouchableOpacity);
const StyledAnimatedView = styled(Animated.createAnimatedComponent(View));
const AnimatedImage = Animated.createAnimatedComponent(StyledImage);
const StyledIcon = styled(Ionicons);
const StyledInput = styled(TextInput);
const StyledAnimatedHighlight =
	Animated.createAnimatedComponent(TouchableHighlight);
const titleCharThreshold = 20;
const contentCharThreshold = 300;

export const Post = (post) => {
	// variables
	const [title, setTitle] = useState(decrypt(post.id, post.title));
	const [content, setContent] = useState(decrypt(post.id, post.content));
	const [icon, setIcon] = useState(post.icon);
	const [interacted, setInteracted] = useState(false);
	const [interactions, setInteractions] = useState([]);
	const iconAnimation = useRef(new Animated.Value(1)).current;
	const [toolbarShown, setToolbar] = useState(false);
	const [lastTap, setLastTap] = useState(null);
	const [commentData, setCommentData] = useState([]);
	const [newComment, setNewComment] = useState('');
	const [
		haptics,
		setGlobalReload,
		setJournalReload,
		setFilter,
		setFilterName,
		setFilterIcon,
		setFilterColor,
		setFilterIconColor
	] = useStore((state) => [
		state.haptics,
		state.setGlobalReload,
		state.setJournalReload,
		state.setFilter,
		state.setFilterName,
		state.setFilterIcon,
		state.setFilterColor,
		state.setFilterIconColor
	]);
	const [bottomSheetType, setBottomSheetType] = useState('');
	const [editTitle, setEditTitle] = useState(decrypt(post.id, post.title));
	const [editContent, setEditContent] = useState(
		decrypt(post.id, post.content)
	);
	const [edited, setEdited] = useState(post.edited);
	const [reported, setReported] = useState(false);
	const [userData, setUserData] = useState(auth?.currentUser);
	const [bookmarked, setBookmarked] = useState(false);
	const [eventDate, setEventDate] = useState('');
	const [circles, setCircles] = useState([]);
	const newCommentRef = useRef(null);
	const [isExpanded, setIsExpanded] = useState(false);
	const [isToggleVisible, setIsToggleVisible] = useState(
		title.length > titleCharThreshold ||
			content.length > contentCharThreshold
	);
	const [snapPoints, setSnapPoints] = useState([]);
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

	const isTextTruncated = (text) => {
		return text && text.length > 300;
	};

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
	const iconInter = iconAnimation.interpolate({
		inputRange: [0, 0.5, 1],
		outputRange: [1, 1.6, 1]
	});

	const spiralStyle = {
		transform: [{ rotate: spinInter }]
	};

	const handleExpanded = () => {
		setIsExpanded((prevState) => !prevState);
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
					renderItem={({ item }) => {
						return (
							<Comment
								id={item[0]}
								user={item[1].user}
								name={item[1].name}
								content={item[1].content}
								edited={item[1].edited}
								timestamp={item[1].timestamp}
								img={item[1].profile_img}
							/>
						);
					}}
					ListEmptyComponent={() => {
						return (
							<StyledView
								className='flex-1 justify-center items-center'
								style={{
									height:
										Dimensions.get('window').height - 350
								}}
							>
								<StyledText className='text-white text-[24px]'>
									No Comments
								</StyledText>
							</StyledView>
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
						<StyledView className='bg-offblack rounded-full mx-[10px] mb-3'>
							<PostTypeSelector
								noYMargin
								initialValue={
									post?.data?.type === 'praise'
										? 0
										: post?.data?.type === 'request'
										? 1
										: 2
								}
								ref={typeRef}
							/>
						</StyledView>
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

	const circlesView = () => {
		return (
			<StyledView className='flex-1 bg-grey'>
				<BottomSheetFlatList
					data={circles}
					keyExtractor={(item) => item.id}
					contentContainerStyle={{
						paddingVertical: 20,
						paddingHorizontal: 12,
						alignItems: 'center'
					}}
					numColumns={3}
					renderItem={({ item }) => {
						const vw = Dimensions.get('window').width;
						return (
							<StyledView
								className='items-center justify-around my-[10px]'
								style={{ width: vw / 3 - 8 }}
							>
								<StyledText className=' text-white text-[18px] font-[600] text-center  pb-2'>
									{item.title}
								</StyledText>
								<StyledAnimatedHighlight
									style={[
										{
											borderColor: item.color
										}
									]}
									className='flex border-[6px] items-center justify-center rounded-full w-[85px] aspect-square'
									onPress={() => {
										bottomSheetModalRef.current.dismiss();
										setFilter(item.id);
										setFilterName(item.title);
										setFilterIcon(item.icon);
										setFilterColor(item.color);
										setFilterIconColor(item.iconColor);
									}}
								>
									<StyledIcon
										name={item.icon}
										size={45}
										color={item.iconColor || item.color}
									/>
								</StyledAnimatedHighlight>
							</StyledView>
						);
					}}
				/>
			</StyledView>
		);
	};

	const interactionsView = () => {
		return (
			<StyledView className='flex-1 bg-grey'>
				<BottomSheetFlatList
					data={interactions}
					contentContainerStyle={{
						display: 'flex',
						flexDirection: 'column',
						justifyContent: 'center',
						alignItems: 'center',
						width: '100%'
					}}
					ItemSeparatorComponent={() => {
						return (
							<StyledView className='w-[90%] h-[1px] bg-offwhite' />
						);
					}}
					renderItem={({ item }) => {
						return (
							<Interaction
								name={item.fname + ' ' + item.lname}
								image={item.profile_img}
							/>
						);
					}}
					ListEmptyComponent={() => {
						return (
							<StyledView
								className='flex-1 justify-center items-center'
								style={{
									height:
										Dimensions.get('window').height - 250
								}}
							>
								<StyledText className='text-white text-[24px]'>
									No Interactions
								</StyledText>
							</StyledView>
						);
					}}
					keyExtractor={(item) => item.profile_img}
				/>
			</StyledView>
		);
	};

	const reportView = () => {
		const reportItem = (text, first, last, onPress) => {
			return (
				<TouchableHighlight
					activeOpacity={0.6}
					underlayColor='#3D3D3D'
					onPress={() => {
						if (onPress) onPress();
						else reportPost(text);
						setReported(true);
					}}
					className={`w-full h-[60px] justify-center pl-4 ${
						first && 'rounded-t-[20px]'
					} ${last ? 'rounded-b-[20px]' : 'border-b border-outline'}`}
				>
					<Text className='text-offwhite text-[18px]'>{text}</Text>
				</TouchableHighlight>
			);
		};

		return (
			<StyledView className='flex-1 bg-grey px-[20px] pt-[10px]'>
				<View className='w-full bg-[#292929] rounded-[20px]'>
					{reportItem("I don't like this post", true)}
					{reportItem("It's spam")}
					{reportItem("It's inappropriate")}
					{reportItem('Hate speech or symbols')}
					{reportItem('Bullying or harassment')}
					{reportItem('Hate speech or symbols')}
					{reportItem('Other', false, true)}
				</View>
			</StyledView>
		);
	};

	const ToolbarButton = (props) => {
		return (
			<StyledOpacity
				className='flex items-center justify-center w-[30px] h-[30px]'
				activeOpacity={0.4}
				onPress={() => {
					if (haptics)
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
	function getIconSource(iconType, interacted) {
		const iconKey = iconType.replace('_outline', '');
		if (!['praise', 'event', 'request', 'prayer'].includes(iconKey)) {
			console.error(`Invalid icon type: ${iconType}`);
			return;
		}
		if (post.owned || post.ownedToolBar) {
			return images[iconKey].nonOutline;
		}
		return !interacted
			? images[iconKey].outline
			: images[iconKey].nonOutline;
	}

	function toggleIcon() {
		let now = Date.now();
		if (haptics) Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
		Animated.spring(iconAnimation, {
			toValue: interacted ? 1 : 0,
			duration: 100,
			useNativeDriver: false
		}).start();
		writeData(
			`prayer_circle/posts/${post.id}/interacted/${userData.uid}`,
			!interacted ? now : null,
			true
		);
		setInteracted(!interacted);
	}

	function toggleToolbar() {
		if (haptics) Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
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

		updatedData.title = encrypt(post.id, editTitle);
		setTitle(editTitle);

		updatedData.body = encrypt(post.id, editContent);
		setContent(editContent);

		updatedData.edited = true;
		setEdited(true);

		let typeVal = Math.round(Math.abs(typeRef.current.selected._value));
		if (typeVal == 0) updatedData.type = 'praise';
		else if (typeVal == 1) updatedData.type = 'request';
		else if (typeVal == 2) updatedData.type = 'event';
		setIcon(updatedData.type);

		writeData(`prayer_circle/posts/${post.id}`, updatedData, true);

		bottomSheetModalRef.current?.dismiss();
	}

	async function reportPost(reason) {
		let reportData = {
			reporter: userData.uid,
			reason: reason,
			timestamp: Date.now(),
			title: title,
			body: content
		};
		writeData(`prayer_circle/posts/${post.id}/reports/`, reportData);
		writeData(
			`prayer_circle/users/${userData.uid}/private/reports/${post.id}`,
			true,
			true
		);
		alert('Post has been reported.');
		bottomSheetModalRef.current?.dismiss();
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

		if (post.icon === 'event') getEventDate();

		await populateComments(post.comments);

		let interactions =
			(await readData(`prayer_circle/posts/${postId}/interacted`)) || {};

		if (!post.owned && !post.ownedToolBar) {
			if (interactions[userData.uid]) {
				setInteracted(true);
			}
		} else {
			interactions = Object.keys(interactions);
			interactions.sort((a, b) => {
				return b[1] - a[1];
			});
			let interactionsData = [];
			for (let interaction of interactions) {
				let data = await readData(
					`prayer_circle/users/${interaction}/public`
				);
				interactionsData.push(data);
			}
			setInteractions(interactionsData);
		}

		setReported(
			Object.values(post.reports || {})[0]?.reporter === userData.uid
		);
		let circlesData = [];
		let userCircles = await getCircles();
		for (let circle of Object.keys(post.data.circles)) {
			if (!userCircles.includes(circle)) continue;
			let circleData = await readData(`prayer_circle/circles/${circle}`);
			circleData.id = circle;
			circlesData.push(circleData);
		}
		setCircles(circlesData);
	};

	const getEventDate = () => {
		const start = formatDateAndTime(post?.metadata?.start);
		const end = formatDateAndTime(post?.metadata?.end);
		let date = '';

		if (start === end) {
			date = start;
		} else if (start.split(', ')[0] === end.split(', ')[0]) {
			date = `${start.split(', ')[0]}, ${start.split(', ')[1]}-${
				end.split(', ')[1]
			}`;
		} else {
			date = `${start} - ${end}`;
		}

		setEventDate(date);
	};

	const populateComments = async () => {
		let comments = await readData(
			`prayer_circle/posts/${post.id}/comments`
		);
		if (!comments) return;

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

	useEffect(() => {
		setIsToggleVisible(
			title.length > titleCharThreshold ||
				content.length > contentCharThreshold
		);
	}, [title, content]);

	return (
		<StyledPressable className='w-full max-w-[500px]'>
			<StyledView className='flex flex-col justify-start items-center w-full bg-[#EBEBEB0D] border border-[#6666660D] rounded-[20px] h-auto pt-[8px] my-[5px]'>
				<StyledPressable
					onPressIn={() => {
						const now = Date.now();
						if (lastTap && now - lastTap < 300) {
							clearTimeout(timer.current);
							if (post.owned || post.ownedToolBar) {
								setBottomSheetType('Interactions');
								setSnapPoints(['85%']);
								handlePresentModalPress();
							} else {
								toggleIcon();
							}
						} else {
							setLastTap(now);
							timer.current = setTimeout(() => {}, 300);
						}
					}}
					onLongPress={() => {
						toggleToolbar();
					}}
				>
					<StyledView className='w-full flex flex-row justify-between px-[6px]'>
						<StyledView className='w-[90%]'>
							<StyledView className='flex flex-row mb-2'>
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
									className={`${
										post.owned ? 'ml-[10px]' : 'ml-2'
									}`}
								>
									<View
										className={`${
											post.owned
												? 'ml-[10px]'
												: 'ml-[2px]'
										} max-w-[95%]`}
									>
										<StyledText className='text-offwhite font-bold text-[20px]'>
											{isExpanded ||
											title.length <= titleCharThreshold
												? title
												: `${title.substring(
														0,
														titleCharThreshold
												  )}...`}
										</StyledText>
									</View>
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
									<StyledText
										className={`${
											post.owned
												? 'ml-[10px] text-white font-bold text-[16px]'
												: 'text-white font-bold text-[16px]'
										}`}
									>
										{eventDate}
									</StyledText>
								</StyledView>
							)}
							<StyledView className='flex flex-row items-center w-[95%]'>
								<StyledText
									className={`${
										post.owned
											? 'ml-[10px] text-white mt-[2px] pb-[10px]'
											: 'text-white mt-[2px] pb-[10px]'
									}`}
								>
									{isExpanded ||
									content.length <= contentCharThreshold
										? content
										: `${content.substring(
												0,
												contentCharThreshold
										  )}...`}
								</StyledText>
							</StyledView>
						</StyledView>
						<StyledView className='flex flex-col w-[10%] items-end justify-between pr-[6px]'>
							<StyledPressable
								className='flex aspect-square w-[30px] self-end'
								onPress={() => {
									if (!post.owned && !post.ownedToolBar) {
										toggleIcon();
									} else {
										setBottomSheetType('Interactions');
										setSnapPoints(['85%']);
										handlePresentModalPress();
									}
								}}
							>
								<AnimatedImage
									source={getIconSource(icon, interacted)}
									style={{
										width: 26,
										height: 26,
										transform: [{ scale: iconInter }]
									}}
								/>
							</StyledPressable>
							{isToggleVisible && (
								<StyledOpacity
									onPress={handleExpanded}
									className='self-center pt-2'
								>
									<Ionicons
										name={
											isExpanded
												? 'chevron-up'
												: 'chevron-down'
										}
										size={24}
										color='#3D3D3D'
									/>
								</StyledOpacity>
							)}
							<StyledPressable
								className='flex w-[30px] aspect-square justify-end mb-[2px]'
								onPress={() => {
									toggleToolbar();
								}}
							>
								<AnimatedImage
									className='w-[28px] h-[28px]'
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
											setSnapPoints(['85%']);
											handlePresentModalPress();
										}}
									/>
								</>
							) : (
								<>
									<ToolbarButton
										icon={
											reported ? 'flag' : 'flag-outline'
										}
										size={29}
										color='#CC2500'
										onPress={() => {
											setBottomSheetType('Report');
											setSnapPoints(['65%', '85%']);
											handlePresentModalPress();
										}}
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
								onPress={async () => {
									populateComments();
									setBottomSheetType('Comments');
									setSnapPoints(['65%']);
									handlePresentModalPress();
								}}
							/>
							<StyledOpacity
								className='flex w-[29px] h-[29px] border-2 border-offwhite rounded-full justify-center'
								activeOpacity={0.4}
								onPress={() => {
									if (haptics)
										Haptics.impactAsync(
											Haptics.ImpactFeedbackStyle.Light
										);
									setBottomSheetType('All Circles');
									handlePresentModalPress();
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
				snapPoints={snapPoints}
				handleComponent={() => handle(bottomSheetType)}
				backdropComponent={(backdropProps) => backdrop(backdropProps)}
				keyboardBehavior='extend'
			>
				{bottomSheetType === 'Comments' && commentsView()}
				{bottomSheetType === 'Edit' && editView()}
				{bottomSheetType === 'All Circles' && circlesView()}
				{bottomSheetType === 'Interactions' && interactionsView()}
				{bottomSheetType === 'Report' && reportView()}
			</BottomSheetModal>
		</StyledPressable>
	);
};
