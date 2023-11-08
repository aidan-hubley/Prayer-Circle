import React, { useState, useRef, useEffect } from 'react';
import {
	Text,
	View,
	Image,
	Pressable,
	TouchableOpacity,
	Animated
} from 'react-native';
import { styled } from 'nativewind';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useActionSheet } from '@expo/react-native-action-sheet';
import { timeSince } from '../backend/functions';
import { writeData } from '../backend/firebaseFunctions';
import AsyncStorage from '@react-native-async-storage/async-storage';

const StyledImage = styled(Image);
const StyledView = styled(View);
const StyledText = styled(Text);
const StyledPressable = styled(Pressable);
const StyledOpacity = styled(TouchableOpacity);
const StyledAnimatedView = styled(Animated.createAnimatedComponent(View));
const AnimatedImage = Animated.createAnimatedComponent(StyledImage);
const StyledIcon = styled(Ionicons);

export const Post = (post) => {
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
									<StyledOpacity
										className='flex items-center justify-center w-[30px] h-[30px]'
										activeOpacity={0.4}
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
		</StyledView>
	);
};
