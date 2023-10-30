import React, { useState, useEffect } from 'react';
import {
	View,
	ScrollView,
	StatusBar,
	RefreshControl,
	ActivityIndicator,
	Text,
	FlatList
} from 'react-native';
import { Circle } from '../../components/Circle';
import { styled } from 'nativewind';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Post } from '../../components/Post';
import { Button } from '../../components/Buttons';
import { LinearGradient } from 'expo-linear-gradient';
import {
	writeData,
	generateId,
	readData,
	getPosts
} from '../../backend/firebaseFunctions';

const StyledView = styled(View);
const StyledScrollView = styled(ScrollView);
const StyledText = styled(Text);
const StyledGradient = styled(LinearGradient);
const StyledFlatList = styled(FlatList);

export default function FeedPage() {
	const [posts, setPosts] = useState([]);
	const [refreshing, setRefreshing] = useState(false);
	const [postList, setPostList] = useState([]);
	const [renderIndex, setRenderIndex] = useState(0);
	const [initialLoad, setInitialLoad] = useState('loading');

	const setUpFeed = async () => {
		setRenderIndex(0);
		let gp = await getPosts();
		gp = gp.reverse();
		setPostList(gp);
		let pl = await populateList(gp, 0, 7);
		pl.sort((a, b) => {
			return b[1].timestamp - a[1].timestamp;
		});
		setPosts(pl);
		setInitialLoad('no posts');
	};

	async function populateList(list, start, numOfItems) {
		let renderedList = [];
		let endOfList =
			list.length < start + numOfItems ? list.length - start : numOfItems;
		for (let i of list.slice(start, endOfList + start)) {
			let data = (await readData(`prayer_circle/posts/${i}`)) || {};
			renderedList.push([i, data]);
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
				<StyledFlatList
					data={posts}
					onEndReachedThreshold={0.5}
					windowSize={10}
					onEndReached={() => {
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
									initialLoad == 'no posts'
										? 'hidden'
										: 'flex'
								}`}
							>
								<ActivityIndicator size='large' />
							</StyledView>
							<StyledText
								className={`${
									initialLoad == 'no posts'
										? 'flex'
										: 'hidden'
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
							owned={false}
							edited={item[1].edited}
						/>
					)}
					keyExtractor={(item) => item[0]}
				/>
			</StyledView>

			{/* <StyledView
				style={{
					bottom:
						insets.bottom < 10 ? insets.bottom + 15 : insets.bottom
				}}
				className='absolute flex flex-row justify-center w-screen'
			>
				<Circle />
			</StyledView> */}

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
