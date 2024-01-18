import React, { useRef, useState } from 'react';
import { Stack } from 'expo-router';
import {
	Text,
	View,
	StatusBar,
	ScrollView,
	TouchableOpacity
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { styled } from 'nativewind';
import Ionicons from '@expo/vector-icons/Ionicons';
import { PostTypeSelector } from '../../components/PostTypeSelector';
import { router } from '../../backend/config';

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledScrollView = styled(ScrollView);
const StyledOpacity = styled(TouchableOpacity);

export default function JournalPage() {
	const typeRef = useRef();
	const [title, setTitle] = useState('Prayers');

	const handleSelect = (index) => {
	    if (index == 0) {
      		setTitle('Praises');
		} else if (index == 1) {
      		setTitle('Prayers');
		} else if (index == 2) {
      		setTitle('Events');
		}
	};

	let insets = useSafeAreaInsets();
	return (
		<StyledView className='bg-offblack h-screen w-screen'>
			<StyledScrollView className='px-[15px]'>
				<StyledView
					className='w-screen'
					style={{ height: insets.top + 100 }}
				></StyledView>
				<StyledView
					className='w-full items-center'
				>
					<StyledText className='w-full text-3xl font-bold text-center text-offwhite'>
						{title}
					</StyledText>
					<StyledView className='flex flex-col w-full justify-start items-center rounded-b-[20px] pt-[4px] pb-[10px]'>
					</StyledView>
				</StyledView>	
				<StyledView
					// style={{bottom:	insets.bottom < 10 ? insets.bottom + 75 : insets.bottom + 95}}
					className='px-[20px]'
				>
					<PostTypeSelector ref={typeRef} onSelect={handleSelect} />
				</StyledView>		
			</StyledScrollView>
		</StyledView>
	);
}
