const male = document.getElementById('male');
const female = document.getElementById('female');

male.addEventListener('click', () => {
	female.checked = false;
});

female.addEventListener('click', () => {
	male.checked = false;
});
