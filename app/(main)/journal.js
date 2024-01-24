import React, { useEffect, useRef, useState } from 'react';
import { Stack } from 'expo-router';
import {
	Text,
	View,
	StatusBar,
	ScrollView,
	TouchableOpacity,
	FlatList
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { styled } from 'nativewind';
import Ionicons from '@expo/vector-icons/Ionicons';
import { PostTypeSelector } from '../../components/PostTypeSelector';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Post } from '../../components/Post';
import { useStore } from '../global';

const StyledView = styled(View);

export default function JournalPage() {
	const typeRef = useRef();
	const [posts, setPosts] = useState([]);
	const [journalReload, setJournalReload] = useStore((state) => [
		state.journalReload,
		state.setJournalReload
	]);

	let insets = useSafeAreaInsets();

	const setUp = async () => {
		let bookmarkedPosts = await AsyncStorage.getItem('bookmarkedPosts');
		setPosts(JSON.parse(bookmarkedPosts));
	};

	useEffect(() => {
		setUp();
	}, []);
	useEffect(() => {
		if (journalReload) {
			setUp();
			setJournalReload(false);
		}
	}, [journalReload]);

	return (
		<StyledView className='bg-offblack h-screen w-screen'>
			<StyledView
				className='w-screen'
				style={{ height: insets.top + 60 }}
			></StyledView>
			<StyledView
				// style={{bottom:	insets.bottom < 10 ? insets.bottom + 75 : insets.bottom + 95}}
				className='px-[20px]'
			>
				<PostTypeSelector ref={typeRef} />
			</StyledView>
			<FlatList
				data={posts}
				style={{ paddingHorizontal: 15 }}
				renderItem={({ item }) => (
					<Post
						user={item.data.name}
						img={item.data.profile_img}
						title={item.data.title}
						timestamp={`${item.data.timestamp}`}
						content={item.data.text}
						icon={item.data.type}
						id={item.id}
						edited={item.data.edited}
						comments={item.data.comments}
						data={item.data}
					/>
				)}
				keyExtractor={(item) => item.id}
			/>
		</StyledView>
	);
}
