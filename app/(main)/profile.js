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
import CachedImage from '../../components/CachedImage';

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledGradient = styled(LinearGradient);

export default function ProfilePage() {
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
			setInitialLoad('loaded');
			setRefreshing(false);
		}
	};
	useEffect(() => {
		setRefreshing(true);
		setUpFeed();
	}, []);
	useEffect(() => {
		if (globalReload) {
			setRefreshing(true);
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
					if (initialLoad == 'loading' || !scrolling) return;
					let gpp = await getProfilePosts();
					setPostList(gpp);
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
						{/* <StyledText className=' text-offwhite text-[18px]'>
							{userData.email}
						</StyledText> */}
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
