import React, { useState, useEffect } from 'react';
import {
	Text,
	View,
	FlatList,
	RefreshControl,
	ActivityIndicator,
	TouchableHighlight
} from 'react-native';
import { styled } from 'nativewind';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button } from '../../components/Buttons';
import { Post } from '../../components/Post';
import { LinearGradient } from 'expo-linear-gradient';
import Ionicons from '@expo/vector-icons/Ionicons';
import {
	getCircles,
	getProfilePosts,
	readData
} from '../../backend/firebaseFunctions';
import { useStore } from '../global';
import { auth } from '../../backend/config';
import { router } from 'expo-router';
import CachedImage from '../../components/CachedImage';

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledIcon = styled(Ionicons);
const StyledGradient = styled(LinearGradient);
const StyledHighlight = styled(TouchableHighlight);

export default function ProfilePage() {
	const [refreshing, setRefreshing] = useState(false);
	const [circleList, setCircleList] = useState([]);
	const [postList, setPostList] = useState([]);
	const [initialLoad, setInitialLoad] = useState('loading');
	const [scrolling, setScrolling] = useState(false);
	const otherUserID = useStore((state) => state.otherUserID);
	const [userData, setUserData] = useState({});

	const [
		setFilter,
		setFilterName,
		setFilterIcon,
		setFilterColor,
		setFilterIconColor
	] = useStore((state) => [
		state.setFilter,
		state.setFilterName,
		state.setFilterIcon,
		state.setFilterColor,
		state.setFilterIconColor
	]);

	const setUpFeed = async () => {
		setRefreshing(true);

		let u = await await readData(
			`prayer_circle/users/${otherUserID}/public`
		);
		setUserData({
			displayName: u?.fname + ' ' + u?.lname,
			photoURL: u?.profile_img
		});

		if (otherUserID) {
			let circles = await getCircles();
			let gp = [];
			let postIDs = [];
			let cl = [];
			for (const circle of circles) {
				let circleData = await readData(
					`prayer_circle/circles/${circle}/`
				);
				if (circleData.members[otherUserID]) {
					cl.push({
						color: circleData.color,
						icon: circleData.icon,
						iconColor: circleData.iconColor,
						title: circleData.title
					});
					let circlePosts = await readData(
						`prayer_circle/circles/${circle}/posts`
					);
					for (const post of Object.keys(circlePosts)) {
						let postdata = await readData(
							`prayer_circle/posts/${post}`
						);
						if (postdata.user === otherUserID) {
							if (!postIDs.includes(post)) {
								postIDs.push(post);
								gp.push([post, postdata.timestamp]);
							}
						}
					}
				}
			}

			gp.sort((a, b) => {
				return b[1] - a[1];
			});

			setCircleList(cl);
			setPostList(gp);
			setInitialLoad('loaded');
			setRefreshing(false);
		}
	};
	useEffect(() => {
		setUpFeed();
	}, []);

	let insets = useSafeAreaInsets();

	return (
		<StyledView className='flex-1 bg-offblack'>
			<FlatList
				data={postList}
				onEndReachedThreshold={0.4}
				windowSize={10}
				onScrollBeginDrag={() => {
					setScrolling(true);
				}}
				onMomentumScrollEnd={() => {
					setScrolling(false);
				}}
				onEndReached={async () => {}}
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
					<>
						<StyledView
							style={{ paddingTop: insets.top + 60 }}
							className='flex items-center w-full mb-10'
						>
							<StyledView className='w-[175px] h-[175px] rounded-[20px] border-2 border-offwhite'>
								{userData?.photoURL ? (
									<CachedImage
										style={{
											width: '100%',
											height: '100%',
											borderRadius: 18,
											display: userData.photoURL
												? 'flex'
												: 'none'
										}}
										cacheKey={
											userData.photoURL
												?.split('2F')[2]
												.split('?')[0]
										}
										source={{
											uri: userData.photoURL
										}}
									/>
								) : (
									<></>
								)}
							</StyledView>
							<StyledText className='font-bold text-offwhite text-[26px] mt-3'>
								{userData?.displayName}
							</StyledText>
						</StyledView>
						<StyledView className='flex w-full px-2'>
							<StyledText className='font-bold text-offwhite text-[18px]'>
								Your Shared Circles
							</StyledText>
						</StyledView>
						<FlatList
							data={circleList}
							horizontal={true}
							showsHorizontalScrollIndicator={false}
							renderItem={({ item }) => {
								return (
									<StyledView
										key={item.id}
										className='items-center my-[20px] pr-[10px] h-[100px]'
									>
										<StyledHighlight
											style={[
												{
													borderColor: item.color
												}
											]}
											className='flex border-[5px] items-center justify-center rounded-full w-[65px] aspect-square'
											onPress={() => {
												setFilter(item.id);
												setFilterName(item.title);
												setFilterIcon(item.icon);
												setFilterColor(item.color);
												setFilterIconColor(
													item.iconColor
												);
												router.replace('/');
											}}
										>
											<StyledIcon
												name={item.icon}
												size={35}
												color={
													item.iconColor || item.color
												}
											/>
										</StyledHighlight>
										<StyledText className='text-white text-[14px] font-[600] text-center mb-2 w-[75px]'>
											{item.title}
										</StyledText>
									</StyledView>
								);
							}}
							keyExtractor={(item) => item.id}
						/>
						<StyledView className='flex w-full px-2 pb-2'>
							<StyledText className='font-bold text-offwhite text-[18px]'>
								Their Posts
							</StyledText>
						</StyledView>
					</>
				}
				ListFooterComponent={
					postList && postList.length > 0 ? (
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
					<StyledView className='w-full h-[250px] flex items-center justify-center'>
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
				renderItem={({ item }) => {
					return <Post id={item[0]} owned={false} />;
				}}
				keyExtractor={(item) => item[0]}
			/>
			<StyledGradient
				pointerEvents='none'
				start={{ x: 0, y: 0.1 }}
				end={{ x: 0, y: 1 }}
				style={{ height: insets.top + 60 }}
				className='absolute w-screen'
				colors={['#121212', 'transparent']}
			/>
			<StyledView
				style={{ bottom: insets.bottom }}
				className='absolute w-screen flex flex-row px-[15px] justify-between'
			>
				<Button
					icon='arrow-back'
					press={() => router.back()}
					width={'w-[50px]'}
					height={'h-[50px]'}
					iconSize={30}
				></Button>
			</StyledView>
		</StyledView>
	);
}
