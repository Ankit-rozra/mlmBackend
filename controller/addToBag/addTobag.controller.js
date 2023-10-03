const bag = require('../../model/addToBag/addToBag.model');
const user = require('../../model/customer/customer.model');
const products = require("../../model/product/product.model")
// const bag = require("../../model/addToBag/addToBag.model")

const create = async (req, res) => {
  try {
    var {
      userId,
      products: [{ PID, quantity, price }]
    } = req.body;

    var addToBag = new bag({
      userId: userId,
      products: [{ PID: PID, quantity: quantity, price: price }]
    });
    const bagData = await addToBag.save();

    // const productDetails = await products.find({ _id: PID })
    // // const price =  productDetails.price
    // const bvIncrement = 0.1 * price;

    // // Update the user's bv field with the increment
    // const updatedUser = await user.findOneAndUpdate(
    //   { _id: userId },
    //   { $inc: { bv: bvIncrement } },
    //   { new: true }
    // );

    res.status(200).send({
      success: true,
      msg: "Product added to bag",
      data: bagData,
      // user: updatedUser
    });
  } catch (error) {
    res.status(400).send({
      success: false,
      msg: error.message
    });
  }
};


const findBagItems = async (req, res) => {
  const { userID } = req.params;

  try {
    const bagData = await bag.find({ userId: userID });

    if (bagData.length === 0) {
      return res.status(404).json({ error: 'bagData not found' });
    }

    const productIDs = [];
    for (let i = 0; i < bagData.length; i++) {
      for (let j = 0; j < bagData[i].products.length; j++) {
        productIDs.push(bagData[i].products[j].PID);
      }
    }
    const allProducts = await products.find({ _id: { $in: productIDs } });

    res.json(allProducts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const deleteBag = async (req, res) => {
  const { userID, PID } = req.params;

  try {
    const bagData = await bag.deleteOne(
      { userId: userID, 'products.PID': PID }
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

const paymentstatus = async (req, res) => {

  try {
    const bagId = req.params.bagId;

    const updatedBag = await bag.findByIdAndUpdate(
      bagId,
      { orderStatus: true },
      { new: true } // This option returns the updated document
    );

    if (!updatedBag) {
      return res.status(404).json({ message: 'Bag not found' });
    }

    return res.status(200).json(updatedBag);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

  






module.exports = { create, findBagItems, deleteBag , paymentstatus}; 