import Order from "../models/orderModel.js";
import User from "../models/userModel.js";
import Razorpay from "razorpay";

// global variables
const currency = "inr";
const deliveryCharge = 10;

// gateway initialize
const razorpayInstance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

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
const placeOrderRazorpay = async (req, res) => {
  try {
    const { userId, amount, address, items } = req.body;

    const orderData = {
      userId,
      items,
      address,
      amount,
      paymentMethod: "Razorpay",
      payment: false,
      date: Date.now(),
    };

    const newOrder = new Order(orderData);
    await newOrder.save();

    const options = {
      amount: amount * 100, // convert into paisa*
      currency: currency.toUpperCase(),
      receipt: newOrder._id,
    };

    await razorpayInstance.orders.create(options, (error, order) => {
      if (error) {
        console.log(error);
        res.json({ success: false, message: error });
      }
      res.json({ success: true, order });
    });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// verify razorpay payment
const verifyRazorpay = async (req, res) => {
  try {
    const { userId, razorpay_order_id } = req.body;

    const orderInfo = await razorpayInstance.orders.fetch(razorpay_order_id);

    // console.log(orderInfo);

    if (orderInfo.status === "paid") {
      // orderInfo.receipt contains user id
      await Order.findByIdAndUpdate(orderInfo.receipt, { payment: true });

      // empty cart data
      await User.findByIdAndUpdate(userId, { cartData: {} });

      return res.json({ success: true, message: "Payment Successfull" });
    }

    return res.json({ success: false, message: "Payment Failed" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

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
const updateStatus = async (req, res) => {
  try {
    const { orderId, status } = req.body;

    await Order.findByIdAndUpdate(orderId, { status });
    res.json({ success: true, message: "Status Updated" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

export {
  placeOrder,
  placeOrderStripe,
  placeOrderRazorpay,
  allOrders,
  userOrders,
  updateStatus,
  verifyRazorpay,
};
