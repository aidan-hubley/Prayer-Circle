import React, { useState, useEffect } from 'react';
import {
	Text,
	View,
	FlatList,
	RefreshControl,
	ActivityIndicator
} from 'react-native';
import { styled } from 'nativewind';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button } from '../../components/Buttons';
import { Post } from '../../components/Post';
import { LinearGradient } from 'expo-linear-gradient';
import { getProfilePosts, readData } from '../../backend/firebaseFunctions';
import { useStore } from '../global';
import { auth } from '../../backend/config';
import CachedImage from 'expo-cached-image';
import shorthash from 'shorthash';

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledGradient = styled(LinearGradient);

export default function ProfilePage() {
	const [refreshing, setRefreshing] = useState(false);
	const [postList, setPostList] = useState([]);
	const [initialLoad, setInitialLoad] = useState('loading');
	const [scrolling, setScrolling] = useState(false);
	const otherUserID = useStore((state) => state.otherUserID);
	const [userData, setUserData] = useState({});

	const setUpVenn = async () => {
		let data = await getUserData(otherUserID);
		let circlelist = data['circlelist'];
		let postlist = data['postlist'];

		console.log(circlelist);
		console.log(postlist);

		let pl = await populateList(postlist, 0, 7);
		setPosts(pl);

		setInitialLoad('loaded');
	};

	const setUpFeed = async () => {
		setRefreshing(true);
		if (otherUserID) {
			let u = await await readData(
				`prayer_circle/users/${otherUserID}/public`
			);
			console.log(u);
			setUserData({
				displayName: u?.fname + ' ' + u?.lname,
				photoURL: u?.profile_img
			});

			let gp = Object.entries(
				(await readData(
					`prayer_circle/users/${otherUserID}/private/posts`
				)) || {}
			);
			gp.sort((a, b) => {
				return b[1] - a[1];
			});

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
				onEndReached={async () => {
					/* if (initialLoad == 'loading' || !scrolling) return;
					let gpp = await getProfilePosts(otherUserID);
					setPostList(gpp); */
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
									cacheKey={shorthash.unique(
										userData.photoURL
									)}
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
					return <Post id={item[0]} owned={true} />;
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
		</StyledView>
	);
}
