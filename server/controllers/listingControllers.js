const mongoose = require('mongoose');
const Listing = require('../../models/listing');
const catchAsync = require('../../utils/catchAsync')
const Review = require('../../models/review')


mongoose.connect("mongodb://0.0.0.0:27017/listing")
    .then(() => {
        console.log("Connection open");
    })
    .catch(err => {
        console.log("Error: ", err)
    })


//render and for index.ejs
exports.allListings = catchAsync(async (req, res) => {
    const listings = await Listing.find();
    res.status(200).render('listings/index',{listings});
});

//render and for show.ejs
exports.viewListing = catchAsync(async (req, res) => {
    const listingId = req.params.id;
    const listing = await Listing.findById(listingId).populate({path: 'reviews', populate: {path: 'author'}}).populate('author');
    console.log(listing)
    if(!listing){
        req.flash('error','Listing does not exist!! ERROR 404')
        return res.redirect('/listings');
    }
    res.status(200).render('listings/show',{listing});
});

//render new.ejs
exports.newListingForm = (req, res) => {
    res.status(200).render('listings/new');
};

// for new.ejs
exports.saveListing = catchAsync(async (req, res, next) => {
    const newListing = new Listing(req.body.listing);
    newListing.author = req.user._id;
    await newListing.save();
    req.flash('success', 'You have succesfully added listing');
    res.redirect(`/listings/${newListing.id}`);

});

// render edit.ejs
exports.updateListingForm = catchAsync(async (req, res) => {
    const {id} = req.params;
    const listing = await Listing.findById(id);
    if(!listing) {
        req.flash('error','Listing does not exist!! ERROR 404')
        return res.redirect('/listings');
    }
    res.status(200).render('listings/edit',{ listing });
});

//for edit.ejs
exports.updateListing = catchAsync(async (req,res) =>{

    // if you have Joi database validation you need to add the group name  of your req.body-- that is listing - same on group name of configuration on Joi validation
    const {id} = req.params;
    const updateListing = await Listing.findByIdAndUpdate(id, {...req.body.listing});
        // or
    // const listingId = req.params.id;
    // const updateListing = await Listing.findByIdAndUpdate(listingId, {...req.body});
    req.flash('success', 'You have successfully update Listing')
    res.redirect(`/listings/${id}`);
        //or
    // res.redirect(`/listings/${listingId}`);
        // 
    //res.redirect(`listings/${updateListing.id}`);

});

// for delete ejs
exports.deleteListing = async (req,res) => {
    const {id} = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash('success', 'You have successfuly deleted Listing')
    res.status(200).redirect('/listings');
};

// for reviewsss

exports.saveReview = catchAsync( async (req ,res) => {
    const listing = await Listing.findById(req.params.id)
    const review = new Review(req.body.review);
    review.author = req.user._id;
    listing.reviews.push(review);
    await listing.save();
    await review.save();
    req.flash('success', 'You have successfuly added Review')
    res.redirect(`/listings/${listing.id}`);
})


exports.deleteReview = catchAsync(async(req,res) => {
    const {id, reviewId} = req.params;
    await Listing.findByIdAndUpdate(id, {$pull: {reviews: reviewId}})
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'You have successfuly delete Review')
    res.redirect(`/listings/${id}`);
})