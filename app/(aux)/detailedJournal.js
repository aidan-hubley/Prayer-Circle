import React from 'react';
import {
	Text,
	View,
	Image,
	StatusBar,
	ScrollView
} from 'react-native';
import { Button } from '../../components/Buttons';
import { styled } from 'nativewind';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets, SafeAreaView } from 'react-native-safe-area-context';
import { Post } from '../../components/Post';
import { useLocalSearchParams } from 'expo-router';

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledScrollView = styled(ScrollView);
const StyledGradient = styled(LinearGradient);

export default function Page() {
	let insets = useSafeAreaInsets();
	const params = useLocalSearchParams();
	let title = params.title;
	let topInset = insets.top > 30 ? insets.top : insets.top + 10;

	return (
		<StyledView className='flex-1 bg-offblack'>
			<StyledScrollView className='w-full px-[13px]'>
				<StyledView className='w-full flex justify-center items-center'>
					<StyledView
						style={{ height: insets.top + 60 }}
						className={`w-full`}
					/>
					<Post
						user='Alex Muresan'
						img='https://i.imgur.com/0y8Ftya.png'
						title='Pray for my dog he is very sick'
						timestamp={1695846631107}
						content='He is very sick blah blah blah blah oh blah blah blah blah blah blah blah
blah blah blah blah blah blah blah oh no he’s gonna die ahhhhhhhhhhh'
						icon='request'
					/>
					<Post
						user='Alex Muresan'
						img='https://i.imgur.com/0y8Ftya.png'
						title='Pray for my dog he is very sick'
						timestamp={1695846631107}
						content='He is very sick blah blah blah blah oh blah blah blah blah blah blah blah
blah blah blah blah blah blah blah oh no he’s gonna die ahhhhhhhhhhh'
						icon='request'
					/>
					<Post
						user='Alex Muresan'
						img='https://i.imgur.com/0y8Ftya.png'
						title='Pray for my dog he is very sick'
						timestamp={1695846631107}
						content='He is very sick blah blah blah blah oh blah blah blah blah blah blah blah
blah blah blah blah blah blah blah oh no he’s gonna die ahhhhhhhhhhh'
						icon='request'
					/>
					<Post
						user='Alex Muresan'
						img='https://i.imgur.com/0y8Ftya.png'
						title='Pray for my dog he is very sick'
						timestamp={1695846631107}
						content='He is very sick blah blah blah blah oh blah blah blah blah blah blah blah
blah blah blah blah blah blah blah oh no he’s gonna die ahhhhhhhhhhh'
						icon='request'
					/>
					<Post
						user='Alex Muresan'
						img='https://i.imgur.com/0y8Ftya.png'
						title='Pray for my dog he is very sick'
						timestamp={1695846631107}
						content='He is very sick blah blah blah blah oh blah blah blah blah blah blah blah
blah blah blah blah blah blah blah oh no he’s gonna die ahhhhhhhhhhh'
						icon='request'
					/>
					<Post
						user='Alex Muresan'
						img='https://i.imgur.com/0y8Ftya.png'
						title='Pray for my dog he is very sick'
						timestamp={1695846631107}
						content='He is very sick blah blah blah blah oh blah blah blah blah blah blah blah
blah blah blah blah blah blah blah oh no he’s gonna die ahhhhhhhhhhh'
						icon='request'
					/>
					<Post
						user='Alex Muresan'
						img='https://i.imgur.com/0y8Ftya.png'
						title='Pray for my dog he is very sick'
						timestamp={1695846631107}
						content='He is very sick blah blah blah blah oh blah blah blah blah blah blah blah
blah blah blah blah blah blah blah oh no he’s gonna die ahhhhhhhhhhh'
						icon='request'
					/>
					<Post
						user='Alex Muresan'
						img='https://i.imgur.com/0y8Ftya.png'
						title='Pray for my dog he is very sick'
						timestamp={1695846631107}
						content='He is very sick blah blah blah blah oh blah blah blah blah blah blah blah
blah blah blah blah blah blah blah oh no he’s gonna die ahhhhhhhhhhh'
						icon='request'
					/>
					<Post
						user='Alex Muresan'
						img='https://i.imgur.com/0y8Ftya.png'
						title='Pray for my dog he is very sick'
						timestamp={1695846631107}
						content='He is very sick blah blah blah blah oh blah blah blah blah blah blah blah
blah blah blah blah blah blah blah oh no he’s gonna die ahhhhhhhhhhh'
						icon='request'
						end={true}
					/>
					<StyledView
						className='w-full'
						style={{ height: insets.bottom }}
					/>
				</StyledView>
			</StyledScrollView>

			<StyledGradient
				pointerEvents='none'
				start={{ x: 0, y: 0.3 }}
				end={{ x: 0, y: 1 }}
				style={{ height: insets.top + 50 }}
				className='absolute w-screen flex items-center justify-end'
				colors={['#121212ee', 'transparent']}
			>
				<StyledText
					style={{ top: topInset }}
					className='absolute text-3xl text-offwhite font-bold'
				>
					{title}
				</StyledText>
			</StyledGradient>

			<StyledView
					className='absolute flex flex-row w-screen px-[15px] justify-between'
					style={{ bottom: insets.bottom }}
				>
				<StyledView></StyledView>
				<Button
					height={'h-[50px]'}
					width={'w-[50px]'}
					iconSize={30}
					icon='journal-outline'
					expanded={false}
					href='/mainViewLayout'
				/>
			</StyledView>
			<StatusBar barStyle={'light-content'} />
		</StyledView>
	);
}
