import { create } from 'zustand';

export const useStore = create((set) => ({
	filter: 'unfiltered',
	currentFilterName: 'Prayer Circle',
	globalReload: false,
	journalReload: false,
	filterReload: false,
	circles: [],
	addCircles: [],
	updateFilter: (newVal) => set(() => ({ filter: newVal })),
	updateFilterName: (newVal) => set(() => ({ currentFilterName: newVal })),
	setGlobalReload: (newVal) => set(() => ({ globalReload: newVal })),
	setJournalReload: (newVal) => set(() => ({ journalReload: newVal })),
	setFilterReload: (newVal) => set(() => ({ filterReload: newVal })),
	setCircles: (newVal) => set(() => ({ circles: newVal })),
	setAddCircles: (newVal) => set(() => ({ addCircles: newVal }))
}));
