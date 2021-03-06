import axios from 'axios';
import Noty from 'noty';
import moment from 'moment'
import {initAdmin} from './admin'

let addToCart = document.querySelectorAll('.add-to-cart');
let cartCounter = document.querySelector('#cartCounter');

addToCart.forEach((btn) => {
    btn.addEventListener('click', (e) => {
        let pizza=JSON.parse(btn.dataset.pizza)//convert back to object//jo home.js me data-set likha tha btn pr usme 'data' predefined hota h apna bs nam hota h jse yha pizza diya hmne to dataset se wo data hme mil jayega jo hmne wha set kiya tha.
        updateCart(pizza);
    })
})

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

//remove success alert after x seconds
const alertmsg = document.querySelector('#success-alert');
if (alertmsg) {
    setTimeout(() =>
    {
        alertmsg.remove();
    },2000)
}


//it is showing a error becoz generatemarkup funcn in admin js gets order argument only at admin route so on other pages it shows error.
let adminAreaPath = window.location.pathname;
if (adminAreaPath.includes('admin')) {
    initAdmin();
}



//change order status

// Change order status
let statuses = document.querySelectorAll('.status_line')
let hiddenInput = document.querySelector('#hiddenInput')
let order = hiddenInput ? hiddenInput.value : null
order = JSON.parse(order)
let time = document.createElement('small')

function updateStatus(order) {
    statuses.forEach((status) => {
        status.classList.remove('step-completed')
        status.classList.remove('current-status')
    })
    let stepCompleted = true;
    statuses.forEach((status) => {
       let dataProp = status.dataset.status
       if(stepCompleted) {
            status.classList.add('step-completed')
       }
       if(dataProp === order.status) {
            stepCompleted = false
            time.innerText = moment(order.updatedAt).format('hh:mm A')
            status.appendChild(time)
           if(status.nextElementSibling) {
            status.nextElementSibling.classList.add('current-status')
           }
       }
    })

}

updateStatus(order);

// //pehle sari classes htaa de fir nyi jud jayengi nhi to pehle ki bhi judi rh jaati h.
// //agr jo order server t aarya h uska status or looping k through data property apni list m jis bhi list pr match hojya.


//Socket
//jse hi hmne layout.ejs me file add ki import ki .js extension se to yha hme ek variable available ho gya named 'io';
let socket = io();

//join
if (order) {
    //join naam ki event emit krdi .isna serverjs m pkdange
 socket.emit('join', `order_${order._id}`);//yo aapi ek private room join kra ha or uska naam hona chahiye unique to bs har order ka alg room usse ki id k naam t.//jse hi page khul jaayega mtlb order aala data aate hi us hidden input m t mtlb(jb use apna order tracking khatr click kraga to us id t fetch krke data koni bhejange k is tracking aala page pr us pachha fer hidden aala t bhej rakhya yrrr.).yo socket ek msg bhej dega us order ki id gel bhej dega.
 
}


socket.on('orderUpdated', (data) =>
{
    const updatedOrder = { ...order }//yo h purana order jo uper h n wo.
   updatedOrder.updatedAt = moment().format()//hme current time show krna h
    updatedOrder.status = data.status;
    updateStatus(updatedOrder);
     new Noty({
            type: 'success',
            timeout: 1000,
            progressBar: false,
            // layout:'bottomLeft',can change layout by this
            text: 'order Updated!'
         }).show()
})
