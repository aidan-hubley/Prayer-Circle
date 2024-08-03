import React, { useState, useEffect } from 'react';
import {
	View,
	RefreshControl,
	ActivityIndicator,
	Text,
	FlatList
} from 'react-native';
import { styled } from 'nativewind';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Post, EmptyPost } from '../../components/Post';
import { LinearGradient } from 'expo-linear-gradient';
import {
	getPosts,
	getHiddenPosts,
	getCircles
} from '../../backend/firebaseFunctions';
import { useStore } from '../global';
import { auth, firestore } from '../../backend/config';
import { NotifierWrapper } from 'react-native-notifier';
import {
	getDocs,
	collection,
	limit,
	orderBy,
	query,
	startAfter,
	where
} from 'firebase/firestore';

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledGradient = styled(LinearGradient);

export default function FeedPage() {
	const [refreshing, setRefreshing] = useState(false);
	const [postList, setPostList] = useState([]);
	const [filterTarget, globalReload] = useStore((state) => [
		state.filter,
		state.globalReload
	]);
	const [hiddenPosts, setHiddenPosts] = useState([]);
	const [lastFetch, setLastFetch] = useState(-1);
	const [lastVisibleDoc, setLastVisibleDoc] = useState(null);
	const [loading, setLoading] = useState(false);
	const [circles, setCircles] = useState(null);

	const fetchPosts = async (
		filterT,
		r,
		circs,
		lastVisible = null,
		batchSize = 8
	) => {
		/* circs is used on first load before `circles` state has been set */
		let newPosts = [];

		let filter =
			filterT === 'unfiltered'
				? where('circles', 'array-contains-any', circles || circs)
				: where('circles', 'array-contains', filterT);

		if (lastFetch === 0 && !r) return newPosts;
		try {
			const postsCollection = collection(firestore, 'posts');

			let postsQuery;
			if (lastVisible) {
				postsQuery = query(
					postsCollection,
					filter,
					orderBy('timestamp', 'desc'),
					startAfter(lastVisible),
					limit(batchSize)
				);
			} else {
				postsQuery = query(
					postsCollection,
					filter,
					orderBy('timestamp', 'desc'),
					limit(batchSize)
				);
			}

			const snapshot = await getDocs(postsQuery);
			newPosts = snapshot.docs.map((doc) => ({
				id: doc.id,
				...doc.data()
			}));

			setLastFetch(newPosts.length);

			// Get the last visible document
			setLastVisibleDoc(snapshot.docs[snapshot.docs.length - 1]);
		} catch (error) {
			console.error('Error fetching posts:', error);
		} finally {
			setLoading(false);
		}

		return newPosts;
	};

	async function setUpFeed() {
		if (auth.currentUser) {
			let circles = await getCircles();
			setCircles(circles);
			let p = await fetchPosts(filterTarget, true, circles);
			setPostList(p);
			console.log(p.length);
		}
	}

	/* reload feed when new filter target */
	useEffect(() => {
		setUpFeed();
	}, [filterTarget]);

	/* reload feed when refreshControl */
	useEffect(() => {
		if (loading) setUpFeed();
	}, [loading]);

	/* reload feed when global signal */
	useEffect(() => {
		if (globalReload) {
			setUpFeed();
		}
	}, [globalReload]);

	let insets = useSafeAreaInsets();

	return (
		<StyledView className='w-screen flex-1 bg-offblack'>
			<StyledView className='w-screen flex-1'>
				<FlatList
					data={postList}
					onEndReachedThreshold={0.4}
					windowSize={10}
					onEndReached={() => {}}
					style={{ paddingHorizontal: 15 }}
					estimatedItemSize={100}
					showsHorizontalScrollIndicator={false}
					refreshControl={
						<RefreshControl
							progressViewOffset={insets.top + 60}
							onRefresh={() => {
								setLoading(true);
							}}
							refreshing={loading}
							tintColor='#ebebeb'
						/>
					}
					ListHeaderComponent={
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
						<>
							{/* <StyledView
							className={`w-full h-screen ${
								initialLoad === 'loading'
									? 'justify-start'
									: 'justify-center'
							} items-center`}
							style={{
								paddingTop:
									initialLoad === 'loading'
										? insets.top + 60
										: 0
							}}
						>
							{initialLoad == 'loading' && (
								<>
									<EmptyPost></EmptyPost>
									<EmptyPost></EmptyPost>
									<EmptyPost></EmptyPost>
									<EmptyPost></EmptyPost>
									<EmptyPost></EmptyPost>
									<EmptyPost></EmptyPost>
								</>
							)}
							<StyledText
								className={`${
									initialLoad == 'loaded' ? 'flex' : 'hidden'
								} text-white text-[24px]`}
							>
								No Posts Yet!
							</StyledText>
						</StyledView> */}
						</>
					}
					renderItem={({ item }) => {
						if (hiddenPosts.includes(item)) return <></>;
						return (
							<Post
								content={item.body}
								circles={item.circles}
								id={item.id}
								metadata={item.metadata}
								name={item.name}
								profile-img={item.profile_img}
								settings={item.settings}
								timestamp={item.timestamp}
								title={item.title}
								type={item.type}
								user={item.user}
								edited={item.edited}
							/>
						);
					}}
					keyExtractor={(item) => item.id}
					extraData={globalReload}
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
		</StyledView>
	);
}
