const express = require('express');
const router = express.Router();
const listingController = require('../controllers/listingControllers');
const  {isLogedIn, validateListing , validateReview , isAuthor, isReviewAuthor} = require('../../middlewares')


//listings routers
router.get('/listings', listingController.allListings);
router.get('/listings/new-listing-form',isLogedIn, listingController.newListingForm);
router.post('/listings',validateListing,isLogedIn, listingController.saveListing);
router.get('/listings/:id', listingController.viewListing);
router.get('/listings/:id/update-listing',isLogedIn,isAuthor,listingController.updateListingForm);
router.put('/listings/:id',validateListing,isLogedIn,isAuthor,listingController.updateListing);
router.delete('/listings/:id',isLogedIn,isAuthor, listingController.deleteListing);
//reviews routers
router.post('/listings/:id/reviews',validateReview, listingController.saveReview);
router.delete('/listings/:id/reviews/:reviewId',isLogedIn,isReviewAuthor,listingController.deleteReview);

module.exports = router; 