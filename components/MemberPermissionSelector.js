import React, {
	useState,
	useRef,
	forwardRef,
	useImperativeHandle,
	useEffect
} from 'react';
import { View, TouchableOpacity, Animated, Alert } from 'react-native';
import { styled } from 'nativewind';
import Ionicons from '@expo/vector-icons/Ionicons';
import * as Haptics from 'expo-haptics';
import { useStore, notify } from '../app/global';
import { writeData } from '../backend/firebaseFunctions';
import { auth } from '../backend/config';

const StyledView = styled(View);

const MemberPermissionSelector = forwardRef((props, ref) => {
	const animationValue = useRef(new Animated.Value(0)).current;
	const [open, setOpen] = useState(false);
	const [permission, setPermission] = useState(props.role);
	const [currentCircleRole, filter, haptics] = useStore((state) => [
		state.currentCircleRole,
		state.filter,
		state.haptics
	]);

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
		if (permission === 'owner' || currentCircleRole === 'member') return;
		Animated.timing(animationValue, {
			toValue: open ? 0 : 1,
			duration: 350,
			useNativeDriver: false
		}).start();
		if (haptics) Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
		setOpen(!open);
	};

	const updatePermission = (prevRole, newRole) => {
		if (prevRole !== newRole) {
			writeData(
				`prayer_circle/circles/${filter}/members/${props.uid}`,
				newRole,
				true
			);

			if (newRole === 'admin') {
				writeData(
					`prayer_circle/circles/${filter}/admin/${props.uid}`,
					true,
					true
				);
			} else if (prevRole === 'admin') {
				writeData(
					`prayer_circle/circles/${filter}/admin/${props.uid}`,
					null,
					true
				);
				props.setUp(true);
			}
			if (newRole === 'owner') {
				writeData(
					// write new user as owner
					`prayer_circle/circles/${filter}/owner`,
					props.uid,
					true
				);
				writeData(
					// set their member role to owner
					`prayer_circle/circles/${filter}/members/${props.uid}`,
					'owner',
					true
				);
				writeData(
					// set them as an admin
					`prayer_circle/circles/${filter}/admin/${props.uid}`,
					true,
					true
				);
				writeData(
					//change my role to admin in the circle
					`prayer_circle/circles/${filter}/members/${auth.currentUser.uid}`,
					'admin',
					true
				);
				writeData(
					//add me as an admin
					`prayer_circle/circles/${filter}/admin/${auth.currentUser.uid}`,
					true,
					true
				);
				props.setUp(true);
			}

			return newRole;
		} else {
			return prevRole;
		}
	};

	const changeOwnership = () => {
		Alert.alert(
			//TODO: convert to new notification type
			'Change Ownership',
			'Are you sure you want to transfer Circle ownership to this user?\n\nYou will be replaced as the owner of this Circle.',
			[
				{
					text: 'Cancel',
					onPress: () => {
						toggleOpen();
					}
				},
				{
					text: 'Transfer',
					onPress: () => {
						notify(
							'Ownership Transferred',
							'You are no longer the owner of this circle.',
							'#F9A826'
						);
						setPermission((prevPerm) =>
							updatePermission(prevPerm, 'owner')
						);
						toggleOpen();
					}
				}
			]
		);
	};

	const getIconFromRole = (role) => {
		if (
			currentCircleRole === 'owner' ||
			currentCircleRole === 'admin' ||
			auth.currentUser.uid === props.uid
		) {
			if (role === 'owner')
				return <Ionicons name={'key'} size={30} color={'#5946B2'} />;
			if (role === 'admin')
				return <Ionicons name={'shield'} size={30} color={'#fff'} />;
			if (role === 'member')
				return (
					<Ionicons
						name={'checkmark-circle'}
						size={30}
						color={'#00A55E'}
					/>
				);
			if (role === 'suspended')
				return (
					<Ionicons
						name={'remove-circle'}
						size={30}
						color={'#F9A826'}
					/>
				);
			if (role === 'banned')
				return (
					<Ionicons
						name={'close-circle'}
						size={30}
						color={'#CC2500'}
					/>
				);
		} else {
			if (role === 'owner')
				return <Ionicons name={'key'} size={30} color={'#5946B2'} />;
			else if (role === 'admin')
				return <Ionicons name={'shield'} size={30} color={'#FFFBFC'} />;
			else
				return <Ionicons name={'person'} size={30} color={'#FFFBFC'} />;
		}
	};

	useImperativeHandle(ref, () => ({
		role: permission
	}));

	return (
		<StyledView className={'justify-center'}>
			<Animated.View
				style={{ opacity: iconOpacityInterpolation }}
				className={
					'w-[38px] h-[38px] absolute right-0 justify-center items-center '
				}
			>
				{getIconFromRole(permission)}
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
					onPress={async () => {
						if (!open) toggleOpen();
						if (open && currentCircleRole === 'owner')
							await changeOwnership(props.uid);
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
						setPermission((prevPerm) =>
							updatePermission(prevPerm, 'admin')
						);
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
						setPermission((prevPerm) =>
							updatePermission(prevPerm, 'member')
						);
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
						setPermission((prevPerm) =>
							updatePermission(prevPerm, 'suspended')
						);
					}}
					style={iconContainerStyle}
				>
					<Ionicons name='remove-circle' size={30} color='#F9A826' />
					{permission === 'suspended' && (
						<StyledView className='w-[24px] h-[1px] bg-offwhite' />
					)}
				</TouchableOpacity>
				<TouchableOpacity
					onPress={() => {
						setPermission((prevPerm) =>
							updatePermission(prevPerm, 'banned')
						);
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
