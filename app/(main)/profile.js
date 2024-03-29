import React, { useState, useEffect } from 'react';
import {
	Text,
	View,
	Image,
	FlatList,
	RefreshControl,
	ActivityIndicator
} from 'react-native';
import { styled } from 'nativewind';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button } from '../../components/Buttons';
import { Post } from '../../components/Post';
import { LinearGradient } from 'expo-linear-gradient';
import {
	readData,
	getProfilePosts,
	createTutorial
} from '../../backend/firebaseFunctions';
import { useStore } from '../global';
import { auth } from '../../backend/config';
import CachedImage from 'expo-cached-image';
import shorthash from 'shorthash';

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledGradient = styled(LinearGradient);

export default function ProfilePage() {
	const [posts, setPosts] = useState([]);
	const [refreshing, setRefreshing] = useState(false);
	const [postList, setPostList] = useState([]);
	const [renderIndex, setRenderIndex] = useState(0);
	const [initialLoad, setInitialLoad] = useState('loading');
	const [scrolling, setScrolling] = useState(false);
	const globalReload = useStore((state) => state.globalReload);
	const [userData, setUserData] = useState(auth?.currentUser);

	const setUpFeed = async () => {
		if (auth.currentUser) {
			setRenderIndex(0);
			let gp = await getProfilePosts();
			setPostList(gp);
			let pl = await populateList(gp, 0, 7);
			setPosts(pl);
			setInitialLoad('loaded');
		}
	};

	async function populateList(list, start, numOfItems) {
		let renderedList = [];
		let endOfList =
			list.length < start + numOfItems ? list.length - start : numOfItems;
		for (let i of list.slice(start, endOfList + start)) {
			let id = i[0];
			let data = (await readData(`prayer_circle/posts/${id}`)) || {};
			if (data.user == userData.uid) renderedList.push([id, data]);
		}
		setRefreshing(false);
		setRenderIndex(start + endOfList);
		return renderedList;
	}
	useEffect(() => {
		setUpFeed();
	}, []);
	useEffect(() => {
		if (globalReload) {
			setUpFeed();
		}
	}, [globalReload]);
	useEffect(() => {
		setUserData(auth?.currentUser);
	}, [auth]);

	let insets = useSafeAreaInsets();
	return (
		<StyledView className='flex-1 bg-offblack'>
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
					<StyledView
						style={{ paddingTop: insets.top + 100 }}
						className='flex items-center w-full mb-10'
					>
						<StyledView className='w-[175px] h-[175px] rounded-[20px] border-2 border-offwhite'>
							{/* <CachedImage
									className='w-full h-full rounded-[18px]'
									style={{
										width: '100%',
										height: '100%',
										borderRadius: 18,
										backgroundColor: 'red',
										display: profileImage ? 'flex' : 'none'
									}}
									cacheKey={shorthash.unique(
										'https://firebasestorage.googleapis.com/v0/b/prayer-circle-8c3ff.appspot.com/o/prayer_circle%2Fusers%2Fvaleria%2F-NoiCzWV4KEc6aUP_2zN?alt=media&token=46d3c970-07ec-4187-95d9-4ea4543ed484'
									)}
									source={{
										uri: 'https://firebasestorage.googleapis.com/v0/b/prayer-circle-8c3ff.appspot.com/o/prayer_circle%2Fusers%2Fvaleria%2F-NoiCzWV4KEc6aUP_2zN?alt=media&token=46d3c970-07ec-4187-95d9-4ea4543ed484',
										expiresIn: 2_628_288
									}}
								/> */}
							{userData?.photoURL ? (
								/* TODO: Make this image cached. currently the cached implementation(above) does not refresh when the profileImage state is changed */
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
						{/* <StyledText className=' text-offwhite text-[18px]'>
							{userData.email}
						</StyledText> */}
					</StyledView>
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
				renderItem={({ item }) => (
					<Post
						user={item[1].name}
						img={item[1].profile_img}
						title={item[1].title}
						timestamp={`${item[1].timestamp}`}
						content={item[1].body}
						icon={item[1].type}
						id={item[0]}
						owned={true}
						edited={item[1].edited}
						metadata={item[1].metadata}
						data={item[1]}
					/>
				)}
				keyExtractor={(item) => item[0]}
			/>
			<StyledView
				style={{ bottom: insets.bottom }}
				className='absolute w-screen px-[15px] flex flex-row justify-between'
			>
				{/* Only show when invite is pending for user to join circle */}
				<StyledView>
					<Button
						btnStyles='hidden'
						width='w-[60px]'
						height='h-[60px]'
						icon='mail-unread'
						iconSize={36}
						// href='/'
					/>
				</StyledView>
				<Button
					width='w-[50px]'
					height='h-[50px]'
					icon='settings'
					iconSize={30}
					href='/settings'
				/>
			</StyledView>
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
