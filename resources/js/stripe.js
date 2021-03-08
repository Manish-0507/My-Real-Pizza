
import { loadStripe } from '@stripe/stripe-js';
import {placeOrder} from './apiService';

const cardElement = document.querySelector('#card-element');
export async function initStripe()
{
    //stripe configuration.
    const stripe = await loadStripe('pk_test_51ISfEzF929MJummc27mjq19FhPVOYFR5HgWCmef3O8OolpqD6OE6wLqVDOSfwmHWrvj5rMB48AqHSZLNV9rwU9fc00gcnSVWq2');//get from stripe site>dashbord>>developers>apikeys.
   
    let card = null;
   async function  mountWidget()
    {
         const elements = stripe.elements();
    let style = {
        base: {
            color: '#32325d',
            fontFamily: '"Helvetica neue",Helvetica,sans-serif',
            fontSmoothing: 'antialiased',
            fontSize: '16px',
            '::placeholder': {
                color: '#aab7c4'
            }
        },
        invalid: {
            color: '#fa755a',
            iconColor: '#fa755a'
        }
    };
    
    //konsa element apne ko chahiye mtlb uska design jo hme dikhega payment k options fill krne k iye. 
    card=elements.create('card', { style:style,hidePostalCode:true});

    //inject it in our browser(mount);
    card.mount('#card-element');
    }
   
   
    const paymentType = document.querySelector('#paymentType');
    if (paymentType){
        paymentType.addEventListener('change',(e) =>
    {
        if (e.target.value === 'card') {
           //display card widget
             cardElement.style.display = 'block';
            mountWidget();

        } else {
            //display no card widget
            cardElement.style.display = 'none';
            card.destroy();
        }
    })
    }
    



//AJAX call for submitting on order now button.
const paymentForm = document.querySelector('#payment-form');
if (paymentForm) {
  paymentForm.addEventListener('submit', (e) =>
{
    e.preventDefault();//ye isliye h jo form h wha submit krte hi req. na jaye or reload na ho.
    let formData = new FormData(paymentForm);//formData ek object bn jyaga us form ka.
    //us form k ander jo bhi h wo bera padange entries method t.is entries pr loop krke aapi data bahr kadange kise variable m store krke.
    let formObject = {}
    for (let [key, value] of formData.entries()) {
        formObject[key] = value;//ib ek for bn jyaga jiskikey wa hogi jo aapin key mili h or value bhi jo mili h.
    };//agr simply for key of formdata.e.... krte to dikhata "address":"...." and agr [key] ya [key,value] kre to bina "" inke milega like address,value......ase. 
   
      if (!card) {//by default to card null h or agr by card select h tbhi to card variable me data aa rha h uper to agr card nhi h to ye req. nhi jani chahiye.
       //normal Ajax call
          placeOrder(formObject);
          return;
   }   
  
  
  //verify card
      stripe.createToken(card).then((res) =>
      {
       //we will get our token here.
          formObject.stripeToken = res.token.id; //form object m address and name k saath token bhi bhejanga.
          placeOrder(formObject);
      }).catch((err) =>
      {
          console.log(err);
   })
      
      
      
      
})  
}

}