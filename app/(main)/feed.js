import React from 'react';
import { View, ScrollView, StatusBar, TouchableOpacity } from 'react-native';
import { Circle } from '../../components/Circle';
import { styled } from 'nativewind';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Post } from '../../components/Post';
import { Button } from '../../components/Buttons';
import { usePathname } from 'expo-router/src/hooks';
import { toggleMainNav } from './_layout';
import { LinearGradient } from 'expo-linear-gradient';
import * as Device from 'expo-device';
import { router } from '../../backend/config';

const StyledView = styled(View);
const StyledScrollView = styled(ScrollView);
const StyledGradient = styled(LinearGradient);

export default function Page() {
	let insets = useSafeAreaInsets();
	let topButtonInset = insets.top > 30 ? insets.top : insets.top + 10;

  return (
		<StyledView className='flex-1 bg-offblack'>
			<StyledView className='flex-1 items-center' w-screen>
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
						<StyledView className='w-full h-[110px]' />
					</StyledView>
				</StyledScrollView>
			</StyledView>

			<StyledView className='absolute bottom-[3%] flex flex-row justify-center w-screen'>
				<Circle size='w-[80px] h-[80px]' />
			</StyledView>

			<StyledGradient
				pointerEvents='none'
				start={{ x: 0, y: 0.3 }}
				end={{ x: 0, y: 1 }}
				style={{ height: insets.top + 50 }}
				className='absolute w-screen'
				colors={['#121212ee', 'transparent']}
			/>
			<StyledView	style={{ top: topButtonInset }} className={`w-screen absolute items-center px-[20px]`}>
				<Button
					btnStyles='w-[200px] w-min-[175px] w-max-[225px] self-center'
					height={'h-[50px]'}
					title='Circle Name'
					href='/circleSettings'
				/>
			</StyledView>
			<StatusBar barStyle={'light-content'} />
		</StyledView>
	);
}
