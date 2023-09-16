const mongoose = require('mongoose');
const Listing = require('../models/listing');
const cities = require('../seeds/cities');
const {descriptors, places} = require('../seeds/seedHelpers');

mongoose.connect("mongodb://localhost:27017/listing")
    .then(() => {
        console.log("Connection open");
    })
    .catch(err => {
        console.log("Error: ", err)
    })
    
const seedDb  = async() => {
    await Listing.deleteMany({});
    const randomNameNum = (array) => array[Math.floor(Math.random() * array.length)];
    const randomPrice = Math.floor(Math.random() * 10000 );
    for(let i = 0; i < 50; i++ ) {
        const randomCityNum = Math.floor(Math.random() * 1006 + 1);

        const listing = new Listing({
            author: '64fd4b944c9377b51695d67a',
            location: `${cities[randomCityNum].city}, ${cities[randomCityNum].admin_name}`,
            image: "https://source.unsplash.com/collection/483251",
            name: `${randomNameNum(descriptors)}, ${randomNameNum(places)}`,
            description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Laboriosam facere ab id recusandae fugiat ducimus eaque excepturi, sunt neque. Ea animi saepe vero qui reiciendis iusto sapiente voluptas sit quasi!',
            price: randomPrice
        }) 
        await listing.save();
    }
}

seedDb().then(() => {
    mongoose.connection.close();
})
