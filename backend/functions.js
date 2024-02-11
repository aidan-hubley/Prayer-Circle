export function passwordValidation(password) {
	let length = false;
	let upper = false;
	let lower = false;
	let special = false;
	let number = false;

	let passwordChars = password.split('');
	//length 8
	if (password.length >= 8) length = true;
	passwordChars.forEach((char) => {
		let ascii = char.charCodeAt(0);
		if (ascii >= 65 && ascii <= 90) upper = true;
		if (ascii >= 97 && ascii <= 122) lower = true;
		if (ascii >= 33 && ascii <= 47) special = true;
		if (ascii >= 48 && ascii <= 57) number = true;
	});
	return !!(length && upper && lower && special && number);
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

export function formatDateAndTime(inputDateTime) {
	// Parse the input date string
	const dateTime = new Date(inputDateTime);

	// Get abbreviated month
	const months = [
		'Jan',
		'Feb',
		'Mar',
		'Apr',
		'May',
		'Jun',
		'Jul',
		'Aug',
		'Sep',
		'Oct',
		'Nov',
		'Dec'
	];
	const abbreviatedMonth = months[dateTime.getMonth()];

	// Get day of the month
	const day = dateTime.getDate();

	// Get 12-hour time
	const hours = dateTime.getHours() % 12 || 12; // Convert 24hr to 12hr format
	const minutes = dateTime.getMinutes();
	const meridiem = dateTime.getHours() < 12 ? 'AM' : 'PM';

	// Format time
	const formattedTime = `${hours}:${
		minutes < 10 ? '0' : ''
	}${minutes} ${meridiem}`;

	// Combine abbreviated month, day and formatted time
	return `${abbreviatedMonth} ${day}, ${formattedTime}`;
}

export function isTimeBefore(firstTime, secondTime) {
	// Splitting hours and minutes from time strings
	const [firstHours, firstMinutes] = firstTime.split(':').map(Number);
	const [secondHours, secondMinutes] = secondTime.split(':').map(Number);

	// Convert times to minutes since midnight
	const firstMinutesSinceMidnight = firstHours * 60 + firstMinutes;
	const secondMinutesSinceMidnight = secondHours * 60 + secondMinutes;

	// Check if second time is before first time
	return secondMinutesSinceMidnight < firstMinutesSinceMidnight;
}
