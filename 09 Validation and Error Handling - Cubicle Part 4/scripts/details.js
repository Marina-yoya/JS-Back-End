document.querySelector('.cube-list').addEventListener('click', (e) => {
	const target = e.target;

	if (target.classList.contains('more')) {
		const seeMoreBtn = target;
		const cube = target.parentNode.parentNode.querySelector('.see-more');
		cube.style.display = cube.style.display === 'block' ? 'none' : 'block';
		seeMoreBtn.textContent = seeMoreBtn.textContent === 'See more' ? 'hide' : 'See more';
	}
});
