import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const useStore = create((set) => ({
	filter: 'unfiltered',
	currentFilterName: 'Prayer Circle',
	globalReload: false,
	journalReload: false,
	uid: '',
	name: '',
	pfp: '',
	updateFilter: (newVal) => set(() => ({ filter: newVal })),
	updateFilterName: (newVal) => set(() => ({ currentFilterName: newVal })),
	setGlobalReload: (newVal) => set(() => ({ globalReload: newVal })),
	setJournalReload: (newVal) => set(() => ({ journalReload: newVal })),
	setUid: (newVal) => set(() => ({ uid: newVal })),
	setName: (newVal) => set(() => ({ name: newVal })),
	setPfp: (newVal) => set(() => ({ pfp: newVal }))
}));
