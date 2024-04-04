import React, {
	useRef,
	forwardRef,
	useImperativeHandle,
	useEffect
} from 'react';
import { View, Image, TouchableOpacity, Animated } from 'react-native';
import { styled } from 'nativewind';

const StyledView = styled(View);
const StyledImg = styled(Image);
const StyledOpacity = styled(TouchableOpacity);
const StyledAnimatedView = styled(Animated.View);

const PostTypeSelector = forwardRef((props, ref) => {
	const selected = useRef(
		new Animated.Value(
			props.initialValue != undefined ? props.initialValue : 2
		)
	).current;
	const selectedInter = selected.interpolate({
		inputRange: [0, 1, 2, 3, 4],
		outputRange: ['6%', '26%', '46.25%', '66%', '86%']
	});

	const handlePress = (index) => {
		Animated.spring(selected, {
			toValue: index,
			duration: 200,
			useNativeDriver: false
		}).start();

		if (props.onSelect) props.onSelect(index);
	};

	useEffect(() => {
		if (props.onSelect) props.onSelect(1);
	}, []);

	const highlightPosition = {
		left: selectedInter
	};

	useImperativeHandle(ref, () => ({
		selected
	}));

	return (
		<StyledView
			className={`flex flex-row items-center justify-around h-[50px] w-full border border-outline rounded-full px-[15px] ${props.noYMargin ? '' : 'my-3'
				}`}
		>
			<StyledAnimatedView
				style={highlightPosition}
				className='absolute flex items-center justify-center rounded-full bg-[#EBEBEB2c] w-[55px] h-[36px]'
			></StyledAnimatedView>
			<StyledOpacity
				className='flex items-center justify-center w-[50px] h-[50px]'
				onPress={() => handlePress(0)}
			>
				<StyledImg
					source={require('../assets/post/annoucement.png')}
					className='w-[26px] h-[26px]'
				/>
			</StyledOpacity>
			<StyledOpacity
				className='flex items-center justify-center w-[50px] h-[50px]'
				onPress={() => handlePress(1)}
			>
				<StyledImg
					source={require('../assets/post/praise.png')}
					className='w-[26px] h-[26px]'
				/>
			</StyledOpacity>
			<StyledOpacity
				className='flex items-center justify-center w-[50px] h-[50px]'
				onPress={() => handlePress(2)}
			>
				<StyledImg
					source={require('../assets/post/prayer.png')}
					className='w-[26px] h-[26px]'
				/>
			</StyledOpacity>
			<StyledOpacity
				className='flex items-center justify-center w-[50px] h-[50px]'
				onPress={() => handlePress(3)}
			>
				<StyledImg
					source={require('../assets/post/calendar.png')}
					className='w-[26px] h-[26px]'
				/>
			</StyledOpacity>
			<StyledOpacity
				className='flex items-center justify-center w-[50px] h-[50px]'
				onPress={() => handlePress(4)}
			>
				<StyledImg
					source={require('../assets/post/thought.png')}
					className='w-[26px] h-[26px]'
				/>
			</StyledOpacity>
		</StyledView>
	);
});

export { PostTypeSelector };
