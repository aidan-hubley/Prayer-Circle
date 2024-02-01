import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const useStore = create((set) => ({
	filter: 'unfiltered',
	currentFilterName: 'Prayer Circle',
	currentFilterIcon: 'musical-notes',
	currentFilterColor: '#FFFFFF',
	currentFilterDescription: 'Hello world! Welcome to my new circle, I hope you have an insightful and memorable time here.',
	globalReload: false,
	journalReload: false,
	filterReload: false,
	uid: '',
	name: '',
	pfp: '',
	setFilter: (newVal) => set(() => ({ filter: newVal })),
	setFilterName: (newVal) => set(() => ({ currentFilterName: newVal })),
	setFilterIcon: (newVal) => set(() => ({ currentFilterIcon: newVal })),
	setFilterColor: (newVal) => set(() => ({ currentFilterColor: newVal })),
	setFilterDescription: (newVal) => set(() => ({ currentFilterDescription: newVal })),
	setGlobalReload: (newVal) => set(() => ({ globalReload: newVal })),
	setJournalReload: (newVal) => set(() => ({ journalReload: newVal })),
	setFilterReload: (newVal) => set(() => ({ filterReload: newVal })),
	setUid: (newVal) => set(() => ({ uid: newVal })),
	setName: (newVal) => set(() => ({ name: newVal })),
	setPfp: (newVal) => set(() => ({ pfp: newVal }))
}));
