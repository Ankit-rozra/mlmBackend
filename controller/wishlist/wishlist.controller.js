const Wishlist = require('../../model/wishllist/wishlist..model');
const products = require('../../model/product/product.model')


const addwhislist = async (req, res) => {
// return console.log("hgiyfuy")
    var { PID, userId } = req.body;
    try {
        const existingItem = await Wishlist.findOne({ PID, userId });
        if (existingItem) {
            return res.status(409).json({ "msg": 'Product already exists in the wishlist' });
        }
        const wishlistItem = new Wishlist({ 
            PID :PID, 
            userId : userId});
        const savedItem = await wishlistItem.save();
        res.status(201).json(savedItem);
    } catch (error) {
        return console.log(error)
        res.status(500).send(error);
    }

}

const findWishlist = async (req, res) => {
    const { userID } = req.params;

    try {
        const wishlistData = await Wishlist.find({ userId: userID });
        if (wishlistData.length === 0) {
            return res.status(404).json({ error: 'Wishlist not found' });
        }
        const productIDs = wishlistData.map(item => item.PID);

        const allProducts = await products.find({ _id: { $in: productIDs } });

        res.json(allProducts);

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const deleteWish = async (req, res) => {
    const { userID, PID } = req.params;

    try {
        const bagData = await Wishlist.deleteOne(
            { userId: userID, PID: PID }
        );

        if (!bagData.deletedCount) {
            return res.status(404).json({ msg: 'Bag not found' });
        }

        res.send(bagData);
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Internal server error' });
    }
};


module.exports = { addwhislist, findWishlist, deleteWish };