import User from "../models/userModel.js";

// add products to user cart
const addToCart = async (req, res) => {
  try {
    const { userId, itemId, size } = req.body;
    if (!userId || !itemId || !size) {
      return res.json({ success: false, message: "Missing cart payload" });
    }

    const userData = await User.findById(userId);
    if (!userData) {
      return res.json({ success: false, message: "User not found" });
    }
    const cartData = userData.cartData;

    // Check if item already exists in cart
    if (cartData[itemId]) {
      // Check if specific size of item already exists
      if (cartData[itemId][size]) {
        cartData[itemId][size] += 1;
      } else {
        // If size not present, initialize with quantity 1
        cartData[itemId][size] = 1;
      }
    } else {
      // If item is not in cart, create new entry
      cartData[itemId] = {};

      // Add selected size with quantity 1
      cartData[itemId][size] = 1;
    }

    await User.findByIdAndUpdate(userId, { cartData });

    res.json({ success: true, message: "Added To Cart" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// update quantity in user cart
const updateCart = async (req, res) => {
  try {
    const { userId, itemId, size, quantity } = req.body;
    if (!userId || !itemId || !size || quantity === undefined) {
      return res.json({ success: false, message: "Missing cart payload" });
    }
    if (quantity < 0) {
      return res.json({
        success: false,
        message: "Quantity cannot be negative",
      });
    }

    const userData = await User.findById(userId);
    if (!userData) {
      return res.json({ success: false, message: "User not found" });
    }
    const cartData = userData.cartData;

    cartData[itemId][size] = quantity;

    await User.findByIdAndUpdate(userId, { cartData });

    res.json({ success: true, message: "Cart Updated" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// get user cart data
const getUserCart = async (req, res) => {
  try {
    const { userId } = req.body;
    if (!userId) {
      return res.json({ success: false, message: "Missing user id" });
    }

    const userData = await User.findById(userId);
    if (!userData) {
      return res.json({ success: false, message: "User not found" });
    }
    const cartData = userData.cartData;

    res.json({ success: true, cartData });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

export { addToCart, updateCart, getUserCart };
