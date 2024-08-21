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
	TouchableHighlight,
	Switch,
	Platform
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { timeSince, formatTimestamp } from '../backend/functions';
import { writeData, readData, getCircles } from '../backend/firebaseFunctions';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Haptics from 'expo-haptics';
import { BottomSheetModal, BottomSheetFlatList } from '@gorhom/bottom-sheet';
import { Comment } from './Comment';
import { useStore, notify } from '../app/global';
import { SegmentedControl } from './SegmentedControl';
import { Button } from './Buttons';
import CachedImage from './CachedImage';
import { backdrop, handle } from './BottomSheetModalHelpers';
import { auth, firestore } from '../backend/config';
import { Interaction } from '../components/Interaction';
import { decrypt, encrypt } from 'react-native-simple-encryption';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Pulsating } from './Loading';
import { router } from 'expo-router';
import {
	collection,
	doc,
	Timestamp,
	addDoc,
	getDocs,
	orderBy,
	deleteDoc,
	updateDoc,
	setDoc
} from 'firebase/firestore';
import { query } from 'firebase/database';
import {
	default as ReAnimated,
	useSharedValue,
	withTiming,
	useAnimatedStyle,
	FadeIn,
	FadeOut,
	withSequence
} from 'react-native-reanimated';

const AnimatedImage = Animated.createAnimatedComponent(Image);
const StyledAnimatedHighlight =
	Animated.createAnimatedComponent(TouchableHighlight);

const AnimatedPressable = ReAnimated.createAnimatedComponent(Pressable);

