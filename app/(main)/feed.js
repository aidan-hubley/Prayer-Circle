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
import { readData, getPosts } from '../../backend/firebaseFunctions';
import { useStore } from '../global';
import { auth } from '../../backend/config';
import { NotifierWrapper } from 'react-native-notifier';

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledGradient = styled(LinearGradient);

export default function FeedPage() {
	const [refreshing, setRefreshing] = useState(false);
	const [postList, setPostList] = useState([]);
	const [renderIndex, setRenderIndex] = useState(0);
	const [initialLoad, setInitialLoad] = useState('loading');
	const [scrolling, setScrolling] = useState(false);
	const [filterTarget, globalReload] = useStore((state) => [
		state.filter,
		state.globalReload
	]);

	async function setUpFeed() {
		if (auth.currentUser) {
			setRenderIndex(8);
			let gp = await getPosts(filterTarget);
			setPostList(gp);
			setInitialLoad('loaded');
			setRefreshing(false);
		}
	}
	useEffect(() => {
		setRefreshing(true);
		setUpFeed();
	}, [filterTarget]);
	useEffect(() => {
		if (globalReload) {
			setRefreshing(true);
			setUpFeed();
		}
	}, [globalReload]);

	let insets = useSafeAreaInsets();

	return (
		<StyledView className='w-screen flex-1 bg-offblack'>
			<StyledView className='w-screen flex-1'>
				<FlatList
					data={postList.slice(0, renderIndex)}
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
						setRenderIndex((prev) => {
							if (prev + 8 > postList.length) {
								return postList.length;
							}
							return prev + 8;
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
							refreshing={
								initialLoad === 'loading' ? false : refreshing
							}
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
						<StyledView
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
						</StyledView>
					}
					renderItem={({ item }) => {
						return <Post id={item} />;
					}}
					keyExtractor={(item) => item}
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
