import axios from 'axios';
import Noty from 'noty';

export function placeOrder(formObject)
{
    axios.post('/orders', formObject).then((res) =>
    {
        new Noty({
            type: 'success',
            timeout: 1000,
            progressBar: false,
            // layout:'bottomLeft',can change layout by this
            text: res.data.message //wha jo response me bhej rhe h json usme message key h.
        }).show()
        //kyuki hum message show hote hi redirect kr rhe h to hme thoda hi deikhega message isliye redirection ko delay kr rhe h thoda.
        setTimeout(() =>
        {
            window.location.href = '/customer/orders';//rediect k liye.
        },1000)
        
        
    }).catch((err) =>
    {
        new Noty({
            type: 'error',
            timeout: 1000,
            progressBar: false,
            // layout:'bottomLeft',can change layout by this
            text: err.res.data.message
         }).show()
    })
}