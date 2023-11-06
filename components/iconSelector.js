import React, {
	useEffect,
	useState,
	useRef,
	forwardRef,
	useImperativeHandle
} from 'react';
import {
	View,
	Text,
	FlatList,
	Animated,
	Pressable,
	TouchableOpacity
} from 'react-native';
import { styled } from 'nativewind';
import Ionicons from '@expo/vector-icons/Ionicons';

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledIcon = styled(Ionicons);
const StyledFlatList = styled(FlatList);
const StyledAnimView = styled(Animated.View);
const StyledPressable = styled(Animated.createAnimatedComponent(Pressable));
const StyledOpacity = styled(TouchableOpacity);

const IconSelector = forwardRef(({ close }, ref) => {
	const icons = [
		{
			title: 'Transportation',
			icons: [
				'trail-sign',
				'airplane',
				'boat',
				'bus',
				'car',
				'subway',
				'globe',
				'compass',
				'location',
				'map',
				'navigate',
				'paper-plane'
			]
		},
		{
			title: 'Sports',
			icons: [
				'american-football',
				'baseball',
				'basketball',
				'football',
				'bicycle',
				'golf',
				'tennisball'
			]
		},
		{
			title: 'Health & Fitness',
			icons: [
				'barbell',
				'eye',
				'body',
				'fitness',
				'ear',
				'medical',
				'medkit',
				'pulse'
			]
		},
		{
			title: 'Food & Drink',
			icons: [
				'cafe',
				'fast-food',
				'ice-cream',
				'pizza',
				'nutrition',
				'restaurant'
			]
		},
		{
			title: 'Technology',
			icons: [
				'power',
				'radio',
				'desktop',
				'camera',
				'headset',
				'mic',
				'laptop',
				'videocam',
				'chatbox-ellipses',
				'chatbubble-ellipses',
				'chatbubbles',
				'code-slash',
				'cog',
				'reader',
				'reload',
				'attach',
				'sync',
				'settings'
			]
		},
		{
			title: 'Entertainment',
			icons: [
				'film',
				'game-controller',
				'headset',
				'musical-note',
				'musical-notes',
				'play',
				'tv',
				'disc'
			]
		},
		{
			title: 'Education',
			icons: ['book', 'library', 'school', 'flask', 'rocket', 'language']
		},
		{
			title: 'Finance',
			icons: ['cash', 'card', 'wallet', 'calculator']
		},
		{
			title: 'Nature',
			icons: [
				'leaf',
				'flower',
				'rose',
				'bug',
				'planet',
				'earth',
				'moon',
				'sunny',
				'flame',
				'flash',
				'snow',
				'cloud',
				'cloudy-night',
				'rainy',
				'partly-sunny',
				'thunderstorm',
				'paw',
				'umbrella',
				'bonfire'
			]
		},
		{
			title: 'Shapes',
			icons: [
				'square',
				'triangle',
				'ellipse',
				'shapes',
				'shield',
				'star',
				'infinite',
				'cube',
				'grid',
				'heart',
				'radio-button-off',
				'radio-button-on'
			]
		},
		{
			title: 'People',
			icons: [
				'female',
				'woman',
				'male',
				'man',
				'hand-left',
				'hand-right',
				'people',
				'person',
				'happy',
				'finger-print',
				'home'
			]
		},
		{
			title: 'Work',
			icons: [
				'briefcase',
				'business',
				'construct',
				'hammer',
				'mail',
				'newspaper',
				'today'
			]
		},
		{
			title: 'Other',
			icons: [
				'options',
				'aperture',
				'color-palette',
				'contrast',
				'flag',
				'glasses',
				'images',
				'key',
				'ribbon',
				'trophy'
			]
		}
	];
	const [icon, setIcon] = useState('');
	const [opened, setOpened] = useState(false);
	const opacity = useRef(new Animated.Value(0)).current;
	const opacityInterpolation = opacity.interpolate({
		inputRange: [0, 1],
		outputRange: [0, 1]
	});
	const bgOpacityInterpolation = opacity.interpolate({
		inputRange: [0, 1],
		outputRange: [0, 0.5]
	});

	const toggleSelector = (direction) => {
		if (direction) setOpened(direction);
		else setOpened(!opened);
		Animated.timing(opacity, {
			toValue: opened ? 0 : 1,
			duration: 400,
			useNativeDriver: false
		}).start();
	};

	useImperativeHandle(ref, () => ({
		toggleSelector,
		icon
	}));

	function renderIcon({ item, index }) {
		return (
			<StyledOpacity
				key={`icon${index}`}
				onPress={() => {
					setIcon(item);
					toggleSelector(false);
					close();
				}}
				className='w-[25%] aspect-square items-center justify-center mb-1'
			>
				<StyledIcon
					key={index}
					name={item}
					size={40}
					color={'#ffffff'}
				/>
			</StyledOpacity>
		);
	}

	function renderCategory({ item }) {
		return (
			<View key={item.title} className='flex flex-column w-[100%]'>
				<StyledView
					className={`${
						item.title == 'Transportation' ? 'hidden' : ''
					} h-[1px] bg-outline w-full`}
				/>
				<Text className='text-offwhite text-[18px] mt-[10px] mb-[5px]'>
					{item.title}
				</Text>
				<StyledFlatList
					data={item.icons}
					renderItem={renderIcon}
					keyExtractor={(item, index) => `icon${index}`}
					numColumns={4}
					contentContainerStyle={{ justifyContent: 'space-around' }}
				/>
			</View>
		);
	}

	return (
		<>
			<StyledPressable
				style={{ opacity: bgOpacityInterpolation }}
				pointerEvents={opened ? 'auto' : 'none'}
				onPress={() => {
					toggleSelector(false);
					close();
				}}
				className='absolute top-0 left-0 bg-offblack w-screen h-screen'
			/>
			<StyledAnimView
				style={{ opacity: opacityInterpolation }}
				pointerEvents={opened ? 'auto' : 'none'}
				className='absolute -translate-x-[150px] left-1/2 top-[60%] -translate-y-[280px] w-[80%] px-[15px] max-w-[300px] h-[85%] max-h-[500px] bg-offblack border border-[#3D3D3D] rounded-[20px] items-center'
			>
				<StyledView className='w-full h-full'>
					<StyledFlatList
						data={icons}
						stickyHeaderIndices={[0]}
						stickyHeaderHiddenOnScroll={true}
						ListHeaderComponent={
							<StyledView className='bg-offblack pt-[10px]'>
								<StyledText className='text-offwhite font-bold text-3xl text-center mb-3'>
									Select an Icon
								</StyledText>
							</StyledView>
						}
						renderItem={renderCategory}
						keyExtractor={(item, index) => `category${index}`}
					/>
				</StyledView>
			</StyledAnimView>
		</>
	);
});

export { IconSelector };
