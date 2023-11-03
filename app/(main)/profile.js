import React, { useState, useEffect, useRef } from 'react';
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
import AsyncStorage from '@react-native-async-storage/async-storage';
import { signOut } from 'firebase/auth';
import { router, auth } from '../../backend/config';
import { readData, getPosts } from '../../backend/firebaseFunctions';

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledImage = styled(Image);
const StyledGradient = styled(LinearGradient);

export default function ProfilePage() {
	const [posts, setPosts] = useState([]);
	const [refreshing, setRefreshing] = useState(false);
	const [postList, setPostList] = useState([]);
	const [renderIndex, setRenderIndex] = useState(0);
	const [initialLoad, setInitialLoad] = useState('loading');
	const [scrolling, setScrolling] = useState(false);
	const [name, setName] = useState('');
	const [email, setEmail] = useState('');

	const setUpFeed = async () => {
		setRenderIndex(0);
		let gp = await getPosts();
		setPostList(gp);
		let pl = await populateList(gp, 0, 7);
		setPosts(pl);
		let gn = await AsyncStorage.getItem('name');
		setName(gn);
		let ge = await AsyncStorage.getItem('email');
		setEmail(ge);
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
			if (data.user == me) renderedList.push([id, data]);
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
							<StyledImage
								className='w-full h-full rounded-[18px]'
								source={{ uri: 'https://picsum.photos/1223' }}
							/>
						</StyledView>
						<StyledText className='font-bold text-offwhite text-[26px] mt-3'>
							{name}
						</StyledText>
						<StyledText className=' text-offwhite text-[18px]'>
							{email}
						</StyledText>
					</StyledView>
				}
				ListFooterComponent={
					posts && posts.length > 0 ? (
						<StyledView
							className='w-full flex items-center mb-[10px]'
							style={{
								height: insets.top + 60
							}}
						>
							<Button
								title='Sign Out'
								width='w-[50%]'
								press={() => {
									signOut(auth);
									AsyncStorage.removeItem('user');
									AsyncStorage.removeItem('name');
									router.replace('/login');
								}}
							/>
						</StyledView>
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
						<Button
							title='Sketch a Post'
							height='h-[65px]'
							btnStyles={`mt-3 ${
								initialLoad == 'loaded' ? 'flex' : 'hidden'
							}`}
							width='w-11/12'
							href='/createPost'
						/>
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
						owned={true}
						edited={item[1].edited}
					/>
				)}
				keyExtractor={(item) => item[0]}
			/>
			<Button
				btnStyles='absolute bottom-[26px] right-5'
				width='w-[60px]'
				height='h-[60px]'
				icon='settings'
				iconSize={38}
				href='/settings'
			/>
			<Button
				btnStyles='absolute bottom-[26px] left-5'
				width='w-[60px]'
				height='h-[60px]'
				icon='mail-unread'
				iconSize={36}
				href='/settings'
				press={() => {
					signOut();
					AsyncStorage.removeItem('user');
					router.push('/login');
				}}
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
