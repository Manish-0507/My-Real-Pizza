import axios from 'axios';
import Noty from 'noty';

let addToCart = document.querySelectorAll('.add-to-cart');
let cartCounter = document.querySelector('#cartCounter');

function updateCart(pizza) {
    axios.post('/update-cart', pizza).then(res => {
        cartCounter.innerText = res.data.totalQty;//jo req k response me mila h usme se nikal liya.
        new Noty({
            type: 'success',
            timeout: 1000,
            progressBar: false,
            // layout:'bottomLeft',can change layout by this
            text: 'item added to cart'
         }).show()
    }).catch(err => {
        new Noty({
            type: 'error',
            timeout: 1000,
            progressBar: false,
            // layout:'bottomLeft',can change layout by this
            text: 'something went wrong!'
         }).show()
    })
}

addToCart.forEach((btn) => {
    btn.addEventListener('click', (e) => {
        let pizza=JSON.parse(btn.dataset.pizza)//convert back to object//jo home.js me data-set likha tha btn pr usme 'data' predefined hota h apna bs nam hota h jse yha pizza diya hmne to dataset se wo data hme mil jayega jo hmne wha set kiya tha.
        updateCart(pizza);
    })
})
