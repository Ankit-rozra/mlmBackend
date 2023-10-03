const ProductDetail = require('../../model/product/product.model');
const ProductOrder = require('../../model/produdctOrder/productOrder.model');
const User = require('../../model/customer/customer.model')

const create = async (req, res, next) => {
    try {
        const {
            user,
            productID,
            quantity,
            totalPrice,

            deliveryAddress,
        } = req.body

        const order = new ProductOrder({
            user: user,
            productID: productID,
            quantity: quantity,
            totalPrice: totalPrice,
            deliveryAddress: deliveryAddress,
        })

        const orderdata = await order.save();
        const bvIncrement = 0.1 * totalPrice;

        // Update the user's bv field with the increment
        const updatedUser = await User.findOneAndUpdate(
          { _id: user },
          { $inc: { bv: bvIncrement } },
          { new: true }
        );
        res.status(200).send({
            success: true,
            msg: "Data Submitted Successfully",
            data: orderdata,
            user: updatedUser

        })
    } catch (err) {
        return console.error(err)
        return res.status(500).json( err );
    }
}

const statusUpdate = async (req, res) => {
    const userId = req.params.id;

    try {
        const order = await ProductOrder.findById(userId);

        if (!order) {
            return res.status(404).json({ message: 'order not found' });
        }

        // Update customerVerified to true
        order.orderStatus = true;

        // Save the updated user
        await order.save();

        return res.status(200).json({ message: 'product Oder verified updated to true' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}


const findall = async (req, res) => {

    try {
        var data = await ProductOrder.find({});

        return res.status(201).json(data);
    } catch (err) {
        // return console.log(err);
        return res.status(500).json({
            message: "error",
            err,
        });
    }
}

const allfalseorders = async (req, res) => {

    try {
        const orders = await ProductOrder.find({ orderStatus: false }).exec();

        if (!orders || orders.length === 0) {
            return res.status(404).json({ message: 'No orders with orderStatus: false found.' });
        }

        res.status(200).json(orders);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
}

const alltrueorders = async (req, res) => {

    try {
        const orders = await ProductOrder.find({ orderStatus: true }).exec();

        if (!orders || orders.length === 0) {
            return res.status(404).json({ message: 'No orders with orderStatus: true found.' });
        }

        res.status(200).json(orders);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
}

const deleteOrder = async (req, res) => {
    const { id } = req.params;

    try {
        const deletedOrder = await ProductOrder.findByIdAndDelete(id).exec();

        if (!deletedOrder) {
            return res.status(404).json({ message: 'Order not found.' });
        }

        res.status(200).json({ message: 'Order deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = {
    create, findall, statusUpdate, allfalseorders, alltrueorders, deleteOrder
}