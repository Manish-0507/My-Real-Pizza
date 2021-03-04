const Menu = require('../../models/menu');

function  homeController() {
    //factory functions returns objects
    return {
       async index (req, res) {//same as index:function(){}
         
            const pizzas = await Menu.find();
            return res.render('home', { myPizza: pizzas });
        
        }
    }
}

module.exports = homeController; 