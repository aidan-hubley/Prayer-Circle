import React, {
	useState,
	useRef,
	forwardRef,
	useImperativeHandle
} from 'react';
import {
	View,
	Text,
	TouchableHighlight,
	TouchableOpacity,
	Animated,
	Pressable
} from 'react-native';
import { styled } from 'nativewind';
import { router } from '../backend/config';
import Ionicons from '@expo/vector-icons/Ionicons';
import * as Haptics from 'expo-haptics';

const StyledView = styled(View);
const StyledText = styled(Text);

const MemberPermissionSelector = forwardRef((props, ref) => {
	const animationValue = useRef(new Animated.Value(0)).current;
	const [open, setOpen] = useState(false);
	const [permission, setPermission] = useState('member');

	const widthInterpolation = animationValue.interpolate({
		inputRange: [0, 1],
		outputRange: [38, 250]
	});
	const opacityInterpolation = animationValue.interpolate({
		inputRange: [0, 0.2, 1],
		outputRange: [0, 0.5, 1]
	});
	const iconOpacityInterpolation = animationValue.interpolate({
		inputRange: [0, 0.8, 1],
		outputRange: [1, 0.5, 0]
	});
	const paddingInterpolation = animationValue.interpolate({
		inputRange: [0, 0.5, 1],
		outputRange: [0, 8, 8]
	});

	const iconContainerStyle = {
		width: 38,
		height: 38,
		opacity: 1,
		justifyContent: 'center',
		alignItems: 'center'
	};

	const toggleOpen = () => {
		Animated.timing(animationValue, {
			toValue: open ? 0 : 1,
			duration: 350,
			useNativeDriver: false
		}).start();
		setOpen(!open);
	};

	const handlePress = (permission) => {
		/*  setPermission(permission); */
		Animated.timing(animationValue, {
			toValue: permission === 'member' ? 0 : 1,
			duration: 200,
			useNativeDriver: false
		}).start();
		Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
	};

	return (
		<StyledView className={'justify-center'}>
			<Animated.View
				style={{ opacity: iconOpacityInterpolation }}
				className={
					'w-[38px] h-[38px] absolute right-0 justify-center items-center '
				}
			>
				<Ionicons name='key' size={30} color={'#fff'} />
			</Animated.View>
			<Animated.View
				style={[
					{
						width: widthInterpolation,
						paddingLeft: paddingInterpolation,
						opacity: opacityInterpolation
					},
					{
						flexDirection: 'row',
						overflow: 'hidden',
						justifyContent: 'space-between',
						alignItems: 'center',
						backgroundColor: '#1D1D1D',
						borderRadius: 50,
						borderWidth: 1,
						borderColor: '#FFFBFC'
					}
				]}
			>
				<TouchableOpacity
					onPress={() => {
						toggleOpen();
					}}
					style={iconContainerStyle}
				>
					<Ionicons name='key' size={30} color='#5946B2' />
				</TouchableOpacity>
				<TouchableOpacity
					onPress={() => {
						toggleOpen();
					}}
					style={iconContainerStyle}
				>
					<Ionicons name='shield' size={30} color='white' />
				</TouchableOpacity>
				<StyledView className='h-[70%] mx-[3px] border-r border-r-offwhite' />
				<TouchableOpacity
					onPress={() => {
						toggleOpen();
					}}
					style={iconContainerStyle}
				>
					<Ionicons
						name='checkmark-circle'
						size={30}
						color='#00A55E'
					/>
				</TouchableOpacity>
				<TouchableOpacity
					onPress={() => {
						toggleOpen();
					}}
					style={iconContainerStyle}
				>
					<Ionicons name='remove-circle' size={30} color='#F9A826' />
				</TouchableOpacity>
				<TouchableOpacity
					onPress={() => {
						toggleOpen();
					}}
					style={iconContainerStyle}
				>
					<Ionicons name='close-circle' size={30} color='#CC2500' />
				</TouchableOpacity>
				<StyledView className='h-[70%] w-[1px] mx-[3px] border-l border-l-offwhite' />
				<TouchableOpacity
					onPress={() => {
						toggleOpen();
					}}
					style={[
						iconContainerStyle,
						{ marginLeft: -5, marginRight: 2 }
					]}
				>
					<Ionicons
						name='chevron-forward'
						size={30}
						color='#FFFBFC'
					/>
				</TouchableOpacity>
			</Animated.View>
		</StyledView>
	);
});

export { MemberPermissionSelector };
