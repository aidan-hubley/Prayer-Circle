import React from 'react';
import {
	SafeAreaView,
	Text,
	View,
	StatusBar,
	Image,
	ScrollView
} from 'react-native';
import { styled } from 'nativewind';
import { Button } from '../../components/Buttons';
import { Post } from '../../components/Post';

const StyledSafeArea = styled(SafeAreaView);
const StyledView = styled(View);
const StyledText = styled(Text);
const StyledScrollView = styled(ScrollView);
const StyledImage = styled(Image);

export default function Page() {
	return (
		<StyledView className='bg-offblack'>
			<StyledScrollView className='px-[15px] pt-[145px] '>
				<StyledView className='flex items-center w-full'>
					<StyledView className='w-[175px] h-[175px] rounded-[20px] border-2 border-offwhite'>
						<StyledImage
							className='w-full h-full rounded-[20px]'
							source={{ uri: 'https://picsum.photos/1223' }}
						/>
					</StyledView>
					<StyledText className='font-bold text-offwhite text-[26px] mt-3'>
						Lucas Blakely
					</StyledText>
					<StyledText className=' text-offwhite text-[18px]'>
						lu2213@gmail.com
					</StyledText>
				</StyledView>
				<StyledView className='mt-3'>
					<Post
						user='Alex Muresan'
						img='https://i.imgur.com/0y8Ftya.png'
						title='Pray for my dog he is very sick'
						timestamp={1695846631107}
						content='He is very sick blah blah blah blah oh blah blah blah blah blah blah blah
blah blah blah blah blah blah blah oh no he’s gonna die ahhhhhhhhhhh'
						icon='heart-outline'
					/>
					<Post
						user='Alex Muresan'
						img='https://i.imgur.com/0y8Ftya.png'
						title='Pray for my dog he is very sick'
						timestamp={1695846631107}
						content='He is very sick blah blah blah blah oh blah blah blah blah blah blah blah
blah blah blah blah blah blah blah oh no he’s gonna die ahhhhhhhhhhh'
						icon='heart-outline'
					/>
					<Post
						user='Alex Muresan'
						img='https://i.imgur.com/0y8Ftya.png'
						title='Pray for my dog he is very sick'
						timestamp={1695846631107}
						content='He is very sick blah blah blah blah oh blah blah blah blah blah blah blah
blah blah blah blah blah blah blah oh no he’s gonna die ahhhhhhhhhhh'
						icon='heart-outline'
					/>
				</StyledView>
				<StyledView className='h-[180px]'></StyledView>
			</StyledScrollView>
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
			/>
		</StyledView>
	);
}
