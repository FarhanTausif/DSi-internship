const hamburgerMenu = document.querySelector('.hamburger-menu');
const hamburger_icon_src = 'images/hamburger-menu-mobile.svg';
const cross_icon = document.createElement('img');
cross_icon.src = 'images/icon-cross.svg';

hamburgerMenu.addEventListener('click', () =>{
    const navList = document.getElementById('nav-list');
    navList.classList.toggle('hidden');
    if(hamburgerMenu.src.includes(hamburger_icon_src)){
        hamburgerMenu.src = cross_icon.src;
        hamburgerMenu.style.width = '25px';
        hamburgerMenu.style.height = '25px';
    } else {
        hamburgerMenu.src = hamburger_icon_src;
        hamburgerMenu.style.width = '';
        hamburgerMenu.style.height = '';
    }
});