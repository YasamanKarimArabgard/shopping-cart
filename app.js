const backdrop = document.querySelector('.backdrop');
const cartModal = document.querySelector('.cart');
const darkModeBtn = document.querySelector('#dark_mode')

// showBtn.addEventListener('click', showModal);
darkModeBtn.addEventListener('click', darkTheme)

function showModal(){
    backdrop.style.display = 'block';
    cartModal.style.opacity = '1';
    cartModal.style.top = '20%'  
}

function darkTheme(){
    document.body.classList.toggle('dark_mode')
}