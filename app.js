const backdrop = document.querySelector('.backdrop');
const cartModal = document.querySelector('.cart');
const darkModeBtn = document.querySelector('#dark_mode');
const productsDOM = document.querySelector('.products');
const cartBtn = document.querySelector('.fa-cart-shopping');
const closeCartBtn = document.querySelector('.colse-cart-modal');
const cartContent = document.querySelector('.cart-content');
const clearCartBtn = document.querySelector('.clear-cart');

const cartTotal = document.querySelector('.cart-total');
const cartItem = document.querySelector('.cart-item');

import { productsData } from './products.js';

darkModeBtn.addEventListener('click', darkTheme);
cartBtn.addEventListener('click', showModal);
closeCartBtn.addEventListener('click', closeModal)
let cart = [];
let buttonsDOM = [];

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
           <p id="product-price">${item.price} $</p>
           </div>
           <div class="product_btn">
           <button class="btn add-to-cart" data-id=${item.id}>add to cart</button>
                   </div>
                   </div>`
            productsDOM.innerHTML = result;
        });
    }
    getAddToCartBtns() {
        const addToCartBtns = [...document.querySelectorAll('.add-to-cart')];
        buttonsDOM = addToCartBtns;
        addToCartBtns.forEach(btn => {
            const id = btn.dataset.id;
            const isInCart = cart.find(p => p.id === parseInt(id))
            if (isInCart) {
                btn.innerText = 'add more +';
                btn.disabled = 'true';
            }
            btn.addEventListener('click', (event) => {
                event.target.innerText = 'add more +';
                event.target.disabled = true;

                const subtractedProduct = { ...Storage.getProducts(id), quantity: 1 }
                cart = [...cart, subtractedProduct]

                Storage.saveCart(cart);

                this.setCartValue(cart);

                this.addCartItem(subtractedProduct);
            })
        })
    }
    setCartValue(cart) {

        let tempCartItems = 0;

        const totalPrice = cart.reduce((acc, curr) => {
            tempCartItems += curr.quantity;
            return acc + curr.quantity * curr.price;
        }, 0)
        cartTotal.innerText = `total price : ${totalPrice.toFixed(2)}$`
        // cartItem.innerText = tempCartItems;
    }
    addCartItem(subtractedProduct) {
        const div = document.createElement('div');
        div.classList.add('cart-item');
        div.innerHTML = `
        <img class="cart-item-img" src="${subtractedProduct.imageUrl}" />
        <div class="cart-item-desc">
          <h4>${subtractedProduct.title}</h4>
          <h5 class="cart-total">${subtractedProduct.price}$</h5>
        </div>
        <div class="cart-item-conteoller">
          <i class="fas fa-chevron-up" data-id=${subtractedProduct.id}></i>
          <p>${subtractedProduct.quantity}</p>
          <i class="fas fa-chevron-down" data-id=${subtractedProduct.id}></i>
        </div>
        <i class="fas fa-trash-alt" data-id=${subtractedProduct.id}></i>`
        cartContent.appendChild(div);
    }
    setUpApp() {
        cart = Storage.getCart() || [];
        cart.forEach(cartItem => this.addCartItem(cartItem));

        this.setCartValue(cart)
    }
    cartLogic() {
        clearCartBtn.addEventListener('click', () => {
            cart.forEach(cItem => this.removeItem(cItem.id));

            while (cartContent.children.length) {
                cartContent.removeChild(cartContent.children[0]);
            }
            closeModal();
        })
        cartContent.addEventListener('click', (event) => {

            if (event.target.classList.contains('fa-chevron-up')) {

                const addQuantity = event.target;
                const subtractedItem = cart.find(cItem => cItem.id == addQuantity.dataset.id);
                subtractedItem.quantity++;
                this.setCartValue(cart);
                Storage.saveCart(cart);
                addQuantity.nextElementSibling.innerText = subtractedItem.quantity;

            } else if (event.target.classList.contains('fa-trash-alt')) {

                const removeQuantity = event.target;
                const removedItem = cart.find(cItem => cItem.id == removeQuantity.dataset.id);
                this.removeItem(removedItem.id);

                Storage.saveCart(cart);

                cartContent.removeChild(removeQuantity.parentElement);

            }else if(event.target.classList.contains('fa-chevron-down')){
                const subQuantity = event.target;
                const subtractedItem = cart.find(cItem => cItem.id == subQuantity.dataset.id);

                if(subtractedItem.quantity === 1){
                    this.removeItem(subtractedItem.id)
                    cartContent.removeChild(subQuantity.parentElement.parentElement);
                }
                subtractedItem.quantity--;
                this.setCartValue(cart);
                Storage.saveCart(cart);
                subQuantity.previousElementSibling.innerText = subtractedItem.quantity;
            }
        })
    }

    removeItem(id) {
        cart = cart.filter(item => item.id !== id);
        this.setCartValue(cart);
        Storage.saveCart(cart);
        this.singleItemButton(id)
    }

    singleItemButton(id) {
        const buttn = buttonsDOM.find(item => parseInt(item.dataset.id) === parseInt(id));
        buttn.innerHTML = `add to <i class="fa-solid fa-cart-plus"></i>`;
        buttn.disabled = false;
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
    static saveCart(cart) {
        localStorage.setItem('cart', JSON.stringify(cart))
    }
    static getCart() {
        return JSON.parse(localStorage.getItem(('cart')));
    }
}


document.addEventListener('DOMContentLoaded', () => {
    const products = new Products();
    const productsData = products.getProducts();
    const ui = new UI();
    ui.displayProducts(productsData);
    ui.setUpApp();
    ui.cartLogic();
    ui.getAddToCartBtns();
    Storage.saveProducts(productsData);
})

function showModal() {

    backdrop.style.display = 'block';
    cartModal.style.opacity = '1';
    cartModal.style.top = '20%'
}

function closeModal() {
    backdrop.style.display = 'none';
    cartModal.style.opacity = '0';
    cartModal.style.top = '-100vh'
}

function darkTheme() {
    document.body.classList.toggle('dark_mode')
}