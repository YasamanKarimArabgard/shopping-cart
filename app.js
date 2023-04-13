const backdrop = document.querySelector('.backdrop');
const cartModal = document.querySelector('.cart');
const darkModeBtn = document.querySelector('#dark_mode');
const productsDOM = document.querySelector('.products')

import { productsData } from './products.js';

darkModeBtn.addEventListener('click', darkTheme);
// showBtn.addEventListener('click', showModal);

let cart = [];

class Products {
    getProducts(products) {
        return productsData
    }
}

class UI {
    displayProducts(products) {
        let result = '';
        products.forEach(item => {
            result += `<div class="product">
            <div class="img_container">
            <img src=${item.imageUrl} alt="product-1" id="product-img">
            </div>
           <div class="product_dec">
           <p id="product-title">${item.title}</p>
           <p id="product-price">$${item.price}</p>
           </div>
           <div class="product_btn">
           <button class="btn add-to-cart" data-id=${item.id}>
                   add to <i class="fa-solid fa-cart-plus"></i>
                   </button>
                   </div>
                   </div>`
            productsDOM.innerHTML = result;
        });
    }
    getAddToCartBtns() {
        const addToCartBtns = document.querySelectorAll('.add-to-cart');
        const buttons = [...addToCartBtns];

        buttons.forEach(btn => {
            const id = btn.dataset.id;
            const isInCart = cart.find(p => p.id === id)
            if (isInCart) {
                btn.innerText = 'add more +';
                btn.disabled = 'true'
            }
            btn.addEventListener('click', (event) => {
                event.target.innerText = 'add more +';
                event.target.disabled = true;

                const addedProduct = Storage.getProducts(id)
                cart = [...cart, {...addedProduct, quantity: 1}]

                Storage.saveCart(cart)
            })
        })
    }
}

class Storage {
    static saveProducts(products) {
        localStorage.setItem('products', JSON.stringify(products))
    }
    static getProducts(id) {
        const inStorageProducts = JSON.parse(localStorage.getItem(('products')));
        return inStorageProducts.find(p => p.id === parseInt(id));
    }
    static saveCart(cart){
        localStorage.setItem('cart', JSON.stringify(cart))
    }
}


document.addEventListener('DOMContentLoaded', () => {
    const products = new Products();
    const productsData = products.getProducts();
    const ui = new UI();
    ui.displayProducts(productsData);
    ui.getAddToCartBtns()
    Storage.saveProducts(productsData);
})

function showModal() {
    backdrop.style.display = 'block';
    cartModal.style.opacity = '1';
    cartModal.style.top = '20%'
}

function darkTheme() {
    document.body.classList.toggle('dark_mode')
}