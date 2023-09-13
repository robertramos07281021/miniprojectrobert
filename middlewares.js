const Listing = require('./models/listing')
const ExpressError = require('./utils/ExpressError');

//joi validation
const { listingSchemaValidation, reviewSchemaValidation } = require('./schemas');

const Review = require('./models/review');

// for login to authenticate if you need to login
module.exports.isLogedIn = (req,res, next) => {
    req.session.returnTo = req.originalUrl;
    if(!req.isAuthenticated()) {
        req.flash ('error', "You must be logged In")
        return res.redirect('/login') 
    }
    next();
}


module.exports.returnTo = (req, res, next) => {
    if(req.session.returnTo) {
        res.locals.returnTo = req.session.returnTo;
    }
    next();
}


module.exports.validateListing = (req, res, next) => {
    const {error} = listingSchemaValidation.validate(req.body);
    if(error) {
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
}

module.exports.validateReview = (req, res, next) => {
    const {error} = reviewSchemaValidation.validate(req.body);
    if(error) {
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
} 

module.exports.isAuthor = async (req, res, next) => {
    const listingId = req.params.id;
    const listing = await Listing.findById(listingId);
    if(!listing.author.equals(req.user._id)) {
        req.flash('error', 'You dont have permission');
        res.redirect(`/listings/${listingId}`);
    }
    next();
}
module.exports.isReviewAuthor = async (req, res, next) => {
    const listingId = req.params.id
    const reviewId = req.params.reviewId;
    const review = await Review.findById(reviewId);
    if(!review.author.equals(req.user._id)) {
        req.flash('error', 'You dont have permission');
        res.redirect(`/listings/${listingId}`);
    }
    next();
}