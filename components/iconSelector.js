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
			icons: ['trail-sign', 'airplane', 'baseball', 'basketball', 'boat', 'bus', 'car', 'subway', 'globe', 'compass', 'location', 'map', 'navigate', ],
		},
		{
			title: 'Sports',
			icons: ['american-football', 'bicycle', 'golf', 'tennisball',],
		},
		{
			title: 'Health & Fitness',
			icons: ['barbell', 'eye', 'body', 'fitness', 'ear', 'bandage', 'medical', 'medkit', 'pulse',],
		},
		{
			title: 'Food & Drink',
			icons: ['cafe', 'fast-food', 'ice-cream', 'pizza', 'football', 'nutrition',],
		},
		{
			title: 'Technology',
			icons: ['power', 'radio', 'desktop', 'camera', 'headset', 'mic', 'laptop', 'videocam', 'chatbox-ellipses', 'chatbubble-ellipses', 'chatbubbles', 'code-slash', 'cog', 'attach', 'settings',],
		},
		{
			title: 'Entertainment',
			icons: ['film', 'game-controller', 'headset', 'mic', 'musical-note', 'musical-notes', 'play', 'tv', 'disc',],
		},
		{
			title: 'Education',
			icons: ['book', 'library', 'school', 'flask', 'rocket', 'language',],
		},
		{
			title: 'Finance',
			icons: ['cash', 'card', 'wallet', 'calculator',],
		},
		{
			title: 'Nature',
			icons: ['leaf', 'flower', 'planet', 'rose', 'earth', 'moon', 'cloud', 'cloudy-night', 'rainy', 'snow', 'sunny', 'partly-sunny', 'thunderstorm', 'umbrella', 'bonfire', 'bug',],
		},
		{
			title: 'Shapes',
			icons: ['square', 'triangle', 'ellipse', 'shapes', 'shield', 'star', 'infinite', 'cube', 'heart', 'radio-button-off', 'radio-button-on',],
		},		
		{
			title: 'People',
			icons: ['female', 'woman', 'male', 'man', 'hand-left', 'hand-right', 'happy', 'finger-print',],
		},
		{
			title: 'Work',
			icons: ['briefcase', 'business', 'construct', 'hammer', 'people', 'person', 'restaurant',],
		},
		{
			title: 'Other',
			icons: ['options', 'aperture', 'color-palette', 'contrast', 'flag', 'flame', 'flash', 'glasses', 'grid', 'home', 'images', 'key', 'mail', 'newspaper', 'paper-plane', 'paw', 'reader', 'reload', 'ribbon', 'sync', 'today', 'trophy',],
		},
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
				className='w-[60px] h-[60px] items-center justify-center mb-1'
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
			<View key={item.title} style={{width: '100%', flexDirection: 'column'}}>
				<View style={{height: 1, backgroundColor: '#ffffff', width: '100%'}} />
				<Text style={{color: '#ffffff', fontSize: 18, marginVertical: 10}}>{item.title}</Text>
				<StyledFlatList
					data={item.icons}
					renderItem={renderIcon}
					keyExtractor={(item, index) => `icon${index}`}
					numColumns={4}
					contentContainerStyle={{justifyContent: 'space-around'}}
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
				className='absolute -translate-x-[150px] left-1/2 top-[60%] -translate-y-[280px] w-[80%] p-[15px] max-w-[300px] h-[85%] max-h-[500px] bg-offblack border border-[#3D3D3D] rounded-[20px] content-center items-center'
			>
				<StyledText className='text-offwhite font-bold text-3xl text-center mb-3'>
                    Select an Icon
                </StyledText>
				<StyledFlatList
					data={icons}
					renderItem={renderCategory}
					keyExtractor={(item, index) => `category${index}`}
				/>
			</StyledAnimView>
		</>
	);
});

export { IconSelector };
