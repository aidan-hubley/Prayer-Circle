import React, { useState, useEffect } from 'react';
import {
	View,
	ScrollView,
	StatusBar,
	RefreshControl,
	Dimensions,
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
	readData
} from '../../backend/firebaseFunctions';

const StyledView = styled(View);
const StyledScrollView = styled(ScrollView);
const StyledText = styled(Text);
const StyledGradient = styled(LinearGradient);
const StyledFlatList = styled(FlatList);

export default function FeedPage() {
	const [dataArray, setDataArray] = useState([]);
	const [refreshing, setRefreshing] = useState(false);

	function pullData() {
		setRefreshing(true);
		readData(`prayer_circle/posts`).then((data) => {
			let dataArray = data ? Object.entries(data) : [];
			dataArray.sort((a, b) => {
				return b[1].timestamp - a[1].timestamp;
			});
			setDataArray(dataArray);
			setRefreshing(false);
		});
	}

	useEffect(() => {
		pullData();
	}, []);

	let insets = useSafeAreaInsets();

	return (
		<StyledView className='flex-1 bg-offblack'>
			<StyledView className='flex-1'>
				<StyledFlatList
					data={dataArray}
					style={{ paddingHorizontal: 15 }}
					estimatedItemSize={100}
					showsHorizontalScrollIndicator={false}
					refreshControl={
						<RefreshControl
							onRefresh={pullData}
							refreshing={refreshing}
							tintColor='#ebebeb'
						/>
					}
					ListHeaderComponent={
						dataArray && dataArray.length > 0 ? (
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
						dataArray && dataArray.length > 0 ? (
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
						<StyledView className='w-full h-full flex items-center justify-center'>
							<StyledText className='text-white text-[24px]'>
								No Posts Yet!
							</StyledText>
						</StyledView>
					}
					renderItem={({ item }) => (
						<Post
							user={item[1].name}
							img={item[1].profile_img}
							imgshow={true}
							title={item[1].title}
							timestamp={`${item[1].timestamp}`}
							content={item[1].text}
							icon='heart-outline'
							id={item[0]}
							refresh={() => pullData()}
							owned={false}
							interaction={0}
							edited={true}
						/>
					)}
					keyExtractor={(item) => item[0]}
				/>
			</StyledView>

			<StyledView
				style={{
					bottom:
						insets.bottom < 10 ? insets.bottom + 15 : insets.bottom
				}}
				className='absolute flex flex-row justify-center w-screen'
			>
				<Circle />
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
