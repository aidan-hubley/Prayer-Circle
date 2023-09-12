import { database, auth } from "./config.js";
import { ref, child, get, push, set } from "firebase/database";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { write } from "fs";

export async function readData(path) {
	return await get(child(ref(database), path))
		.then((snapshot) => {
			if (snapshot.exists()) {
				return snapshot.val();
			} else {
				console.log("No data available");
			}
		})
		.catch((error) => {
			console.error(error);
		});
}

export async function writeData(path, data, overwrite = false) {
	if (overwrite) {
		set(ref(database, path), data)
			.then(() => {
				console.log("data written successfully");
			})
			.catch(() => {
				console.log("error writing data");
			});
	} else {
		push(ref(database, path), data)
			.then(() => {
				console.log("data written successfully");
			})
			.catch(() => {
				console.log("error writing data");
			});
	}
}

export async function registerUser(email, password) {
	console.log(email, password);
	/* createUserWithEmailAndPassword(auth, email, password)
		.then((userCredential) => {
			// Signed in
			const user = userCredential.user;
			console.log(user);
		})
		.catch((error) => {
			const errorCode = error.code;
			const errorMessage = error.message;
			console.log(errorCode, errorMessage);
		}); */
}

export function generateId() {
	return push(ref(database)).key;
}
