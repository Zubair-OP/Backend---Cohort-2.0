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
    variants: [
        {
            images: [
                {
                    url: {
                        type: String,
                        required: true
                    }
                }
            ],
            stock: {
                type: Number,
                default: 0
            },
            attributes: {
                type: Map,
                of: String
            },
            price: {
                type: priceSchema,
            }
        },
    ]
}, { timestamps: true });

const ProductModel = mongoose.model('Product', productSchema);

export default ProductModel;
