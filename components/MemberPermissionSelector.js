import React, {
	useState,
	useRef,
	forwardRef,
	useImperativeHandle,
	useEffect
} from 'react';
import { View, TouchableOpacity, Animated } from 'react-native';
import { styled } from 'nativewind';
import Ionicons from '@expo/vector-icons/Ionicons';
import * as Haptics from 'expo-haptics';

const StyledView = styled(View);

const MemberPermissionSelector = forwardRef((props, ref) => {
	const animationValue = useRef(new Animated.Value(0)).current;
	const [open, setOpen] = useState(false);
	const [permission, setPermission] = useState('');

	/* TODO: Implement DB update on permission change */

	const widthInterpolation = animationValue.interpolate({
		inputRange: [0, 1],
		outputRange: [38, 250]
	});
	const opacityInterpolation = animationValue.interpolate({
		inputRange: [0, 0.2, 1],
		outputRange: [0, 0.8, 1]
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
		height: 31,
		opacity: 1,
		justifyContent: 'center',
		alignItems: 'center',
		marginVertical: 3.5
	};

	const toggleOpen = () => {
		Animated.timing(animationValue, {
			toValue: open ? 0 : 1,
			duration: 350,
			useNativeDriver: false
		}).start();
		Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
		setOpen(!open);
	};

	useImperativeHandle(ref, () => ({
		role: permission
	}));
	useEffect(() => {
		setPermission(props.role);
	}, []);

	return (
		<StyledView className={'justify-center'}>
			<Animated.View
				style={{ opacity: iconOpacityInterpolation }}
				className={
					'w-[38px] h-[38px] absolute right-0 justify-center items-center '
				}
			>
				{permission === 'owner' && (
					<Ionicons name={'key'} size={30} color={'#5946B2'} />
				)}
				{permission === 'admin' && (
					<Ionicons name={'shield'} size={30} color={'#fff'} />
				)}
				{permission === 'member' && (
					<Ionicons
						name={'checkmark-circle'}
						size={30}
						color={'#00A55E'}
					/>
				)}
				{permission === 'restricted' && (
					<Ionicons
						name={'remove-circle'}
						size={30}
						color={'#F9A826'}
					/>
				)}
				{permission === 'banned' && (
					<Ionicons
						name={'close-circle'}
						size={30}
						color={'#CC2500'}
					/>
				)}
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
						borderColor: '#3D3D3D'
					}
				]}
			>
				<TouchableOpacity
					onPress={() => {
						/* setPermission('owner'); */
						toggleOpen();
					}}
					style={iconContainerStyle}
				>
					<Ionicons name='key' size={30} color='#5946B2' />
					{permission === 'owner' && (
						<StyledView className='w-[24px] h-[1px] bg-offwhite' />
					)}
				</TouchableOpacity>
				<TouchableOpacity
					onPress={() => {
						setPermission('admin');
						toggleOpen();
					}}
					style={iconContainerStyle}
				>
					<Ionicons name='shield' size={30} color='white' />
					{permission === 'admin' && (
						<StyledView className='w-[24px] h-[1px] bg-offwhite' />
					)}
				</TouchableOpacity>
				<StyledView className='h-[70%] mx-[3px] border-r border-r-outline' />
				<TouchableOpacity
					onPress={() => {
						setPermission('member');
						toggleOpen();
					}}
					style={iconContainerStyle}
				>
					<Ionicons
						name='checkmark-circle'
						size={30}
						color='#00A55E'
					/>
					{permission === 'member' && (
						<StyledView className='w-[24px] h-[1px] bg-offwhite' />
					)}
				</TouchableOpacity>
				<TouchableOpacity
					onPress={() => {
						toggleOpen();
						setPermission('restricted');
					}}
					style={iconContainerStyle}
				>
					<Ionicons name='remove-circle' size={30} color='#F9A826' />
					{permission === 'restricted' && (
						<StyledView className='w-[24px] h-[1px] bg-offwhite' />
					)}
				</TouchableOpacity>
				<TouchableOpacity
					onPress={() => {
						setPermission('banned');
						toggleOpen();
					}}
					style={iconContainerStyle}
				>
					<Ionicons name='close-circle' size={30} color='#CC2500' />
					{permission === 'banned' && (
						<StyledView className='w-[24px] h-[1px] bg-offwhite' />
					)}
				</TouchableOpacity>
				<StyledView className='h-[70%] w-[1px] mx-[3px] border-l border-l-outline' />
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
