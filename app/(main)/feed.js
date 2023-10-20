import React, { useEffect } from 'react';
import {
	Text,
	View,
	Image,
	ScrollView,
	SafeAreaView,
	StatusBar
} from 'react-native';
import { Circle } from '../../components/Circle';
import { styled } from 'nativewind';
import { Post } from '../../components/Post';
import { LinearGradient } from 'expo-linear-gradient';
import * as Device from 'expo-device';

const StyledView = styled(View);
const StyledScrollView = styled(ScrollView);
const StyledGradient = styled(LinearGradient);

export default function Page() {
	let ExtraSafeArea =
		Device.brand === 'Apple' &&
		(Device.modelName.split(' ')[1] == 'X' ||
			Device.modelName.split(' ')[1] >= 11);
	return (
		<StyledView className='flex-1 bg-offblack'>
			<StyledView className='flex-1 items-center' w-screen>
				<StyledScrollView className='w-full px-[13px]'>
					<StyledView className='w-full flex justify-center items-center'>
						<StyledView
							className={`w-full ${
								ExtraSafeArea ? 'h-[115px]' : 'h-[80px]'
							} `}
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
				className='absolute w-screen h-[150px]'
				colors={['#121212', 'transparent']}
			/>
			<StatusBar barStyle={'light-content'} />
		</StyledView>
	);
}
