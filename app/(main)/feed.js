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
import Animated, {
	FadeIn,
	FadeOut,
	LinearTransition
} from 'react-native-reanimated';
import { Flow } from 'react-native-animated-spinkit';

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
	/* TODO: retrieve hidden posts so feed can be filtered */
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
				<Animated.FlatList
					/* itemLayoutAnimation={LinearTransition} */
					data={postList}
					onEndReachedThreshold={0.3}
					windowSize={10}
					onEndReached={async () => {
						if (postList.length < 8 || !auth?.currentUser) return;
						let newPosts = await fetchPosts(
							filterTarget,
							false,
							circles,
							lastVisibleDoc
						);
						setPostList([...postList, ...newPosts]);
					}}
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
							<Animated.View
								entering={FadeIn}
								exiting={FadeOut}
								className='w-full flex items-center mb-[10px] pt-3'
								style={{
									height:
										insets.top + (lastFetch === 0 ? 60 : 90)
								}}
							>
								{lastFetch > 0 && postList.length >= 8 && (
									<Flow size={40} color='#ebebeb' />
								)}
							</Animated.View>
						) : (
							<></>
						)
					}
					ListEmptyComponent={
						/* TODO: implement loading indicator */
						<></>
					}
					renderItem={({ item }) => {
						if (hiddenPosts.includes(item)) return <></>;
						return (
							<Post
								content={item.content}
								circles={item.circles}
								id={item.id}
								metadata={item.metadata}
								name={item.name}
								profile_img={item.profile_img}
								settings={item.settings}
								timestamp={item.timestamp}
								title={item.title}
								type={item.type}
								user={item.user}
								edited={item.edited}
								commentsEnabled={item.settings.comments_enabled}
								interactionVisibility={
									item.settings.interactions_visibility
								}
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
