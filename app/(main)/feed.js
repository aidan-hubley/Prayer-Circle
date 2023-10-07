import React, { useEffect } from 'react';
import {
	SafeAreaView,
	Text,
	View,
	Image,
	ScrollView,
	StatusBar
} from 'react-native';
import { Circle } from '../../components/Circle';
import { styled } from 'nativewind';
import { Post } from '../../components/Post';
import { Button } from '../../components/Buttons';
import { usePathname } from 'expo-router/src/hooks';
import { toggleMainNav } from './_layout';

const StyledImage = styled(Image);
const StyledView = styled(View);
const StyledText = styled(Text);
const StyledSafeArea = styled(SafeAreaView);
const StyledScrollView = styled(ScrollView);

export default function Page() {
	return (
		<StyledSafeArea className='bg-offblack border' style={{ flex: 1 }}>
			<StyledView className='flex-1 items-center' w-screen>
				<StyledScrollView className='w-full px-[13px]'>
					{/* if in filtered feed */}
					{/* Should use this: "left-[1/2] transform -translate-x-1/2" to be centered */}
					<Button
						btnStyles='sticky absolute top-20 left-[25.5%] w-[200px] w-min-[175px] w-max-[225px]'
						height={'h-[60px]'}
						iconSize={40}					
						title='Circle Name'
						href='/circleSettings'
					/>
					<StyledView className='w-full flex justify-center items-center'>
						<StyledView className='w-full h-[95px]' />
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
							end={true}
						/>
						<StyledView className='w-full h-[125px]' />
					</StyledView>
				</StyledScrollView>
			</StyledView>

			<StyledView className='absolute bottom-10 flex flex-row justify-center w-screen'>
				<Circle size='w-[90px] h-[90px]' />
			</StyledView>
		</StyledSafeArea>
	);
}
