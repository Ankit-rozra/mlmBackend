const product = require('../../model/product/product.model');
const productMulter = require('../../middleware/product.multer');

const create = async (req, res, next) => {

    productMulter.array('avatar')(req, res, async (err) => {
        if (err) {
              res.status(400).json({ err });
        }
        try{
            const imagePaths = req.files.map(file => file.path);
            const {
                name,
                description,
                price,
                reperchsaeBV,
                orderConfirmed,
                category,
                stock,
            }  = req.body;

            const repurchaseBVS = (price*10)/100;

            const productData = new product({
                avatar: imagePaths,
                name:name,
                description:description,
                price:price,
                reperchsaeBV:repurchaseBVS,
                orderConfirmed:orderConfirmed,
                category:category,
                stock:stock,
            })
            const savedproduct = await productData.save();
            res.status(201).json(savedproduct)

        } catch (error) {
            console.log(error)
       }
    })
}

const findproduct = async (req, res) => {

    try {
         var data = await product.find({});
        
         return res.status(201).json(data);
    } catch (err) {
        // return console.log(err);
        return res.status(500).json({
              message: "error",
              err,
         });
    }
}

module.exports = {
    create,
    findproduct
}