export const Post = (post) => {
	const [data, setData] = useState(null);

	// variables
	const [title, setTitle] = useState('');
	const [content, setContent] = useState('');
	const [icon, setIcon] = useState(post.icon);
	const [interacted, setInteracted] = useState(false);
	const [interactions, setInteractions] = useState([]);
	const iconAnimation = useRef(new Animated.Value(1)).current;
	const [toolbarShown, setToolbar] = useState(false);
	const ownedToolbar = post.user === auth?.currentUser?.uid;
	const [lastTap, setLastTap] = useState(null);
	const [commentData, setCommentData] = useState([]);
	const [newComment, setNewComment] = useState('');
	const [interactionVisibility, setInteractionVisibility] = useState(false);
	const [commentsEnabled, setCommentsEnabled] = useState(false);
	const [editTitle, setEditTitle] = useState('');
	const [editContent, setEditContent] = useState('');
	const [editIcon, setEditIcon] = useState(post.icon);
	const [edited, setEdited] = useState(post.edited || false);
	const [
		haptics,
		setGlobalReload,
		setJournalReload,
		setFilter,
		setFilterName,
		setFilterIcon,
		setFilterColor,
		setFilterIconColor,
		setOtherUserID
	] = useStore((state) => [
		state.haptics,
		state.setGlobalReload,
		state.setJournalReload,
		state.setFilter,
		state.setFilterName,
		state.setFilterIcon,
		state.setFilterColor,
		state.setFilterIconColor,
		state.setOtherUserID
	]);
	const [bottomSheetType, setBottomSheetType] = useState('');
	const [reported, setReported] = useState(false);
	const [bookmarked, setBookmarked] = useState(false);
	const [eventDate, setEventDate] = useState('');
	const [circles, setCircles] = useState([]);
	const [isExpanded, setIsExpanded] = useState(false);
	const [snapPoints, setSnapPoints] = useState(['85%']);
	const timer = useRef(null);
	const bottomSheetModalRef = useRef(null);
	const newCommentRef = useRef(null);
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
		},
		announcement: {
			outline: require('../assets/post/announcement_outline.png'),
			nonOutline: require('../assets/post/announcement.png')
		},
		thought: {
			outline: require('../assets/post/thought_outline.png'),
			nonOutline: require('../assets/post/thought.png')
		}
	};
	let insets = useSafeAreaInsets();

	const titleCharThreshold = Dimensions.get('window').width / 16;
	const contentCharThreshold = 300;

	// bottom sheet modal
	const handlePresentModalPress = useCallback(() => {
		bottomSheetModalRef.current?.present();
	}, []);

	// animations
	const toolbarHeight = useSharedValue(0);
	const toolbarMargin = useSharedValue(0);
	const iconScale = useSharedValue(1);

	const toolbarStyle = useAnimatedStyle(() => {
		return {
			height: toolbarHeight.value,
			marginTop: 4,
			marginBottom: toolbarMargin.value
		};
	});
	const iconStyle = useAnimatedStyle(() => {
		return {
			width: 26,
			height: 26,
			transform: [{ scale: iconScale.value }]
		};
	});

	const spinVal = useSharedValue(0);
	const spinStyle = useAnimatedStyle(() => {
		return {
			transform: [{ rotate: `${spinVal.value}deg` }]
		};
	});
	const toggleToolbar = () => {
		if (haptics) Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
		setToolbar(!toolbarShown);
		spinVal.value = withTiming(toolbarShown ? 0 : 180, {
			duration: 300
		});
		toolbarMargin.value = withTiming(toolbarShown ? 0 : 8, {
			duration: 500
		});
		toolbarHeight.value = withTiming(toolbarShown ? 0 : 51);
	};

	// bottom sheet contents
	const commentsView = () => {
		return (
			<View className='flex-1 bg-grey'>
				<View className='w-full h-auto flex items-center my-3 px-4'>
					<TextInput
						className='w-full min-h-[40px] bg-[#ffffff11] rounded-[10px] pl-3 pr-[50px] py-3 text-white text-[16px]'
						placeholder='Write a comment...'
						placeholderTextColor='#ffffff66'
						multiline={true}
						scrollEnabled={false}
						ref={newCommentRef}
						onChangeText={(text) => {
							setNewComment(text);
						}}
					/>
					<TouchableOpacity
						className='absolute top-[7px] right-[21px] h-[30px] w-[30px] justify-center items-center bg-green rounded-[8px]'
						onPress={async () => {
							Keyboard.dismiss();
							await postComment();
						}}
					>
						<Ionicons
							name='send'
							size={18}
							color={'rgb(255 251 252)'}
						/>
					</TouchableOpacity>
				</View>
				<BottomSheetFlatList
					data={commentData}
					contentContainerStyle={{
						display: 'flex',
						flexDirection: 'column',
						alignItems: 'center',
						width: '100%'
					}}
					renderItem={({ item }) => {
						return (
							<Comment
								id={item.id}
								user={item.user}
								content={item.content}
								timestamp={item.timestamp}
							/>
						);
					}}
					ListEmptyComponent={() => {
						return (
							<View
								className='flex-1 justify-center items-center'
								style={{
									height:
										Dimensions.get('window').height - 350
								}}
							>
								<Text className='text-white text-[24px]'>
									No Comments
								</Text>
							</View>
						);
					}}
					keyExtractor={(item) => item.id}
				/>
			</View>
		);
	};

	const editView = () => {
		return (
			<TouchableWithoutFeedback onPress={Keyboard.dismiss}>
				<View className='flex-1 bg-grey'>
					<View className='flex flex-col w-screen items-center py-4 px-[15px] '>
						<SegmentedControl
							noYMargin
							selected={[
								'announcement',
								'praise',
								'request',
								'event',
								'thought'
							].indexOf(icon)}
							icons={[
								{
									type: 'image',
									value: require('../assets/post/announcement.png'),
									onPress: () => {
										setEditIcon('announcement');
									}
								},
								{
									type: 'image',
									value: require('../assets/post/praise.png'),
									onPress: () => {
										setEditIcon('praise');
									}
								},
								{
									type: 'image',
									value: require('../assets/post/prayer.png'),
									onPress: () => {
										setEditIcon('request');
									}
								},
								{
									type: 'image',
									value: require('../assets/post/calendar.png'),
									onPress: () => {
										setEditIcon('event');
									}
								},
								{
									type: 'image',
									value: require('../assets/post/thought.png'),
									onPress: () => {
										setEditIcon('thought');
									}
								}
							]}
						/>

						<TextInput
							className='bg-offblack text-[18px] w-full text-offwhite border border-outline rounded-[12px] px-3 py-[10px] mt-2'
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
						<TextInput
							className='bg-offblack text-[18px] w-full min-h-[100px] h-[200px] max-h-[400px] text-offwhite border border-outline rounded-[12px] px-3 py-[10px] my-2'
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
						<View className='w-full flex flex-row justify-between'>
							<Button
								title='Cancel'
								btnStyles={'bg-grey border-2 border-offwhite'}
								textStyles={'text-offwhite'}
								width={'w-[48%]'}
								press={() => {
									bottomSheetModalRef.current?.dismiss();
									setEditTitle(title);
									setEditContent(content);
								}}
							/>
							<Button
								title='Save'
								width={'w-[48%]'}
								press={editPost}
							/>
						</View>
					</View>
				</View>
			</TouchableWithoutFeedback>
		);
	};

	const circlesView = () => {
		return (
			<View className='flex-1 bg-grey'>
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
							<View
								className='items-center justify-around my-[10px]'
								style={{ width: vw / 3 - 8 }}
							>
								<Text className=' text-white text-[18px] font-[600] text-center  pb-2'>
									{item.title}
								</Text>
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
									<Ionicons
										name={item.icon}
										size={45}
										color={item.iconColor || item.color}
									/>
								</StyledAnimatedHighlight>
							</View>
						);
					}}
				/>
			</View>
		);
	};

	const interactionsView = () => {
		return (
			<View className='flex-1 bg-grey'>
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
						return <View className='w-[90%] h-[1px] bg-offwhite' />;
					}}
					renderItem={({ item }) => {
						return (
							<Interaction
								user={item.user}
								interacted={item.interacted}
							/>
						);
					}}
					ListEmptyComponent={() => {
						return (
							<View
								className='flex-1 justify-center items-center'
								style={{
									height:
										Dimensions.get('window').height - 250
								}}
							>
								<Text className='text-white text-[24px]'>
									No Interactions
								</Text>
							</View>
						);
					}}
					keyExtractor={(item) => item.profile_img}
				/>
			</View>
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
						setReported(text);
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
			<View className='flex-1 bg-grey px-[20px] pt-[10px]'>
				{reported && (
					<View className='bg-red w-full rounded-[14px] py-[10px] px-[14px] mb-2 items-center'>
						<Text className='text-offwhite text-[16px] text-left w-full'>
							You have already reported this post.
						</Text>
						<Text className='text-offwhite text-[16px] font-bold mt-2 text-left w-full'>
							Reason: {reported}
						</Text>
						<Button
							title='Cancel Report'
							btnStyles='mt-3'
							width='w-full rounded-[10px]'
							height='h-[36px]'
							textStyles='text-[16px]'
							press={() => {
								bottomSheetModalRef.current?.dismiss();
								alert('Report has been cancelled.');
								writeData(
									`prayer_circle/posts/${post.id}/reports/${auth?.currentUser?.uid}`,
									null,
									true
								);
								writeData(
									`prayer_circle/users/${auth?.currentUser?.uid}/private/reports/${post.id}`,
									null,
									true
								);
								writeData(
									`prayer_circle/reports/${post.id}`,
									null,
									true
								);
								setReported(false);
							}}
						/>
					</View>
				)}
				<View className='w-full bg-[#292929] rounded-[15px]'>
					{reportItem("I don't like this post", true)}
					{reportItem("It's spam")}
					{reportItem("It's inappropriate")}
					{reportItem('Hate speech or symbols')}
					{reportItem('Bullying or harassment')}
					{reportItem('Other', false, true)}
				</View>
			</View>
		);
	};

	const settingsView = () => {
		return (
			<View className='flex-1 bg-grey px-[15px] mt-4'>
				<View className='flex flex-row  justify-between items-center bg-[#2d2d2d] rounded-[15px] p-[10px]'>
					<Text
						className={`text-offwhite text-[16px] font-bold px-[4px]`}
					>
						Comments Enabled
					</Text>
					<Switch
						trackColor={{
							false: '#3d3d3d',
							true: '#00A55E'
						}}
						thumbColor={'#FFFBFC'}
						className={`scale-90 ${
							Platform.OS === 'android' ? 'h-[24px]' : ''
						} `}
						value={commentsEnabled}
						onChange={(e) => {
							setCommentsEnabled(e.nativeEvent.value);
							updateDoc(doc(firestore, 'posts', post.id), {
								settings: {
									comments_enabled: e.nativeEvent.value,
									interaction_visibility:
										interactionVisibility
								}
							});
						}}
					/>
				</View>
				<Text className='text-offwhite px-[10px] mt-2 mb-4 text-[12px]'>
					Choose whether or not people can comment on your post.
				</Text>
				<View className=''>
					<Text
						className={`text-offwhite text-[16px] font-bold mb-2 px-[4px]`}
					>
						Interaction Visibility
					</Text>
					<SegmentedControl
						noYMargin
						selected={interactionVisibility === 'public' ? 0 : 1}
						fireEventOnLoad={false}
						height={44}
						icons={
							post.type === 'event'
								? [
										{
											type: 'text',
											value: 'Public',
											onPress: () => {}
										},
										{
											type: 'text',
											value: 'Private',
											onPress: () => {}
										},
										{
											type: 'text',
											value: 'Hidden',
											onPress: () => {}
										}
								  ]
								: [
										{
											type: 'text',
											value: 'Public',
											onPress: () => {
												setInteractionVisibility(
													'public'
												);
												updateDoc(
													doc(
														firestore,
														'posts',
														post.id
													),
													{
														settings: {
															comments_enabled:
																commentsEnabled,
															interaction_visibility:
																'public'
														}
													}
												);
											}
										},
										{
											type: 'text',
											value: 'Private',
											onPress: () => {
												setInteractionVisibility(
													'private'
												);
												updateDoc(
													doc(
														firestore,
														'posts',
														post.id
													),
													{
														settings: {
															comments_enabled:
																commentsEnabled,
															interaction_visibility:
																'private'
														}
													}
												);
											}
										}
								  ]
						}
					/>
					<Text className='text-offwhite px-[10px] mt-2 text-[12px]'>
						Choose whether or not other people can see who has
						interacted with your post.
					</Text>
				</View>
			</View>
		);
	};

	// toolbar button abstraction
	const ToolbarButton = (props) => {
		return (
			<TouchableOpacity
				className='flex items-center justify-center w-[30px] h-[30px]'
				activeOpacity={0.4}
				onPress={() => {
					if (haptics)
						Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
					if (props.onPress) props.onPress();
				}}
			>
				<Ionicons
					name={props.icon}
					size={props.size}
					color={props.color}
				/>
			</TouchableOpacity>
		);
	};

	//functions
	function getIconSource(iconType, interacted) {
		if (!iconType) return;
		const iconKey = iconType.replace('_outline', '');
		if (
			![
				'praise',
				'event',
				'request',
				'prayer',
				'announcement',
				'thought'
			].includes(iconKey)
		) {
			console.error(`Invalid icon type: ${iconType}`);
			return;
		}
		if (post.owned || ownedToolbar) {
			return images[iconKey].nonOutline;
		}
		return !interacted
			? images[iconKey].outline
			: images[iconKey].nonOutline;
	}

	function toggleIcon() {
		if (haptics) Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

		iconScale.value = withSequence(withTiming(0.8), withTiming(1));

		if (!interacted)
			setDoc(
				doc(
					firestore,
					'posts',
					post.id,
					'interactions',
					auth?.currentUser?.uid
				),
				{
					interacted: !interacted ? Timestamp.now() : null
				}
			);
		else
			deleteDoc(
				doc(
					firestore,
					'posts',
					post.id,
					'interactions',
					auth?.currentUser?.uid
				)
			);
		setInteracted(!interacted);
	}

	// db related functions
	const postComment = async () => {
		if (newComment.length > 0) {
			let newCommentData = {
				content: newComment,
				timestamp: Timestamp.now(),
				user: auth.currentUser.uid
			};

			addDoc(
				collection(firestore, 'posts', post.id, 'comments'),
				newCommentData
			).then((d) => {
				setCommentData([
					{ id: d.id, ...newCommentData },
					...commentData
				]);
			});
			//clear input
			setNewComment('');
			newCommentRef.current.clear();
		}
	};

	async function deletePost() {
		deleteDoc(doc(firestore, 'posts', post.id)).then(() => {
			setGlobalReload(true);
			notify(
				'Post Deleted',
				'This action cannot be reverted.',
				'#F9A826'
			);
		});
	}

	async function hidePost() {
		/* TODO: Test this with new post format */
		await toggleToolbar();
		setTimeout(async () => {
			await writeData(
				`prayer_circle/users/${auth?.currentUser?.uid}/private/hidden_posts/${post.id}`,
				true,
				true
			).then(() => {
				setGlobalReload(true);
				notify(
					'Post Hidden',
					'This action can be reverted from the settings page.',
					'#F9A826'
				);
			});
		}, 200);
	}

	async function clearReports() {
		await writeData(`prayer_circle/posts/${post.id}/reports`, null, true);
		let users = Object.keys(data.reports);
		for (let user of users) {
			await writeData(
				`prayer_circle/users/${user}/private/reports/${post.id}`,
				null,
				true
			);
		}
		notify('Reports Cleared', 'All reports have been cleared.', '#F9A826');
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
		let updatedData = {};

		updatedData.title = encrypt(post.id, editTitle);
		setTitle(editTitle);

		updatedData.body = encrypt(post.id, editContent);
		setContent(editContent);

		updatedData.edited = true;
		setEdited(true);

		updatedData.type = editIcon;
		setIcon(editIcon);

		updateDoc(doc(firestore, 'posts', post.id), updatedData).then(() => {
			bottomSheetModalRef.current?.dismiss();
		});
	}

	async function reportPost(reason) {
		/* TODO: test with more posts */
		bottomSheetModalRef.current?.dismiss();
		alert(reported ? 'Report reason updated' : 'Post has been reported.');
		let reportData = {
			reporter: auth?.currentUser?.uid,
			reason: reason,
			timestamp: Date.now(),
			title: title,
			body: content
		};
		writeData(
			// log for admins
			`prayer_circle/posts/${post.id}/reports/${auth?.currentUser?.uid}`,
			reportData,
			true
		);
		writeData(
			// log for user
			`prayer_circle/users/${auth?.currentUser?.uid}/private/reports/${post.id}`,
			true,
			true
		);
		writeData(
			`prayer_circle/reports/${post.id}/${auth?.currentUser?.uid}`,
			reportData,
			true
		); // log for devs
	}

	// post setup
	const setUp = async (postId) => {
		// set up bookmark
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
	};

	// populate functions
	const getEventDate = (data) => {
		let currentTimezoneOffset = -new Date().getTimezoneOffset();
		const start = formatTimestamp(
			data?.metadata?.start,
			data?.metadata?.timezone_offset,
			currentTimezoneOffset
		);
		const end = formatTimestamp(
			data?.metadata?.end,
			data?.metadata?.timezone_offset,
			currentTimezoneOffset
		);

		let date = '';

		if (start === end) {
			date = start;
		} /* else if (start.split(', ')[0] === end.split(', ')[0]) {
			date = `${start.split(', ')[0]}, ${start.split(', ')[1]}-${
				end.split(', ')[1]
			}`;
		} */ else {
			date = `${start} - ${end}`;
		}

		setEventDate(date);
	};

	const populateComments = async () => {
		let commentCollection = collection(
			firestore,
			'posts',
			post.id,
			'comments'
		);

		/* TODO: implement pagination */
		let comments = await getDocs(
			query(commentCollection, orderBy('timestamp', 'desc'))
		);

		comments = comments.docs.map((comment) => {
			return { id: comment.id, ...comment.data() };
		});

		await setCommentData(comments);
	};

	const populateReports = async (postId) => {
		// set up report
		let reports =
			(await readData(`prayer_circle/posts/${postId}/reports`)) || {};
		for (let report of Object.keys(reports)) {
			if (report === auth?.currentUser?.uid) {
				setReported(reports[report].reason);
			}
		}
	};

	const populateCircles = async () => {
		// set up view circles
		let circlesData = [];
		let userCircles = await getCircles();
		for (let circle of post.circles || []) {
			if (!userCircles.includes(circle)) continue;
			let circleData =
				(await readData(`prayer_circle/circles/${circle}`)) || {};
			circleData.id = circle;
			circlesData.push(circleData);
		}

		setCircles(circlesData);
	};

	const populateInteractions = async () => {
		let interactionData = await getDocs(
			collection(firestore, 'posts', post.id, 'interactions')
		);
		interactionData = interactionData.docs.map((interaction) => {
			return { user: interaction.id, ...interaction.data() };
		});
		setInteractions(interactionData);
	};

	// set up
	useEffect(() => {
		(async () => {
			let title = decrypt(post.id, post.title);
			let content = decrypt(post.id, post.content);

			setTitle(title);
			setContent(content);
			setEditTitle(title);
			setEditContent(content);
			setIcon(post.type);
			if (post.type === 'event') getEventDate(post);

			setInteractionVisibility(post.interactionVisibility || 'private');
			setCommentsEnabled(post.commentsEnabled || false);

			await setUp(post.id);
		})();
	}, []);

	return (
		<ReAnimated.View
			entering={FadeIn.duration(300).delay(300)}
			exiting={FadeOut.duration(300)}
			className='w-full max-w-[500px]'
		>
			<View className='flex flex-col justify-start items-center w-full bg-[#EBEBEB0D] border border-[#6666660D] rounded-[20px] h-auto pt-[8px] my-[5px]'>
				<Pressable
					onPressIn={() => {
						const now = Date.now();
						if (lastTap && now - lastTap < 300) {
							clearTimeout(timer.current);
							if (post.owned || ownedToolbar) {
								populateInteractions();
								setBottomSheetType('Post Interactions');
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
						if (
							icon === 'event' &&
							interactionVisibility === 'public'
						) {
							populateInteractions();
							setBottomSheetType('Post Interactions');
							setSnapPoints(['85%']);
							handlePresentModalPress();
						}
						toggleToolbar();
					}}
				>
					<View className='w-full flex flex-row justify-between px-[6px]'>
						<View className='w-[90%]'>
							<Pressable
								className='flex flex-row mb-2'
								onPress={() => {
									setOtherUserID(post.user);
									if (post.user !== auth.currentUser.uid) {
										router.push('/otherUser');
									} else {
										// router.push('/profile');
										//NRA cannot simply navigate to profile page, user gets stuck; need to change pos variable in index.js remotely
									}
								}}
							>
								{post?.profile_img && (
									<CachedImage
										cacheKey={
											post?.profile_img
												?.split('%2F')[2]
												.split('?')[0]
										}
										style={{
											width: 44,
											height: 44,
											borderRadius: 8,
											marginStart: 3,
											display: post.owned
												? 'none'
												: 'flex'
										}}
										source={{
											uri: post?.profile_img,
											expiresIn: 2_628_288
										}}
									/>
								)}
								<View
									className={`flex-1 ${
										post.owned ? 'ml-[4px]' : 'ml-2'
									}`}
								>
									<View className={`mr-[20px]`}>
										<Text className='text-offwhite font-bold text-[20px]'>
											{isExpanded ||
											title?.length <= titleCharThreshold
												? title
												: `${title?.substring(
														0,
														titleCharThreshold - 4
												  )}...`}
										</Text>
									</View>
									<View className='flex flex-row'>
										<Text
											className={`${
												post.owned ? 'hidden' : ''
											} text-white`}
										>
											{post?.name} •{' '}
										</Text>
										<Text className={`text-white`}>
											{timeSince(post.timestamp)}{' '}
										</Text>
										<Text
											className={`${
												edited ? '' : 'hidden'
											} text-white`}
										>
											(edited)
										</Text>
									</View>
								</View>
							</Pressable>
							{icon == 'event' && (
								<View className='flex flex-row items-center mb-2'>
									<Text
										className={`${
											post.owned
												? 'ml-[4px] text-white font-bold text-[16px]'
												: 'text-white font-bold text-[16px]'
										}`}
									>
										{eventDate}
									</Text>
								</View>
							)}
							<View className='flex flex-row items-center w-[95%]'>
								<Text
									className={`${
										post.owned ? 'ml-[4px]' : ''
									} text-white mt-[2px] pb-[10px]`}
								>
									{isExpanded ||
									content.length <= contentCharThreshold
										? content
										: `${content.substring(
												0,
												contentCharThreshold
										  )}...`}
								</Text>
							</View>
						</View>
						<View className='flex flex-col w-[10%] items-end justify-between pr-[6px]'>
							<Pressable
								className='flex aspect-square w-[30px] self-end'
								onPress={() => {
									if (!post.owned && !ownedToolbar) {
										toggleIcon();
									} else {
										populateInteractions();
										setBottomSheetType('Post Interactions');
										setSnapPoints(['85%']);
										handlePresentModalPress();
									}
								}}
							>
								<ReAnimated.Image
									source={getIconSource(icon, interacted)}
									style={iconStyle}
								/>
							</Pressable>

							{(title?.length > titleCharThreshold ||
								content.length > contentCharThreshold) && (
								<TouchableOpacity
									onPress={() => {
										setIsExpanded(!isExpanded);
									}}
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
								</TouchableOpacity>
							)}
							{!post.reported && (
								<Pressable
									className='flex w-[30px] aspect-square justify-end mb-[2px]'
									onPress={() => {
										toggleToolbar();
									}}
								>
									<ReAnimated.Image
										className='w-[28px] h-[28px]'
										style={spinStyle}
										source={require('../assets/spiral/spiral.png')}
									/>
								</Pressable>
							)}
						</View>
					</View>
				</Pressable>
				<ReAnimated.View
					style={toolbarStyle}
					className='px-[10px] w-full overflow-hidden'
				>
					<View className='w-full overflow-hidden rounded-full bg-offblack border border-outline'>
						<View className='flex flex-row justify-around items-center w-full h-[49px]'>
							{post?.owned || ownedToolbar ? (
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
										onPress={() => {
											setBottomSheetType('Post Settings');
											setSnapPoints([340]);
											handlePresentModalPress();
										}}
									/>
									<ToolbarButton
										icon={'create-outline'}
										size={29}
										color='#00A55E'
										onPress={() => {
											setBottomSheetType('Edit Post');
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
											populateReports(post.id);
											setBottomSheetType('Report Post');
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
											toggleBookmark(post.id, data);
											/* TODO: rewrite */
										}}
									/>
								</>
							)}
							<ToolbarButton
								icon={'chatbubble-outline'}
								size={29}
								color={commentsEnabled ? '#5946B2' : '#3D3D3D'}
								onPress={async () => {
									if (!post?.owned && !ownedToolbar) {
										if (commentsEnabled) {
											populateComments();
											setBottomSheetType('Comments');
											setSnapPoints(['85%']);
											handlePresentModalPress();
										}
									} else {
										populateComments();
										setBottomSheetType('Comments');
										setSnapPoints(['85%']);
										handlePresentModalPress();
									}
								}}
							/>
							<TouchableOpacity
								className='flex w-[29px] h-[29px] border-2 border-offwhite rounded-full justify-center'
								activeOpacity={0.4}
								onPress={() => {
									if (haptics)
										Haptics.impactAsync(
											Haptics.ImpactFeedbackStyle.Light
										);
									populateCircles();
									setBottomSheetType("Post's Circles");
									handlePresentModalPress();
								}}
							/>
						</View>
					</View>
				</ReAnimated.View>
				{post.reported && (
					<View className='px-[15px] flex items-center w-full'>
						<View className='bg-red w-full rounded-[20px] py-[10px] px-[14px] mb-2 items-center'>
							<Text className='text-offwhite text-[16px] text-left w-full'>
								Reports:
							</Text>
							{Object.entries(data?.reports)
								.reduce((uniqueReports, report) => {
									if (
										!uniqueReports.includes(
											report[1].reason
										)
									) {
										uniqueReports.push(report[1].reason);
									}
									return uniqueReports;
								}, [])
								.map((reason) => {
									return (
										<View
											key={reason}
											className='flex flex-row w-full items-center'
										>
											<Text className='text-offwhite text-[16px] text-left w-full'>
												{reason}
											</Text>
										</View>
									);
								})}
						</View>
						<View className='w-full flex flex-row justify-between mb-2 px-[10px]'>
							<Button
								title='Delete Post'
								width='w-[45%]'
								height='h-[38px]'
								textStyles='text-[16px]'
								press={() => {
									deletePost();
									post.onClearReport();
								}}
							/>
							<Button
								title='Clear Report'
								width='w-[45%]'
								height='h-[38px]'
								textStyles='text-[16px]'
								press={() => {
									clearReports();
									post.onClearReport();
								}}
							/>
						</View>
					</View>
				)}
			</View>
			<BottomSheetModal
				enableDismissOnClose={true}
				ref={bottomSheetModalRef}
				index={0}
				snapPoints={snapPoints}
				handleComponent={() => handle(bottomSheetType)}
				backdropComponent={(backdropProps) => backdrop(backdropProps)}
				keyboardBehavior='extend'
				backgroundStyle={{
					backgroundColor: '#1d1d1d',
					borderRadius: 25
				}}
			>
				{bottomSheetType === 'Comments' && commentsView()}
				{bottomSheetType === 'Edit Post' && editView()}
				{bottomSheetType === "Post's Circles" && circlesView()}
				{bottomSheetType === 'Post Interactions' && interactionsView()}
				{bottomSheetType === 'Report Post' && reportView()}
				{bottomSheetType === 'Post Settings' && settingsView()}
			</BottomSheetModal>
		</ReAnimated.View>
	);
};

export const EmptyPost = (post) => {
	return (
		<Pressable className='w-full max-w-[500px]'>
			<View className='flex flex-col justify-start items-center w-full bg-[#EBEBEB0D] border border-[#6666660D] rounded-[20px] h-auto pt-[8px] my-[5px]'>
				<Pressable>
					<View className='w-full flex flex-row justify-between px-[6px]'>
						<View className='w-[90%]'>
							<View className='flex flex-row mb-2'>
								<Pulsating width={44} height={44}></Pulsating>
								<View className={`flex-1 ml-2`}>
									<View className={`mr-[20px]`}>
										<Pulsating
											width={44}
											height={18}
											styles={'my-[1px]'}
											borderRadius={4}
										/>
									</View>
									<View className='flex flex-row'>
										<Pulsating
											width={80}
											height={18}
											styles={' my-[1px]'}
											borderRadius={4}
										/>
									</View>
								</View>
							</View>
							<View className='flex flex-column items-start w-[95%]'>
								<Pulsating
									width={'70%'}
									height={20}
									borderRadius={4}
									styles={'mb-1'}
								/>
								<Pulsating
									width={'80%'}
									height={20}
									borderRadius={4}
									styles={'mb-1'}
								/>
								<Pulsating
									width={'50%'}
									height={20}
									borderRadius={4}
									styles={'mb-4'}
								/>
							</View>
						</View>
						<View className='flex flex-col w-[10%] items-end justify-between pr-[6px]'>
							<View className={'w-[20px]'}></View>
							<View className='flex w-[30px] aspect-square justify-end mb-[10px]'>
								<Image
									className='w-[28px] h-[28px]'
									source={require('../assets/spiral/spiral.png')}
								/>
							</View>
						</View>
					</View>
				</Pressable>
			</View>
		</Pressable>
	);
};
