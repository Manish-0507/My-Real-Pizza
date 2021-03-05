const User = require('../../models/user');
const bcrypt = require('bcrypt');
const passport = require('passport');

function authController()
{
	_getRedirectUrl = (req) =>
	//yo method baad m pdhiye pehle is nichla login t laag yo is m t e call horya h.
	{
		return req.user.role === 'admin' ? '/admin/orders' : '/customer/orders';
	}
	return {
		//********************for rendering login page********************************
		logIn(req, res) {
			res.render('auth/login');
		},

		//********************for loggin in********************************
		postLogin(req, res, next) {
			const { email, password } = req.body;
			//validate request
			if (!email || !password) {
				req.flash('error', 'All fields are required!');
				return res.redirect('/login');
			}

			//sbta pehli passport.js m chlya ja sb kim utha e h.fer 2nd step ura aaiye.
			passport.authenticate('local', (err, user, info) => {
				//first param mtlb hmne konsi strategy use ki h or or 2nd param wo h jo passport.js m done() me jo arguments bheje hna hmne wo.
				if (err) {
					req.flash('error', info.message); //message key t aapin message diya h passport.js m.
					return next(err);
				}
				if (!user) {
					req.flash('error', info.message);
					return res.redirect('/login');
				}
				//agr user paa gya
				req.login(user, (err) => {
					if (err) {
						req.flash('error', info.message);
						return next(err);
					}

					return res.redirect(_getRedirectUrl(req)); 
				}); //ye wo user h jo passport.js se aa rha h or hum kh rhe h ki ha ise login kr do.
			})(req, res, next); //passport.authenticate returns a function jise humne yha call kr diya.
		},

		//********************for rendering register page********************************

		register(req, res) {
			res.render('auth/register');
		},
		
		//********************to register a new user********************************
		async postRegister(req, res) {
			const { name, email, password } = req.body;
			//validate request
			if (!name || !email || !password) {
				req.flash('error', 'All fields are required!'); //to display message on front-end;
				//maan le koi field khaali rh gya or submit kr diya to error to dede h but jo filled field the wo bhi khaali ho jya h to iskhatr aapi wo value bhi bhejanga.
				req.flash('name', name);
				req.flash('email', email);
				return res.redirect('/register');
			}
			//check if email exists
			User.exists(
				{
					email: email
				},
				(err, result) => {
					//nhyi kis parameter k through filter krna h jase ki yha hum email k through kra ha ki bhyi ya jo email aapin ghaali h wa pehle e h k db m.
					if (result) {
						//mtlb email mili h db m same.
						req.flash('error', 'Email already taken!');
						req.flash('name', name);
						req.flash('email', email);
						return res.redirect('/register');
					}
				}
			);
			//hash passsword
			const hashedPassword = await bcrypt.hash(password, 10);

			//create a user
			const user = new User({
				name,
				email,
				password: hashedPassword
			});
			user
				.save()
				.then(() => {
					//Login
					return res.redirect('/');
				})
				.catch((err) => {
					req.flash('error', 'Something went wrong!!');
					return res.redirect('/register');
				});
		},

		//********************For logging out********************************

		logout(req, res) {
			req.logout();
			return res.redirect('/login');
		}
	};
}

module.exports = authController;
