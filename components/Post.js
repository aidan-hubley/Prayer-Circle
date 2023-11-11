import React, { useState, useRef, useEffect } from 'react';
import {
	Text,
	View,
	Image,
	Pressable,
	TouchableOpacity,
	Animated
} from 'react-native';
import Modal from 'react-native-modal';
import { styled } from 'nativewind';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useActionSheet } from '@expo/react-native-action-sheet';
import { timeSince } from '../backend/functions';
import { writeData } from '../backend/firebaseFunctions';
import AsyncStorage from '@react-native-async-storage/async-storage';
// import { Comment } from '../../components/Comment'; NRA this component doesn't exist yet, but I'm mimicking FeedPage.js
// import { readData, getComments } from '../../backend/firebaseFunctions'; NRA this function doesn't exist yet, but I'm mimicking FeedPage.js
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
// import { Button } from '../components/Buttons'; NRA this not needed unless adding back the close button

const StyledImage = styled(Image);
const StyledView = styled(View);
const StyledText = styled(Text);
const StyledPressable = styled(Pressable);
const StyledOpacity = styled(TouchableOpacity);
const StyledAnimatedView = styled(Animated.createAnimatedComponent(View));
const AnimatedImage = Animated.createAnimatedComponent(StyledImage);
const StyledModal = styled(Modal);
const StyledIcon = styled(Ionicons);
// const StyledGradient = styled(LinearGradient); NRA

