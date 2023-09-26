export function passwordValidation(password) {
	let length = false;
	let upper = false;
	let lower = false;
	let special = false;
	let number = false;

	let passwordChars = password.split("");
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
