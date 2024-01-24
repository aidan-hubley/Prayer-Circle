import React, { useState, useRef, useEffect, forwardRef, useImperativeHandle } from 'react';
import {
	Text,
	View,
	Image,
	Pressable,
	Animated,
	Dimensions
} from 'react-native';
import { styled } from 'nativewind';
import Ionicons from '@expo/vector-icons/Ionicons';

const StyledText = styled(Text);
const StyledView = styled(View);
const StyledImage = styled(Image);
const StyledPressable = styled(Pressable);
const StyledIcon = styled(Ionicons);
const StyledAnimatedView = styled(Animated.createAnimatedComponent(View));

function Member({ img, name, username, role, last }) {
	const [openRolePicker, setOpenRolePicker] = useState(null);
	const [newrole, setNewRole] = useState(null);

	const openRoleSelector = () => {
		setOpenRolePicker(true);
	};

	const closeRoleSelector = () => {	
		setOpenRolePicker(false);
	};

	const toggleRole = (selectedRole) => {
		if (role === selectedRole) {
			setNewRole(selectedRole);
			closeRoleSelector();
			console.log("same role");
			return;
		} else {
			setNewRole(selectedRole);
			console.log("new role " + selectedRole);
			closeRoleSelector();
			return;
		}
	}

	const selectorVal = useRef(new Animated.Value(0)).current;
	const selectorWidthInter = selectorVal.interpolate({
		inputRange: [0, 1],
	    outputRange: [40, 245],
	});

	useEffect(() => {
		let animation;
		animation = Animated.timing(selectorVal, {
			toValue: (openRolePicker ? 1 : 0),
			duration: 500,
			useNativeDriver: false,
		});

		animation.start();
	}, [openRolePicker, selectorVal]);

	const roleSelectorStyle = {
		width: selectorWidthInter,
		opacity: openRolePicker ? 1 : 0,
	};

	const roleIconStyle = {
		opacity: openRolePicker ? 0 : 1,
	};

	return (
		<StyledView
			style={{ width: Dimensions.get('window').width - 30 }}
			className={`h-[50px] flex flex-row justify-between items-center bg-grey pl-[10px] py-[10px] border-x border-[#6666660d]
			${last ? 'rounded-b-[20px] h-[60px]' : ''}`}
		>
			<StyledView className='flex flex-row'>
				<StyledImage
					className='rounded-xl'
					style={{ width: 40, height: 40 }}
					source={{ uri: img }}
				/>
				<StyledView className='pl-2 bottom-[3px]'>
					<StyledText className={`font-[600] text-offwhite text-[20px]`}>
						{name}
					</StyledText>
					<StyledText className={`text-offwhite text-[14px]`}>
						{username}
					</StyledText>
				</StyledView>
			</StyledView>
			<StyledView className='absolute right-0'>
				<StyledAnimatedView style={roleSelectorStyle} className='flex-row bg-grey border-outline border-2 rounded-3xl mr-[8px] py-1 gap-x-2 bottom-2'>					
					<StyledPressable onPress={() => toggleRole("own")}>
						<StyledIcon name='key' size={30} color='#5946B2'/>
						{role === 'own' ? (<StyledView className='self-center w-[20px] h-[2px] bg-white rounded-full'></StyledView>) : null}
					</StyledPressable>
					<StyledPressable onPress={() => toggleRole("mod")}>
						<StyledIcon name='shield' size={30} color='#FFFBFC'/>
						{role === 'mod' ? (<StyledView className='self-center w-[20px] h-[2px] bg-white rounded-full'></StyledView>) : null}
					</StyledPressable>
					<StyledView className='w-[2px] h-8 bg-outline rounded-full'></StyledView>
					<StyledPressable onPress={() => toggleRole("mem")}>
						<StyledIcon name='checkmark-circle' size={30} color='#00A55E' />
						{role === 'mem' ? (<StyledView className='self-center w-[20px] h-[2px] bg-white rounded-full'></StyledView>) : null}
					</StyledPressable>
					<StyledPressable onPress={() => toggleRole("sus")}>
						<StyledIcon name='remove-circle' size={30} color='#F9A826' />
						{role === 'sus' ? (<StyledView className='self-center w-[20px] h-[2px] bg-white rounded-full'></StyledView>) : null}
					</StyledPressable>
					<StyledPressable onPress={() => toggleRole("ban")}>
						<StyledIcon name='close-circle' size={30} color='#CC2500' />
						{role === 'ban' ? (<StyledView className='self-center w-[20px] h-[2px] bg-white rounded-full'></StyledView>) : null}
					</StyledPressable>
					<StyledView className='w-[2px] h-8 bg-outline rounded-full'></StyledView>
					<StyledPressable className="relative right-2" onPress={() => closeRoleSelector()}>
						<StyledIcon name='chevron-forward' size={30} color='#FFFBFC' />
					</StyledPressable>
				</StyledAnimatedView>
				<StyledPressable style={roleIconStyle} className='absolute h-100' onPress={() => openRoleSelector(username)}>
					{role === 'own' || newrole === 'own' ? (
							<StyledIcon name='key' size={30} color='#5946B2' />
					) : role === 'mod' || newrole === 'mod' ? (
							<StyledIcon name='shield' size={30} color='#FFFBFC' />
					) : role === 'mem' || newrole === 'mem' ? (
							<StyledIcon name='checkmark-circle' size={30} color='#00A55E' />
					) : role === 'sus' || newrole === 'sus' ? (
							<StyledIcon name='remove-circle' size={30} color='#F9A826' />
					) : role === 'ban' || newrole === 'ban' ? (
							<StyledIcon name='close-circle' size={30} color='#CC2500' />
					) : null}
				</StyledPressable>
			</StyledView>
		</StyledView>
	);
}

export { Member };