import React, { useEffect, useRef, useState } from 'react';
import { View, Dimensions, Text } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { styled } from 'nativewind';
import { ExpandableButton, Button } from '../../components/Buttons';
import { Circle } from '../../components/Circle';
import FeedPage from './feed.js';
import ProfilePage from './profile.js';
import JournalPage from './journal.js';
import PagerView from 'react-native-pager-view';
import { getFilterCircles } from '../../backend/firebaseFunctions.js';
import { Filter } from '../../components/Filter.js';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { useStore } from '../global.js';
import { auth } from '../../backend/config.js';

const StyledView = styled(View);

export default function Layout() {
	const [swipingEnabled, setSwipingEnabled] = useState(true);
	const profileRef = useRef();
	const journalRef = useRef();
	const pagerRef = useRef();
	const circleNameRef = useRef();
	const filterRef = useRef();
	const circleRef = useRef();
	const [
		filterName,
		globalReload,
		filterReload,
		circles,
		setGlobalReload,
		setFilterReload,
		setCircles
	] = useStore((state) => [
		state.currentFilterName,
		state.globalReload,
		state.filterReload,
		state.circles,
		state.setGlobalReload,
		state.setFilterReload,
		state.setCircles
	]);
	let insets = useSafeAreaInsets();
	let topButtonInset = insets.top > 30 ? insets.top : insets.top + 10;
	let screenWidth = Dimensions.get('window').width;
	let circeNameWidth = screenWidth - 170;

	const setUp = async () => {
		let gc = await getFilterCircles();
		setCircles(gc);
	};

	useEffect(() => {
		setUp();
	}, []);

	useEffect(() => {
		setGlobalReload(false);
	}, [globalReload]);
	useEffect(() => {
		(async () => {
			if (filterReload) {
				let gc = await getFilterCircles();
				setCircles(gc);
				setFilterReload(false);
			}
		})();
	}, [filterReload]);

	return (
		<BottomSheetModalProvider>
			<StyledView className='bg-offblack flex-1'>
				<PagerView
					onTouchEvent={(e) => {}}
					scrollEnabled={swipingEnabled}
					ref={pagerRef}
					style={{ flex: 1 }}
					initialPage={1}
					onPageSelected={(e) => {
						let pos = e.nativeEvent.position;
						if (pos == 0) {
							journalRef.current.toggleButton('expand');
							profileRef.current.toggleButton('collapse');
							circleNameRef.current.toggleShown(false);
						} else if (pos == 1) {
							journalRef.current.toggleButton('collapse');
							profileRef.current.toggleButton('collapse');
							circleNameRef.current.toggleShown(true);
						} else if (pos == 2) {
							journalRef.current.toggleButton('collapse');
							profileRef.current.toggleButton('expand');
							circleNameRef.current.toggleShown(false);
						}
					}}
				>
					<JournalPage key='0' />
					<FeedPage key='1' />
					<ProfilePage key='2' />
				</PagerView>
			</StyledView>

			<Filter
				data={circles}
				ref={filterRef}
				setPressed={circleRef?.current?.setPressed}
				touchEvents={swipingEnabled}
				toggleSwiping={setSwipingEnabled}
			/>
			<StyledView
				style={{
					bottom:
						insets.bottom < 10 ? insets.bottom + 15 : insets.bottom,
					width: Dimensions.get('window').width - 200
				}}
				className='absolute flex flex-row mx-[100px] justify-center z-0'
			>
				<Circle
					ref={circleRef}
					toggleSwiping={setSwipingEnabled}
					filter={filterRef}
				/>
			</StyledView>

			<StyledView
				style={{ top: topButtonInset, width: circeNameWidth }}
				className='absolute mx-[85px]'
			>
				<Button
					title={filterName}
					height='h-[50]'
					width='w-full'
					href='/circleSettings'
					ref={circleNameRef}
				/>
			</StyledView>

			<StyledView
				style={{ top: topButtonInset }}
				className='absolute left-[20px]'
			>
				<ExpandableButton
					height={'h-[50px]'}
					iconSize={35}
					icon='journal-outline'
					expanded={false}
					expandedWidth={'70%'}
					collapsedWidth={50}
					title='Journal'
					ref={journalRef}
					press={() => {
						if (profileRef.current.pressed) {
							profileRef.current.toggleButton();
						}
						if (journalRef.current.pressed) {
							circleNameRef.current.toggleShown(true);
							pagerRef.current.setPage(1);
						} else {
							circleNameRef.current.toggleShown(false);
							pagerRef.current.setPage(0);
						}
					}}
				/>
			</StyledView>
			<StyledView
				style={{ top: topButtonInset }}
				className='absolute right-[20px]'
			>
				<ExpandableButton
					height={'h-[50px]'}
					iconSize={40}
					icon='person-circle-outline'
					expanded={false}
					expandedWidth={'70%'}
					collapsedWidth={50}
					title='Profile'
					ref={profileRef}
					press={() => {
						if (journalRef.current.pressed) {
							journalRef.current.toggleButton();
						}
						if (profileRef.current.pressed) {
							circleNameRef.current.toggleShown(true);
							pagerRef.current.setPage(1);
						} else {
							circleNameRef.current.toggleShown(false);
							pagerRef.current.setPage(2);
						}
					}}
				/>
			</StyledView>
		</BottomSheetModalProvider>
	);
}
