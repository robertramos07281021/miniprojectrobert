const express = require('express');
const app = express();
const path = require('path');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const ExpressError = require('./utils/ExpressError');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user');

//routers
const listingsRouter = require('./server/routers/listingRouters');
const userRouter = require('./server/routers/userRouter');

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/client/views'));

app.use(express.urlencoded({extended: true}));
app.use(methodOverride('_method'));


//for partials files
app.engine('ejs', ejsMate);


app.use(express.static(path.join(__dirname, 'public')));

const sessionConfig = {
    secret: 'thisissecret',
    cookie:{
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7 ,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}

app.use(session(sessionConfig));


//configuration of passport js middleware for authentication
app.use(passport.initialize());
app.use(passport.session());
//local strategy authomatic having a username and passpord on db
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


// configuration of flash messages
app.use(flash());
app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})


// app.get('/create-user', async(req, res) => {
//     const user = new User({email: 'test@gmail.com', username: 'TestUsername'});
//     const newUser = await User.register(user, 'testPassword');
//     res.send(newUser);
// })


//execute routers
app.use('', listingsRouter);
app.use('', userRouter);

//for request that do not exists
app.use('*', (req, res, next)=> {
    next(new ExpressError('Page not found', 404));

})

//error handler
app.use((err, req, res, next) => {
    const {statusCode = 500} = err;
    if(!err.message) err.message = 'Something went wrong!';
    res.status(statusCode).render('error',{err});
})


app.listen(8000, ()=> {
    console.log("Server up to 8000");
})