export const Post = (post) => {
	//NRA copy from feed.js
	// const [posts, setPosts] = useState([]);
	// const [refreshing, setRefreshing] = useState(false);
	// const [postList, setPostList] = useState([]);
	// const [renderIndex, setRenderIndex] = useState(0);
	// const [initialLoad, setInitialLoad] = useState('loading');
	// const [scrolling, setScrolling] = useState(false);
	// const [me, setMe] = useState('');
	// const [circles, setCircles] = useState([]);

	// const setUpFeed = async () => {
	// 	setRenderIndex(0);
	// 	let gm = await AsyncStorage.getItem('user');
	// 	setMe(gm);
	// 	let gp = await getPosts();
	// 	setPostList(gp);
	// 	let pl = await populateList(gp, 0, 7);
	// 	setPosts(pl);
	// 	setInitialLoad('loaded');
	// };

	// async function populateList(list, start, numOfItems) {
	// 	let me = await AsyncStorage.getItem('user');
	// 	let renderedList = [];
	// 	let endOfList =
	// 		list.length < start + numOfItems ? list.length - start : numOfItems;
	// 	for (let i of list.slice(start, endOfList + start)) {
	// 		let id = i[0];
	// 		let data = (await readData(`prayer_circle/posts/${id}`)) || {};

	// 		if (data.hidden && data.hidden[`${me}`] == true) {
	// 			continue;
	// 		}
	// 		renderedList.push([id, data]);
	// 	}
	// 	setRefreshing(false);
	// 	setRenderIndex(start + endOfList);
	// 	return renderedList;
	// }
	// useEffect(() => {
	// 	setUpFeed();
	// }, []);

	// let insets = useSafeAreaInsets();
	//NRA end copy from feed.js

	const tS = timeSince(post.timestamp);

	const [iconType, setIconType] = useState(`${post.icon}_outline`);
	const [commentIcon, setCommentIcon] = useState(post.icon);
	const iconAnimation = useRef(new Animated.Value(1)).current;
	const [toolbarShown, setToolbar] = useState(false);
	const [me, setMe] = useState('');
	const [lastTap, setLastTap] = useState(null);
	const timer = useRef(null);

	const { showActionSheetWithOptions } = useActionSheet();

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

	function toggleToolbar() {
		setToolbar(!toolbarShown);
		Animated.spring(toolbarVal, {
			toValue: toolbarShown ? 0 : 1,
			duration: 100,
			useNativeDriver: false
		}).start();
	}

	useEffect(() => {
		return () => {
			clearTimeout(timer.current);
		};
		}, []);

	const images = {
		praise: {
			outline: require('../assets/post/praise_outline.png'),
			nonOutline: require('../assets/post/praise.png'),
		},
		event: {
			outline: require('../assets/post/calendar_outline.png'),
			nonOutline: require('../assets/post/calendar.png'),
		},
		request: {
			outline: require('../assets/post/prayer_outline.png'),
			nonOutline: require('../assets/post/prayer.png'),
		},
		prayer: {
			outline: require('../assets/post/prayer_outline.png'),
			nonOutline: require('../assets/post/prayer.png'),
		},
	};

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
		const iconKey = iconType.replace('_outline', '');
		if (['praise', 'event', 'request', 'prayer'].includes(iconKey)) {
			setIconType(iconType.includes('outline') ? iconKey : iconKey + '_outline');
			
			Animated.sequence([
				Animated.timing(iconAnimation, {
					toValue: 1.5,
					duration: 100,
					useNativeDriver: true,
				}),
				Animated.timing(iconAnimation, {
					toValue: 1,
					duration: 100,
					useNativeDriver: true,
				}),
			]).start();
		}
	}

	async function deletePost() {
		writeData(
			`prayer_circle/circles/-NhYtVYMYvc_HpBK-ohk/posts/${post.id}`,
			null,
			true
		);
		writeData(
			`prayer_circle/users/BBAzhYq9VGgofMNO5Jl3cmpT2xe2/posts/${post.id}`,
			null,
			true
		);
		writeData(`prayer_circle/posts/${post.id}`, null, true).then(() => {
			setTimeout(() => {
				post.refresh();
			}, 100);
		});
	}

	const [isCommentModalVisible, setCommentModalVisible] = useState(false);
	const toggleCommentModal = () => {
		setCommentModalVisible(!isCommentModalVisible);
	};

	async function hidePost(postId) {
		writeData(`prayer_circle/posts/${postId}/hidden/${me}`, true, true);
		toggleToolbar();

		post.refresh();
	}

	const setUp = async () => {
		let uid = await AsyncStorage.getItem('user');
		setMe(uid);
	};

	useEffect(() => {
		setUp();
	});

	// let insets = useSafeAreaInsets();

	return (
		<StyledView className='w-full max-w-[500px]'>
			<StyledView className='flex flex-col justify-start items-center w-full bg-[#EBEBEB0D] border border-[#6666660D] rounded-[20px] h-auto pt-[10px] my-[5px]'>
				<StyledPressable
					onPressIn={() => {
						const now = Date.now();
						if (lastTap && (now - lastTap) < 300) {
							clearTimeout(timer.current);
							toggleIcon();
						} else {
							setLastTap(now);
							timer.current = setTimeout(() => {}, 300);
						}
					}}
				>
					<StyledView className='w-full flex flex-row justify-between px-[10px]'>
						<StyledView className=' w-[88%]'>
							<StyledView className='flex flex-row mb-2 '>
								<StyledImage
								// NRA
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
										{post.title.length > 21
											? post.title.substring(0, 21) + '...'
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
									{post.content.length > 300
										? post.content.substring(0, 297) + '...'
										: post.content}
								</StyledText>
							</StyledView>
						</StyledView>
						<StyledView className='flex flex-col w-[12%] items-center justify-between'>
							<StyledPressable
								className='rounded-full aspect-square flex items-center justify-center' // bg-radial gradient??
								onPress={toggleIcon}>
								<AnimatedImage 
									className='w-[26px] h-[26px]' 
									style={{ transform: [{ scale: iconAnimation }] }}
									source={getTypeSource(iconType, post.owned ? false : iconType.includes('outline'))} 
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
									source={require('../assets/spiral.png')}
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
									<StyledOpacity
										className='flex items-center justify-center w-[30px] h-[30px]'
										activeOpacity={0.4}
										onPress={toggleCommentModal}
									>
										<StyledIcon
											name={'chatbubble-outline'}
											size={29}
											color='#5946B2'
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
									<StyledOpacity
										className='flex items-center justify-center w-[30px] h-[30px]'
										activeOpacity={0.4}
										onPress={toggleCommentModal}
									>
										<StyledIcon
											name={'chatbubble-outline'}
											size={29}
											color='#5946B2'
										/>
									</StyledOpacity>
								</>
							)}
							<StyledOpacity
								className='flex w-[29px] h-[29px] border-2 border-offwhite rounded-full justify-center'
								activeOpacity={0.4}
								onPress={() => {}}
							/>
						</StyledView>
					</StyledView>
				</StyledAnimatedView>
			</StyledView>

			<StyledModal
				className='w-[100%] self-center'
				isVisible={isCommentModalVisible}
				onBackdropPress={toggleCommentModal}
			>
				<StyledView className='position-absolute mt-[80%] bg-offblack border-[5px] border-yellow rounded-2xl justify-bottom h-[70%]'>
					<StyledView className='h-[60%]'>
						<StyledView className='flex flex-row'>
							<StyledView className='w-[80%] ml-[5%] mb-[5%]'>
								<StyledText className='top-[8%] text-xl text-left text-offwhite'>
									Comments on
								</StyledText>
								<StyledText className='top-[8%] text-4xl text-offwhite'>
									{post.title.length > 21
									? post.title.substring(0, 21) +
										'...'
									: post.title}
								</StyledText>
							</StyledView>
							{/* NRA */}
							{/* <StyledView className='flex-1'>
								<Button
									btnStyles='top-[3%] bg-offblack'
									height={'h-[60px]'}
									width={'w-[60px]'}
									iconSize={60}
									icon='close'
									iconColor='#FFFBFC'
									press={toggleCommentModal}
								/>
							</StyledView> 
							This button is unnecessary given the onBackdropPress, but I left it in just in case*/}
						</StyledView>
						<StyledView className='flex flex-col w-full justify-start items-center rounded-b-[20px] pt-[4px] pb-[10px]'>
							<StyledView className='w-[90%] flex flex-row justify-between'>
								<StyledView className=' flex flex-row w-[70%]'>
									<StyledView className=' items-center justify-center'>
										<StyledImage
										// NRA
										className={`rounded-lg`}
										style={{ width: 44, height: 44 }}
										source={{
											// uri: comment.img
											uri: 'https://picsum.photos/1223'
										}}
										/>
									</StyledView>
									<StyledView className='ml-[8px]'>
										<StyledText className='font-bold text-[18px] text-white'>
											Comment #1 hello hello hello hello hello hello
										</StyledText>
										<StyledText className='text-white text-[12px]'>
											Person who posted
										</StyledText>
									</StyledView>
								</StyledView>
								<StyledView className=' flex flex-col items-end justify-center w-[10%]'>
									<StyledText className='text-[13px] text-white'>
										17h
									</StyledText>
								</StyledView>
							</StyledView>

							<StyledView className='w-[90%] border-t border-outline mt-[5px] mb-[3px]'></StyledView>

							<StyledView className='w-[90%] flex flex-row justify-between'>
								<StyledView className=' flex flex-row'>
									<StyledView className=' items-center justify-center'>
										<StyledImage
											// NRA
											className={`rounded-lg`}
											style={{ width: 44, height: 44 }}
											source={{
												// uri: comment.img
												uri: 'https://picsum.photos/1223'
											}}
										/>
									</StyledView>
									<StyledView className='ml-[8px]'>
										<StyledText className='font-bold text-[18px] text-white'>
											Comment #2
										</StyledText>
										<StyledText className='text-white text-[12px]'>
											Person who posted
										</StyledText>
									</StyledView>
								</StyledView>
								<StyledView className=' flex flex-col items-end justify-center'>
									<StyledText className='text-[13px] text-white'>
										17h
									</StyledText>
								</StyledView>
							</StyledView>
						</StyledView>
						{/* <StyledView className='flex-1 bg-offblack'> NRA copy from feed.js
							<StyledView className='flex-1'>
								<FlatList
									data={posts}
									onEndReachedThreshold={0.4}
									windowSize={10}
									onScrollBeginDrag={() => {
										setScrolling(true);
									}}
									onMomentumScrollEnd={() => {
										setScrolling(false);
									}}
									onEndReached={() => {
										if (initialLoad == 'loading' || !scrolling) return;
										populateList(postList, renderIndex, 10).then((res) => {
											setPosts([...posts, ...res]);
										});
									}}
									style={{ paddingHorizontal: 15 }}
									estimatedItemSize={100}
									showsHorizontalScrollIndicator={false}
									refreshControl={
										<RefreshControl
											progressViewOffset={insets.top + 60}
											onRefresh={() => {
												setRefreshing(true);
												setUpFeed();
											}}
											refreshing={refreshing}
											tintColor='#ebebeb'
										/>
									}
									ListHeaderComponent={
										posts && posts.length > 0 ? (
											<StyledView
												className='w-full flex items-center mb-[10px]'
												style={{
													height: insets.top + 60
												}}
											/>
										) : (
											<></>
										)
									}
									ListFooterComponent={
										posts && posts.length > 0 ? (
											<StyledView
												className='w-full flex items-center mb-[10px]'
												style={{
													height: insets.top + 60
												}}
											/>
										) : (
											<></>
										)
									}
									ListEmptyComponent={
										<StyledView className='w-full h-screen flex items-center justify-center'>
											<StyledView
												className={`${
													initialLoad == 'loaded' ? 'hidden' : 'flex'
												}`}
											>
												<ActivityIndicator size='large' />
											</StyledView>
											<StyledText
												className={`${
													initialLoad == 'loaded' ? 'flex' : 'hidden'
												} text-white text-[24px]`}
											>
												No Posts Yet!
											</StyledText>
										</StyledView>
									}
									renderItem={({ item }) => (
										<Post
											user={item[1].name}
											img={item[1].profile_img}
											title={item[1].title}
											timestamp={`${item[1].timestamp}`}
											content={item[1].text}
											icon={item[1].type}
											id={item[0]}
											refresh={() => setUpFeed()}
											ownedToolBar={item[1].user == me}
											edited={item[1].edited}
										/>
									)}
									keyExtractor={(item) => item[0]}
								/>
							</StyledView>

							<StyledGradient
								pointerEvents='none'
								start={{ x: 0, y: 0.3 }}
								end={{ x: 0, y: 1 }}
								style={{ height: insets.top + 50 }}
								className='absolute w-screen'
								colors={['#121212ee', 'transparent']}
							/>
							<StatusBar barStyle={'light-content'} />
						</StyledView> */}
						{/* Comments component goes here. NRA recommends:
						-using a similar format to journal.js (esp horizontal lines)
						-and placing it inside feed.js format (esp gradiant; some import work for that already done here)*/}
					</StyledView>
				</StyledView>
			</StyledModal>
		</StyledView>
	);
};
