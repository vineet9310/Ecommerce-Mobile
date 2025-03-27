import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    rating: { type: Number, required: true },
    comment: { type: String, required: true },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
  },
  {
    timestamps: true, // Reviews will have createdAt & updatedAt
  }
);

const productSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    name: {
      type: String,
      required: [true, "Product name is required"],
    },
    image: {
      type: String,
      required: [true, "Product image is required"],
    },
    brand: {
      type: String,
      required: [true, "Brand is required"],
    },
    category: {
      type: String,
      required: [true, "Category is required"],
    },
    description: {
      type: String,
      required: [true, "Product description is required"],
    },
    reviews: [reviewSchema],
    rating: {
      type: Number,
      default: 0, // Default rating 0
    },
    numReviews: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      required: [true, "Price is required"], // If missing, show error
    },
    countInStock: {
      type: Number,
      required: [true, "Stock count is required"], // If missing, show error
    },
    features: {
      type: [String], // Features will be an array of strings
      default: [], // If not provided, set empty array
    },
    specifications: {
      type: Object, // Store as key-value pairs
      required: [true, "Specifications are required"],
      default: {},
    },
  },
  {
    timestamps: true, // Products will have createdAt & updatedAt
  }
);

const Product = mongoose.model('Product', productSchema);

export default Product;
