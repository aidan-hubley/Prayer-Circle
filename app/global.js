import { create } from 'zustand';

export const useStore = create((set) => ({
	filter: 'unfiltered',
	currentFilterName: 'Prayer Circle',
	currentFilterIcon: 'musical-notes',
	currentFilterColor: '#FFFFFF',
	currentFilterDescription:
		'Hello world! Welcome to my new circle, I hope you have an insightful and memorable time here.',
	currentFilterIconColor: '#FFFFFF',
	currentCircleRole: 'member',
	circleMembersData: [],
	globalReload: false,
	journalReload: false,
	filterReload: false,
	circles: [],
	addCircles: [],
	setFilter: (newVal) => set(() => ({ filter: newVal })),
	setFilterName: (newVal) => set(() => ({ currentFilterName: newVal })),
	setFilterIcon: (newVal) => set(() => ({ currentFilterIcon: newVal })),
	setFilterColor: (newVal) => set(() => ({ currentFilterColor: newVal })),
	setFilterDescription: (newVal) =>
		set(() => ({ currentFilterDescription: newVal })),
	setFilterIconColor: (newVal) =>
		set(() => ({ currentFilterIconColor: newVal })),
	setCurrentCircleRole: (newVal) =>
		set(() => ({ currentCircleRole: newVal })),
	setCircleMembersData: (newVal) =>
		set(() => ({ circleMembersData: newVal })),
	setGlobalReload: (newVal) => set(() => ({ globalReload: newVal })),
	setJournalReload: (newVal) => set(() => ({ journalReload: newVal })),
	setFilterReload: (newVal) => set(() => ({ filterReload: newVal })),
	setCircles: (newVal) => set(() => ({ circles: newVal })),
	setAddCircles: (newVal) => set(() => ({ addCircles: newVal }))
}));
