import { Notifier } from 'react-native-notifier';
import { create } from 'zustand';

export const useStore = create((set) => ({
	filter: 'unfiltered',
	currentFilterName: 'Prayer Circle',
	currentFilterIcon: 'musical-notes',
	currentFilterColor: '#FFFFFF',
	currentCircleRole: 'member',
	currentFilterIconColor: '#FFFFFF',
	globalReload: false,
	journalReload: false,
	filterReload: false,
	circles: [],
	addCircles: [],
	haptics: false,
	notifications: false,
	setFilter: (newVal) => set(() => ({ filter: newVal })),
	setFilterName: (newVal) => set(() => ({ currentFilterName: newVal })),
	setFilterIcon: (newVal) => set(() => ({ currentFilterIcon: newVal })),
	setFilterColor: (newVal) => set(() => ({ currentFilterColor: newVal })),
	setCurrentCircleRole: (newVal) =>
		set(() => ({ currentCircleRole: newVal })),
	setFilterIconColor: (newVal) =>
		set(() => ({ currentFilterIconColor: newVal })),
	setGlobalReload: (newVal) => set(() => ({ globalReload: newVal })),
	setJournalReload: (newVal) => set(() => ({ journalReload: newVal })),
	setFilterReload: (newVal) => set(() => ({ filterReload: newVal })),
	setCircles: (newVal) => set(() => ({ circles: newVal })),
	setAddCircles: (newVal) => set(() => ({ addCircles: newVal })),
	setHaptics: (newVal) => set(() => ({ haptics: newVal })),
	setNotifications: (newVal) => set(() => ({ notifications: newVal }))
}));

export const notify = (
	title,
	description,
	borderColor,
	duration,
	onPress,
	onHide
) => {
	Notifier.showNotification({
		title: title || '',
		description: description || '',
		hideOnPress: false,
		duration: duration || 6000,
		containerStyle: (translateY) => ({
			// add safe area inset to the container
			marginTop: -15
			// ...
		}),
		onPress: () => {
			if (onPress) onPress();
		},
		onHidden: () => {
			if (onHide) onHide();
		},
		componentProps: {
			containerStyle: {
				backgroundColor: '#121212',
				borderRadius: 20,
				padding: 20,
				borderWidth: 1,
				borderColor: borderColor || '#3D3D3D'
			},
			titleStyle: {
				color: borderColor || '#ffffff'
			},
			descriptionStyle: {
				color: '#ffffffa0'
			}
		}
	});
};
