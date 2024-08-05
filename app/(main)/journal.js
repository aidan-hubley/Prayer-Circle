import React, { useEffect, useRef, useState } from 'react';
import { Text, View, FlatList, Dimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { styled } from 'nativewind';
import { PostTypeSelector } from '../../components/PostTypeSelector';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Post } from '../../components/Post';
import { useStore } from '../global';

const StyledView = styled(View);
const StyledText = styled(Text);

export default function JournalPage() {
	const [announcements, setAnnouncements] = useState([]);	
	const [prayers, setPrayers] = useState([]);
	const [praises, setPraises] = useState([]);
	const [events, setEvents] = useState([]);
	const [thoughts, setThoughts] = useState([]);
	const [page, setPage] = useState('prayers');
	const typeRef = useRef();
	const [journalReload, setJournalReload] = useStore((state) => [
		state.journalReload,
		state.setJournalReload
	]);

	let insets = useSafeAreaInsets();
	const vh = Dimensions.get('window').height;

	const setUp = async () => {
		setPrayers([]);
		setPraises([]);
		setEvents([]);
		const storedPosts = await AsyncStorage.getItem('bookmarkedPosts');
		const existingPosts = storedPosts ? JSON.parse(storedPosts) : [];

		existingPosts.forEach((post) => {
			if (post.data.type === 'announcement') {
				setAnnouncements((prev) => [...prev, post]);
			}
			if (post.data.type === 'request') {
				setPrayers((prev) => [...prev, post]);
			}
			if (post.data.type === 'praise') {
				setPraises((prev) => [...prev, post]);
			}
			if (post.data.type === 'event') {
				setEvents((prev) => [...prev, post]);
			}
			if (post.data.type === 'thought') {
				setThoughts((prev) => [...prev, post]);
			}
		});
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
		<StyledView className='bg-offblack h-screen w-screen flex-1'>
			<StyledView
				className='w-screen'
				style={{ height: insets.top + 60 }}
			></StyledView>
			<StyledView className='px-[20px]'>
				<PostTypeSelector
					ref={typeRef}
					onSelect={(index) => {
						if (index === 0) setPage('announcements');
						if (index === 1) setPage('praises');
						if (index === 2) setPage('prayers');
						if (index === 3) setPage('events');
						if (index === 4) setPage('thoughts');
					}}
				/>
			</StyledView>
			<StyledView className='flex-1'>
				<FlatList
					data={announcements}
					style={{
						display: page === 'announcements' ? 'flex' : 'none',
						paddingHorizontal: 15,
						flexGrow: 1
					}}
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
					ListEmptyComponent={() => (
						<StyledView
							className='w-full justify-center items-center text-center'
							style={{
								height: vh - (insets.top + insets.bottom + 200)
							}}
						>
							<StyledText className='font-bold text-[20px] text-offwhite text-center'>
								No Announcements Saved!
							</StyledText>
							<StyledText className='text-offwhite text-center mt-2 w-[60%]'>
								Save announcements on your feed to view them here!
							</StyledText>
						</StyledView>
					)}
				/>
				<FlatList
					data={prayers}
					style={{
						display: page === 'prayers' ? 'flex' : 'none',
						paddingHorizontal: 15,
						flexGrow: 1
					}}
					renderItem={({ item }) => (
						<Post
							user={item.data.name}
							img={item.data.profile_img}
							title={item.data.title}
							timestamp={`${item.data.timestamp}`}
							content={item.data.body}
							icon={item.data.type}
							id={item.id}
							edited={item.data.edited}
							comments={item.data.comments}
							data={item.data}
						/>
					)}
					keyExtractor={(item) => item.id}
					ListEmptyComponent={() => (
						<StyledView
							className='w-full justify-center items-center text-center'
							style={{
								height: vh - (insets.top + insets.bottom + 200)
							}}
						>
							<StyledText className='font-bold text-[20px] text-offwhite text-center'>
								No Prayer Requests Saved!
							</StyledText>
							<StyledText className='text-offwhite text-center mt-2 w-[60%]'>
								Save prayer requests on your feed to view them
								here!
							</StyledText>
						</StyledView>
					)}
				/>
				<FlatList
					data={praises}
					style={{
						display: page === 'praises' ? 'flex' : 'none',
						paddingHorizontal: 15,
						flexGrow: 1
					}}
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
					ListEmptyComponent={() => (
						<StyledView
							className='w-full justify-center items-center text-center'
							style={{
								height: vh - (insets.top + insets.bottom + 200)
							}}
						>
							<StyledText className='font-bold text-[20px] text-offwhite text-center'>
								No Praises Saved!
							</StyledText>
							<StyledText className='text-offwhite text-center mt-2 w-[60%]'>
								Save praises on your feed to view them here!
							</StyledText>
						</StyledView>
					)}
				/>
				<FlatList
					data={events}
					style={{
						display: page === 'events' ? 'flex' : 'none',
						paddingHorizontal: 15,
						flexGrow: 1
					}}
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
					ListEmptyComponent={() => (
						<StyledView
							className='w-full justify-center items-center text-center'
							style={{
								height: vh - (insets.top + insets.bottom + 200)
							}}
						>
							<StyledText className='font-bold text-[20px] text-offwhite text-center'>
								No Events Saved!
							</StyledText>
							<StyledText className='text-offwhite text-center mt-2 w-[60%]'>
								Save events on your feed to view them here!
							</StyledText>
						</StyledView>
					)}
				/>
				<FlatList
					data={thoughts}
					style={{
						display: page === 'thoughts' ? 'flex' : 'none',
						paddingHorizontal: 15,
						flexGrow: 1
					}}
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
					ListEmptyComponent={() => (
						<StyledView
							className='w-full justify-center items-center text-center'
							style={{
								height: vh - (insets.top + insets.bottom + 200)
							}}
						>
							<StyledText className='font-bold text-[20px] text-offwhite text-center'>
								No Thoughts Saved!
							</StyledText>
							<StyledText className='text-offwhite text-center mt-2 w-[60%]'>
								Save thoughts on your feed to view them here!
							</StyledText>
						</StyledView>
					)}
				/>
			</StyledView>
		</StyledView>
	);
}
