const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/user');
const bcrypt = require('bcrypt');

 function init(passport) {
    passport.use(new LocalStrategy({ usernameField: 'email' }, async (email,password,done) => {//usernamefield  mtlb aapin is taai btani pda h k aapna project m username k h mtlb jistra aapna username email h kai jagah phone number how h is tarah.fer aaga isma jo bhi bhrya h login krte waqt ha wo mil jya h email,password or 3dh ek callback jisna aapin done kh diya.
       //login
        
        //check if email exists
        const user = await User.findOne({ email: email })
        if (!user) {
            return done(null,false,{message:'No user with this email!'})//ye first parameter error ka hota h.
        }
        bcrypt.compare(password, user.password).then(match => {
            if (match) {
                return done(null,user,{message:'Logged in successfully!'})
            } else {
                return done(null,false,{message:'Wrong login details!'})
            }
        }).catch(err => {
            return done(null,false,{message:'Something went wrong!'})
        })

    }))
     passport.serializeUser((user,done) => {
         done(null,user._id)
     })//agr user login ho jata h to hme session k ander kuchh save krna hota h kuchh bhi kr skte emai,id name etc h but normally hum session id krte h.

     passport.deserializeUser((id,done) => {//ye id h currently logged in user ki kyuki usi ka to system match hua h//yha hme wo mil jaata h jo hum save krte h uper mtlb serialize me yani ki id apni jo kri thi save.
         User.findById(id, (err,user) => {//id t fer wo user find kr liya.
          done(err,user)
      })//ista k howga aapi is ceez n(req.user) n access kr skange mtlb currently konsa user login h bhyi jo id aapin ave kri h usse t e ulta kaad liya user.
     })
     

 }




module.exports = init;