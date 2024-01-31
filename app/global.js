import { create } from 'zustand';

export const useStore = create((set) => ({
	filter: 'unfiltered',
	currentFilterName: 'Prayer Circle',
	globalReload: false,
	journalReload: false,
	filterReload: false,
	uid: '',
	name: '',
	pfp: '',
	updateFilter: (newVal) => set(() => ({ filter: newVal })),
	updateFilterName: (newVal) => set(() => ({ currentFilterName: newVal })),
	setGlobalReload: (newVal) => set(() => ({ globalReload: newVal })),
	setJournalReload: (newVal) => set(() => ({ journalReload: newVal })),
	setFilterReload: (newVal) => set(() => ({ filterReload: newVal })),
	setUid: (newVal) => set(() => ({ uid: newVal })),
	setName: (newVal) => set(() => ({ name: newVal })),
	setPfp: (newVal) => set(() => ({ pfp: newVal }))
}));
