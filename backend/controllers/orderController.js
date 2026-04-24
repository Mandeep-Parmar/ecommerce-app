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

    if (!items || items.length === 0) {
      return res.json({
        success: false,
        message: "Cart is empty",
      });
    }

    if (!amount || amount <= 0) {
      return res.json({ success: false, message: "Invalid amount" });
    }

    if (!address || !address.firstName) {
      return res.json({ success: false, message: "Address required" });
    }

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
    await User.findByIdAndUpdate(userId, { cartData: {} });

    res.json({ success: true, message: "Order Placed" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Placing order using Razorpay method
const placeOrderRazorpay = async (req, res) => {
  try {
    const { userId, amount, address, items } = req.body;

    if (!items || items.length === 0) {
      return res.json({
        success: false,
        message: "Cart is empty",
      });
    }

    if (!amount || amount <= 0) {
      return res.json({ success: false, message: "Invalid amount" });
    }

    if (!address || !address.firstName) {
      return res.json({ success: false, message: "Address required" });
    }

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
        return res.json({ success: false, message: error.message });
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
    if (!userId || !razorpay_order_id) {
      return res.json({ success: false, message: "Invalid payment payload" });
    }

    const orderInfo = await razorpayInstance.orders.fetch(razorpay_order_id);
    const localOrder = await Order.findById(orderInfo.receipt);
    if (!localOrder) {
      return res.json({ success: false, message: "Order not found" });
    }
    if (localOrder.userId !== userId) {
      return res.json({ success: false, message: "Unauthorized order access" });
    }

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
    if (!orderId || !status) {
      return res.json({
        success: false,
        message: "Order id and status are required",
      });
    }

    await Order.findByIdAndUpdate(orderId, { status });
    res.json({ success: true, message: "Status Updated" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

export {
  placeOrder,
  placeOrderRazorpay,
  allOrders,
  userOrders,
  updateStatus,
  verifyRazorpay,
};
