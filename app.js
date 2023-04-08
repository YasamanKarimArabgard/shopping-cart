const showBtn = document.querySelector('.show-modal');
const backdrop = document.querySelector('.backdrop');
const cartModal = document.querySelector('.cart');

showBtn.addEventListener('click', showModal);

function showModal(){
    backdrop.style.display = 'block';
    cartModal.style.opacity = '1';
    cartModal.style.top = '20%'  
}