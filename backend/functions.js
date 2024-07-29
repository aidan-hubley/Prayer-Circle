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
	return length && upper && lower && special && number;
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

export function formatTimestamp(
	timestamp,
	originalTimezoneOffset,
	currentOffset
) {
	// Convert original timezone offset to milliseconds
	const originalOffsetMilliseconds = originalTimezoneOffset * 60 * 1000;

	// Convert current timezone offset to milliseconds
	const currentOffsetMilliseconds = currentOffset * 60 * 1000;

	// Convert timestamp to UTC time
	let date = new Date(timestamp);
	date = new Date(date.getTime() - originalOffsetMilliseconds);

	// Convert UTC time to local time
	date = new Date(date.getTime() + currentOffsetMilliseconds);

	// Define month names
	const monthNames = [
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

	// Extract date components
	const month = monthNames[date.getMonth()];
	const day = date.getDate();
	const year = date.getFullYear();
	const hours = date.getHours();
	const minutes = date.getMinutes();

	// Convert hours to AM/PM format
	const ampm = hours >= 12 ? 'PM' : 'AM';
	const formattedHours = hours % 12 || 12; // Convert 0 to 12
	const formattedMinutes = minutes < 10 ? '0' + minutes : minutes;

	// Assemble formatted timestamp string
	const formattedTimestamp = `${month} ${day}, ${formattedHours}:${formattedMinutes} ${ampm}`;

	return formattedTimestamp;
}

export function debounce(callback, wait) {
	let timeout;
	return (...args) => {
		const context = this;
		clearTimeout(timeout);
		timeout = setTimeout(() => callback.apply(context, args), wait);
	};
}
