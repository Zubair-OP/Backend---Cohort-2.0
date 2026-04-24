import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    price: {
        amount: {
            type: Number,
            required: true,
        },
        currency: {
            type: String,
            default: 'PKR',
        },
    },
    images: [
        {
            url: {
                type: String,
                required: true
            },
            fileId: {
                type: String,
            }
        }
    ],
    sellerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
}, { timestamps: true });

const ProductModel = mongoose.model('Product', productSchema);

export default ProductModel;
