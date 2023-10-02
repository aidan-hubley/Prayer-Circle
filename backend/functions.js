export function passwordValidation(password) {
	let length = false;
	let upper = false;
	let lower = false;
	let special = false;
	let number = false;

	let passwordChars = password.split('');
	//length 12
	if (password.length >= 12) length = true;
	//1 uppercase
	passwordChars.forEach((char) => {
		let ascii = char.charCodeAt(0);
		if (ascii >= 65 && ascii <= 90) upper = true;
		if (ascii >= 97 && ascii <= 122) lower = true;
		if (ascii >= 33 && ascii <= 47) special = true;
		if (ascii >= 48 && ascii <= 57) number = true;
	});
	if (length && upper && lower && special && number) return true;
	else return false;
}

export function timeSince(timeStamp) {
	let now = Date.now();
	let timeDiff = now - timeStamp;

	timeDiff /= 1000;
	if (timeDiff < 60) {
		return Math.round(timeDiff) + 's';
	}
	timeDiff /= 60;
	if (timeDiff < 60) {
		return Math.round(timeDiff) + 'm';
	}
	timeDiff /= 60;
	if (timeDiff < 24) {
		return Math.round(timeDiff) + 'h';
	}
	timeDiff /= 24;
	if (timeDiff < 7) {
		return Math.round(timeDiff) + 'd';
	}
	timeDiff /= 7;
	if (timeDiff < 4) {
		return Math.round(timeDiff) + 'w';
	}
	timeDiff /= 4;
	if (timeDiff < 12) {
		return Math.round(timeDiff) + 'm';
	}
	timeDiff /= 12;
	if (timeDiff < 10) {
		return Math.round(timeDiff) + 'y';
	}
}
