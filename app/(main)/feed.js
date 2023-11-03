import React, { useState, useEffect } from 'react';
import {
	View,
	StatusBar,
	RefreshControl,
	ActivityIndicator,
	Text,
	FlatList
} from 'react-native';
import { styled } from 'nativewind';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Post } from '../../components/Post';
import { LinearGradient } from 'expo-linear-gradient';
import {
	readData,
	getPosts,
	getCircles
} from '../../backend/firebaseFunctions';
import AsyncStorage from '@react-native-async-storage/async-storage';

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledGradient = styled(LinearGradient);

export default function FeedPage() {
	const [posts, setPosts] = useState([]);
	const [refreshing, setRefreshing] = useState(false);
	const [postList, setPostList] = useState([]);
	const [renderIndex, setRenderIndex] = useState(0);
	const [initialLoad, setInitialLoad] = useState('loading');
	const [scrolling, setScrolling] = useState(false);
	const [me, setMe] = useState('');
	const [circles, setCircles] = useState([]);

	const setUpFeed = async () => {
		setRenderIndex(0);
		let gm = await AsyncStorage.getItem('user');
		setMe(gm);
		let gp = await getPosts();
		setPostList(gp);
		let pl = await populateList(gp, 0, 7);
		setPosts(pl);
		setInitialLoad('loaded');
	};

	async function populateList(list, start, numOfItems) {
		let me = await AsyncStorage.getItem('user');
		let renderedList = [];
		let endOfList =
			list.length < start + numOfItems ? list.length - start : numOfItems;
		for (let i of list.slice(start, endOfList + start)) {
			let id = i[0];
			let data = (await readData(`prayer_circle/posts/${id}`)) || {};

			if (data.hidden && data.hidden[`${me}`] == true) {
				continue;
			}
			renderedList.push([id, data]);
		}
		setRefreshing(false);
		setRenderIndex(start + endOfList);
		return renderedList;
	}
	useEffect(() => {
		setUpFeed();
	}, []);

	let insets = useSafeAreaInsets();

	return (
		<StyledView className='flex-1 bg-offblack'>
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
							icon='heart-outline'
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
		</StyledView>
	);
}
