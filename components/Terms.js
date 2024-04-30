import {
	Text,
	View,
	ScrollView,
	TouchableOpacity,
	Dimensions
} from 'react-native';
import React, { forwardRef, useEffect, useState } from 'react';
import { styled } from 'nativewind';
import { SafeAreaView } from 'react-native-safe-area-context';
import { readData } from '../backend/firebaseFunctions';

const StyledSafeArea = styled(SafeAreaView);
const StyledView = styled(View);
const StyledText = styled(Text);
const StyledTouchableOpacity = styled(TouchableOpacity);

const Terms = forwardRef(() => {
	const [lastUpdated, setLastUpdated] = useState('');
	const [intro, setIntro] = useState('');
	const [tableOfContents, setTableOfContents] = useState([]);
	const [tos, setTOS] = useState([]);

	useEffect(() => {
		(async () => {
			const date = await readData(`prayer_circle/TOS/lastUpdated`);
			setLastUpdated(date);

			const intro = await readData(`prayer_circle/TOS/intro`);
			setIntro(intro);

			const table = await readData(`prayer_circle/TOS/tableOfContents`);
			setTableOfContents(table);

			const tos = [];
			for (let i = 1; i <= 26; i++) {
				const term = await readData(`prayer_circle/TOS/${i}`);
				tos.push(term);
			}
			setTOS(tos);
		})();
	}, []);

	return (
		<StyledView
			style={{
				height: Dimensions.get('window').height - 220
			}}
			className='bg-offblack border border-offwhite rounded-[10px] items-center '
		>
			<StyledText className='text-xl text-offwhite pt-[20px]'>
				TERMS AND CONDITIONS
			</StyledText>
			<StyledText className='text-offwhite pb-[10px]'>
				Last updated: {lastUpdated}
			</StyledText>
			<ScrollView className='w-full px-[16px] text-offwhite pt-[20px] pb-[10px] flex-1'>
				<StyledText className='text-offwhite py-2'>{intro}</StyledText>

				{tableOfContents.map((term, index) => {
					return (
						<StyledTouchableOpacity key={index}>
							<StyledText className='text-offwhite'>
								{index}. {term}
							</StyledText>
						</StyledTouchableOpacity>
					);
				})}

				{tos.map((term, index) => {
					return (
						<View key={index}>
							<StyledText className='text-xl text-offwhite pt-[10px]'>
								{index + 1}. {tableOfContents[index + 1]}
							</StyledText>
							<StyledText className='text-offwhite'>
								{term}
							</StyledText>
						</View>
					);
				})}
				<View className='w-full h-[30px]' />
			</ScrollView>
		</StyledView>
	);
});

export { Terms };
