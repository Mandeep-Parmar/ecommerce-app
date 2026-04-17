import Order from "../models/orderModel.js";
import User from "../models/userModel.js";

// Placing order using COD method
const placeOrder = async (req, res) => {
  try {
    const { userId, amount, address, items } = req.body;

    const orderData = {
      userId,
      items,
      address,
      amount,
      paymentMethod: "COD",
      payment: false,
      date: Date.now(),
    };

    const newOrder = new Order(orderData);
    await newOrder.save();

    // clear cart data
    await User.findByIdAndDelete(userId, { cartData: {} });

    res.json({ success: true, message: "Order Placed" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Placing order using Stripe method
const placeOrderStripe = async (req, res) => {};

// Placing order using Razorpay method
const placeOrderRazorpay = async (req, res) => {};

// All orders data for Admin panel
const allOrders = async (req, res) => {
  try {
    const orders = await Order.find({});

    res.json({ success: true, orders });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// All User's orders data for Frontend
const userOrders = async (req, res) => {
  try {
    // get this from auth.js
    const { userId } = req.body;

    const orders = await Order.find({ userId });
    res.json({ success: true, orders });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Update order status from Admin panel
const updateStatus = async (req, res) => {};

export {
  placeOrder,
  placeOrderStripe,
  placeOrderRazorpay,
  allOrders,
  userOrders,
  updateStatus,
};
