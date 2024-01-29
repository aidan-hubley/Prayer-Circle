import {
	useRouter,
	useRootNavigation,
	useSegments,
	SplashScreen
} from 'expo-router';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth } from '../../backend/config';
import { writeData, readData } from '../../backend/firebaseFunctions';
import {
	signOut,
	createUserWithEmailAndPassword,
	signInWithEmailAndPassword,
	onAuthStateChanged
} from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AuthContext = createContext(null);

export function Provider(props) {
	const [user, setAuth] = useState(null);
	const [authInitialized, setAuthInitialized] = useState(false);
	const [accountType, setAccountType] = useState('');

	const useProtectedRoute = (user) => {
		const segments = useSegments();
		const router = useRouter();

		const [isNavigationReady, setNavigationReady] = useState(false);
		const rootNavigation = useRootNavigation();

		useEffect(() => {
			const unsubscribe = rootNavigation?.addListener(
				'state',
				(event) => {
					setNavigationReady(true);
				}
			);
			return function cleanup() {
				if (unsubscribe) {
					unsubscribe();
				}
			};
		}, [rootNavigation]);

		useEffect(() => {
			if (!isNavigationReady) return;

			const inAuthGroup = segments[0] === '(auth)';

			if (!user && !inAuthGroup) {
				setTimeout(() => {
					SplashScreen.hideAsync();
				}, 500);
				router.replace('/login');
			} else if (user && inAuthGroup) {
				SplashScreen.hideAsync();
				router.replace('/');
			} else {
				setTimeout(() => {
					SplashScreen.hideAsync();
				}, 100);
			}
		}, [user, segments, authInitialized, isNavigationReady]);
	};
	useEffect(() => {
		onAuthStateChanged(auth, (token) => {
			if (token) {
				setAuth(true);
			} else {
				setAuth(false);
			}
			setAuthInitialized(true);
		});
	}, []);

	const logout = async () => {
		await AsyncStorage.multiRemove([
			'email',
			'fname',
			'lname',
			'account_type',
			'user'
		]);
		await signOut(auth);
		setAuth(null);
	};

	const login = async (email, password) => {
		await signInWithEmailAndPassword(auth, email, password)
			.then(async (userCredential) => {
				// Signed in
				const user = userCredential.user;
				let user_data = await readData(
					`offcampus/users/${user.uid}/user_data`
				);
				await AsyncStorage.multiSet([
					['user', user.uid],
					['email', user.email],
					['fname', user_data.fname],
					['lname', user_data.lname],
					['account_type', user_data.account_type]
				]);
				setAccountType(user_data.account_type);
				setAuth(true);
			})
			.catch((error) => {
				const errorCode = error.code;
				const errorMessage = error.message;
				console.log(errorCode, errorMessage);
				alert('Incorrect email or password');
				setAuth(null);
			});
	};

	const registerUser = async (
		email,
		password,
		fname,
		lname,
		accountType,
		preferences
	) => {
		let userData = {
			email,
			fname,
			lname,
			account_type: accountType
		};
		await createUserWithEmailAndPassword(auth, email, password)
			.then(async (userCredential) => {
				// Signed in
				const user = userCredential.user;
				await writeData(
					`offcampus/users/${user.uid}/user_data`,
					userData,
					true
				);
				await writeData(
					`offcampus/users/${user.uid}/preferences`,
					preferences,
					true
				);
				await login(email, password);
			})
			.catch((error) => {
				const errorCode = error.code;
				const errorMessage = error.message;
				if (errorCode === 'auth/email-already-in-use') {
					alert('Email already in use');
					console.log(errorCode, errorMessage);
				} else {
					console.log(errorCode, errorMessage);
				}
			});
	};

	useProtectedRoute(user);

	return (
		<AuthContext.Provider
			value={{
				signIn: login,
				signOut: logout,
				register: registerUser,
				user,
				authInitialized,
				accountType
			}}
		>
			{props.children}
		</AuthContext.Provider>
	);
}

export const useAuth = () => {
	const authContext = useContext(AuthContext);

	if (!authContext) {
		throw new Error('useAuth must be used within an AuthProvider');
	}

	return authContext;
};
