const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Review = require('./review');



const ListingSchema = new Schema({
    name: String,
    price: {
        type: Number,
        min: 0
    },
    image: String,
    description: String,
    location: String,
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Review'
        }
    ]
})


// you need this modele function to delete the review when you want to delete the listing.
ListingSchema.post('findOneAndDelete', async function(doc){ 
    if(doc) {
        await Review.deleteMany({
            _id: {
                $in: doc.reviews
            }
        });
    }
})

module.exports = mongoose.model('Listing', ListingSchema);
