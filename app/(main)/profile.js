import React from 'react';
import { Text, View, Image, ScrollView } from 'react-native';
import { styled } from 'nativewind';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button } from '../../components/Buttons';
import { Post } from '../../components/Post';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { signOut } from 'firebase/auth';
import { router, auth } from '../../backend/config';

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledScrollView = styled(ScrollView);
const StyledImage = styled(Image);
const StyledGradient = styled(LinearGradient);

export default function ProfilePage() {
	let insets = useSafeAreaInsets();
	return (
		<StyledView className='bg-offblack'>
			<StyledScrollView className='px-[15px] pt-[145px] '>
				<StyledView className='flex items-center w-full'>
					<StyledView className='w-[175px] h-[175px] rounded-[20px] border-2 border-offwhite'>
						<StyledImage
							className='w-full h-full rounded-[18px]'
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
						imgshow={false}
						title='WWWW WWW WW W wwww www ww w WWWW WWW WW W wwww www ww w'
						timestamp={1695846631107}
						content='Description text lamda latin nonesense bla bla bla text lamda latin nonesense bla bla bla text lamda latin nonesense bla bla bla text lamda latin nonesense bla bla bla bla bla bla bla bla'
						icon='heart-outline'
						owned={true}
						interaction={10}
						edited={false}
					/>
					<Post
						user='Alex Muresan'
						img='https://i.imgur.com/0y8Ftya.png'
						imgshow={false}
						title='test test title test test title 1 2 3 4 test test title test test test test test test'
						timestamp={1695846631107}
						content='Description text lamda latin nonesense bla bla bla text lamda latin'
						icon='heart-outline'
						owned={true}
						interaction={5}
						edited={true}
					/>
					<Post
						user='Alex Muresan'
						img='https://i.imgur.com/0y8Ftya.png'
						imgshow={false}
						title='IIII III II I iiii iii ii i IIII III II I iiii iii ii i'
						timestamp={1695846631107}
						content='Description text lamda latin nonesense bla bla bla text lamda latin nonesense bla bla bla text lamda latin nonesense bla bla bla text lamda latin nonesense bla bla bla text lamda latin nonesense bla bla bla text lamda latin nonesense bla bla bla text lamda latin nonesense bla bla bla text lamda latin nonesense bla bla bla text lamda latin nonesense bla bla bla text lamda latin nonesense bla bla bla text lamda latin nonesense bla bla bla '
						icon='heart-outline'
						owned={true}
						interaction={2}
						edited={true}
					/>
				</StyledView>
				<StyledView className='w-full flex mt-3 items-center'>
					<Button
						title='Sign Out'
						width='w-[50%]'
						press={() => {
							signOut(auth);
							AsyncStorage.removeItem('user');
							router.replace('/login');
						}}
					/>
				</StyledView>
				<StyledView className='h-[230px]'></StyledView>
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
			<StyledGradient
				pointerEvents='none'
				start={{ x: 0, y: 0.1 }}
				end={{ x: 0, y: 1 }}
				style={{ height: insets.top + 60 }}
				className='absolute w-screen'
				colors={['#121212', 'transparent']}
			/>
		</StyledView>
	);
}
