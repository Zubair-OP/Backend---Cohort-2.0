import cartModel from "../models/cart.model.js";
import productModel from "../models/product.model.js";
import { stockOfVariant } from "../Dao/productCart.dao.js";


export const addToCart = async(req,res) => {
    try {
        const {productId,variantId} = req.params;
        const {quantity = 1} = req.body;

       const productExist = await productModel.findOne({
        _id: productId,
        "variants._id": variantId
       });
       if (!productExist) {
           return res.status(404).json({ message: "Product not found",success: false });
       }

       const isStockAvailable = await stockOfVariant(productId,variantId);
       if(isStockAvailable < quantity){
        return res.status(400).json({ message: "Stock is not available",success: false });
       }

       // Find the correct price for the variant or fallback to product price
       const variant = productExist.variants.find(v => v._id.toString() === variantId);
       const price = variant.price || productExist.price;

       let cart = await cartModel.findOne({user: req.user._id});

       if(!cart){
        // Case 1: Cart doesn't exist for user -> create a new cart
        cart = await cartModel.create({
            user: req.user._id,
            items: [{
                product: productId,
                variant: variantId,
                quantity,
                price
            }]
        });
        return res.status(201).json({ message: "Product added to cart successfully", cart });
       }

       // Cart exists. Check if product & variant are already in it.
       const itemIndex = cart.items.findIndex(
           (item) => item.product.toString() === productId && item.variant.toString() === variantId
       );

       if (itemIndex > -1) {
           // Case 2: Item exists in cart -> update the quantity (using your $inc approach)
           cart = await cartModel.findOneAndUpdate(
               { user: req.user._id, "items.product": productId, "items.variant": variantId },
               { $inc: { "items.$.quantity": quantity } },
               { new: true, runValidators: true }
           );
       } else {
           // Case 3: Item doesn't exist in cart -> push new item
           cart = await cartModel.findOneAndUpdate(
               { user: req.user._id },
               { 
                   $push: { 
                       items: { product: productId, variant: variantId, quantity, price } 
                   } 
               },
               { new: true, runValidators: true }
           );
       }

       return res.status(200).json({ message: "Cart updated successfully", cart });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

export const getCart = async (req, res) => {
    try {
        const cart = await cartModel.findOne({ user: req.user._id }).populate('items.product', 'title images price');

        const totalPrice = cart
            ? cart.items.reduce((sum, item) => sum + (item.price?.amount || 0) * item.quantity, 0)
            : 0;

        return res.status(200).json({ message: "Cart fetched successfully", success: true, cart, totalPrice });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error", success: false });
    }
}

export const incrementCartItem = async (req, res) => {
    try {
        const { productId, variantId } = req.params;

        // Cart exist karti hai?
        const cart = await cartModel.findOne({ user: req.user._id });
        if (!cart) {
            return res.status(404).json({ message: "Cart not found", success: false });
        }

        // Item cart mein hai?
        const item = cart.items.find(
            (i) => i.product.toString() === productId && i.variant.toString() === variantId
        );
        if (!item) {
            return res.status(404).json({ message: "Item not found in cart", success: false });
        }

        // Stock check karo (current + 1 chahiye)
        const stock = await stockOfVariant(productId, variantId);
        if (item.quantity + 1 > stock) {
            return res.status(400).json({ message: "Stock limit reached", success: false });
        }

        // Atomic $inc se +1
        const updatedCart = await cartModel.findOneAndUpdate(
            { user: req.user._id, "items.product": productId, "items.variant": variantId },
            { $inc: { "items.$.quantity": 1 } },
            { new: true }
        );

        return res.status(200).json({ message: "Quantity incremented", success: true, cart: updatedCart });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error", success: false });
    }
};

export const addToCartNoVariant = async (req, res) => {
    try {
        const { productId } = req.params;
        const { quantity = 1 } = req.body;

        const product = await productModel.findById(productId);
        if (!product) {
            return res.status(404).json({ message: "Product not found", success: false });
        }

        const price = product.price;
        let cart = await cartModel.findOne({ user: req.user._id });

        if (!cart) {
            cart = await cartModel.create({
                user: req.user._id,
                items: [{ product: productId, quantity, price }],
            });
            return res.status(201).json({ message: "Product added to cart successfully", cart });
        }

        const itemIndex = cart.items.findIndex(
            (item) => item.product.toString() === productId && !item.variant
        );

        if (itemIndex > -1) {
            cart = await cartModel.findOneAndUpdate(
                { user: req.user._id, "items.product": productId, "items.variant": { $exists: false } },
                { $inc: { "items.$.quantity": quantity } },
                { new: true }
            );
        } else {
            cart = await cartModel.findOneAndUpdate(
                { user: req.user._id },
                { $push: { items: { product: productId, quantity, price } } },
                { new: true }
            );
        }

        return res.status(200).json({ message: "Cart updated successfully", cart });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export const incrementCartItemNoVariant = async (req, res) => {
    try {
        const { productId } = req.params;

        const cart = await cartModel.findOne({ user: req.user._id });
        if (!cart) return res.status(404).json({ message: "Cart not found", success: false });

        const item = cart.items.find(
            (i) => i.product.toString() === productId && !i.variant
        );
        if (!item) return res.status(404).json({ message: "Item not found in cart", success: false });

        const updatedCart = await cartModel.findOneAndUpdate(
            { user: req.user._id, "items.product": productId, "items.variant": { $exists: false } },
            { $inc: { "items.$.quantity": 1 } },
            { new: true }
        );

        return res.status(200).json({ message: "Quantity incremented", success: true, cart: updatedCart });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error", success: false });
    }
};

export const decrementCartItemNoVariant = async (req, res) => {
    try {
        const { productId } = req.params;

        const cart = await cartModel.findOne({ user: req.user._id });
        if (!cart) return res.status(404).json({ message: "Cart not found", success: false });

        const itemIndex = cart.items.findIndex(
            (i) => i.product.toString() === productId && !i.variant
        );
        if (itemIndex === -1) return res.status(404).json({ message: "Item not found in cart", success: false });

        const currentQty = cart.items[itemIndex].quantity;

        if (currentQty <= 1) {
            const updatedCart = await cartModel.findOneAndUpdate(
                { user: req.user._id },
                { $pull: { items: { product: productId, variant: { $exists: false } } } },
                { new: true }
            );
            return res.status(200).json({ message: "Item removed from cart", success: true, cart: updatedCart });
        }

        const updatedCart = await cartModel.findOneAndUpdate(
            { user: req.user._id, "items.product": productId, "items.variant": { $exists: false } },
            { $inc: { "items.$.quantity": -1 } },
            { new: true }
        );

        return res.status(200).json({ message: "Quantity decremented", success: true, cart: updatedCart });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error", success: false });
    }
};

export const clearCart = async (req, res) => {
    try {
        await cartModel.findOneAndUpdate(
            { user: req.user._id },
            { $set: { items: [] } }
        );
        return res.status(200).json({ message: "Cart cleared successfully", success: true });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error", success: false });
    }
};

export const decrementCartItem = async (req, res) => {
    try {
        const { productId, variantId } = req.params;

        // Cart exist karti hai?
        const cart = await cartModel.findOne({ user: req.user._id });
        if (!cart) {
            return res.status(404).json({ message: "Cart not found", success: false });
        }

        // Item cart mein hai?
        const itemIndex = cart.items.findIndex(
            (i) => i.product.toString() === productId && i.variant.toString() === variantId
        );
        if (itemIndex === -1) {
            return res.status(404).json({ message: "Item not found in cart", success: false });
        }

        const currentQty = cart.items[itemIndex].quantity;

        if (currentQty <= 1) {
            // Quantity 1 se kam ho to item remove kar do
            const updatedCart = await cartModel.findOneAndUpdate(
                { user: req.user._id },
                { $pull: { items: { product: productId, variant: variantId } } },
                { new: true }
            );
            return res.status(200).json({ message: "Item removed from cart", success: true, cart: updatedCart });
        }

        // Atomic $inc se -1
        const updatedCart = await cartModel.findOneAndUpdate(
            { user: req.user._id, "items.product": productId, "items.variant": variantId },
            { $inc: { "items.$.quantity": -1 } },
            { new: true }
        );

        return res.status(200).json({ message: "Quantity decremented", success: true, cart: updatedCart });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error", success: false });
    }
};