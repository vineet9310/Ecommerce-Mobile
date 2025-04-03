import asyncHandler from 'express-async-handler';
import Product from '../models/productModel.js';

// @desc    Fetch all products
// @route   GET /api/products
// @access  Public
const getProducts = asyncHandler(async (req, res) => {
    const pageSize = 8;
    const page = Number(req.query.page) || 1;
    const keyword = req.query.keyword
        ? {
              name: {
                  $regex: req.query.keyword,
                  $options: 'i',
              },
          }
        : {};

    const count = await Product.countDocuments({ ...keyword });
    const products = await Product.find({ ...keyword })
        .limit(pageSize)
        .skip(pageSize * (page - 1));

    res.json({ products, page, pages: Math.ceil(count / pageSize) });
});
// Update product rating & numReviews
export const updateProductRating = async (req, res) => {
  const { rating, numReviews } = req.body;
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    if (rating) product.rating = rating;
    if (numReviews) product.numReviews = numReviews;

    const updatedProduct = await product.save();
    res.json(updatedProduct);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Fetch single product
// @route   GET /api/products/:id
// @access  Public
const getProductById = asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id);

    if (product) {
        res.json(product);
    } else {
        res.status(404);
        throw new Error('Product not found');
    }
});

// @desc    Create a new product
// @route   POST /api/products
// @access  Private/Admin
const createProduct = async (req, res) => {
    try {
      const { name, price, countInStock, description, brand, category, features, specifications, images } = req.body;
  
      if (!name || !price || !countInStock || !description || !brand || !category || !Array.isArray(images) || images.length === 0) {
        return res.status(400).json({ message: "All required fields must be provided and at least one image URL is required." });
      }

      // Validate image URLs
      if (!images.every(url => typeof url === 'string' && url.trim().length > 0)) {
        return res.status(400).json({ message: "All image URLs must be valid strings." });
      }
  
      const product = new Product({
        user: req.user._id,
        name,
        price,
        countInStock,
        description,
        brand,
        category,
        features,
        specifications,
        images,
      });
  
      const createdProduct = await product.save();
      res.status(201).json(createdProduct);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  };  
  // ✅ Bulk Insert Products
export const bulkInsertProducts = asyncHandler(async (req, res) => {
    const products = req.body; // Postman se JSON array milega

    if (!Array.isArray(products) || products.length === 0) {
        res.status(400);
        throw new Error('Invalid data. Provide an array of products.');
    }

    const createdProducts = await Product.insertMany(products);
    
    res.status(201).json({
        message: `${createdProducts.length} products inserted successfully`,
        data: createdProducts,
    });
});

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = asyncHandler(async (req, res) => {
    try {
        const {
            name,
            price,
            description,
            images,
            brand,
            category,
            countInStock,
            features,
            specifications,
        } = req.body;

        const product = await Product.findById(req.params.id);

        if (!product) {
            res.status(404);
            throw new Error('Product not found');
        }

        // Validate required fields
        const validationErrors = [];
        if (!name) validationErrors.push('Product name is required');
        if (!price || price <= 0) validationErrors.push('Price must be greater than 0');
        if (!description) validationErrors.push('Description is required');
        if (!brand) validationErrors.push('Brand is required');
        if (!category) validationErrors.push('Category is required');
        if (typeof countInStock !== 'number' || countInStock < 0) {
            validationErrors.push('Stock count must be a non-negative number');
        }

        // Validate images array
        if (!Array.isArray(images) || images.length === 0) {
            validationErrors.push('At least one product image URL is required');
        } else if (!images.every(url => typeof url === 'string' && url.trim().length > 0)) {
            validationErrors.push('All image URLs must be valid strings');
        }

        if (validationErrors.length > 0) {
            res.status(400);
            throw new Error(validationErrors.join(', '));
        }

        // Update product fields
        product.name = name;
        product.price = price;
        product.description = description;
        product.images = images.map(url => url.trim());
        product.brand = brand;
        product.category = category;
        product.countInStock = countInStock;
        
        // Handle optional arrays and objects
        if (Array.isArray(features)) {
            product.features = features;
        }
        
        if (specifications && typeof specifications === 'object') {
            product.specifications = specifications;
        }

        const updatedProduct = await product.save();
        res.json(updatedProduct);
    } catch (error) {
        if (error.name === 'ValidationError') {
            res.status(400);
            throw new Error('Invalid product data: ' + error.message);
        }
        throw error;
    }
});

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = asyncHandler(async (req, res) => {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (product) {
        res.json({ message: 'Product removed' });
    } else {
        res.status(404);
        throw new Error('Product not found');
    }
});

// @desc    Create new review
// @route   POST /api/products/:id/reviews
// @access  Private
const createProductReview = asyncHandler(async (req, res) => {
    const { rating, comment } = req.body;

    const product = await Product.findById(req.params.id);

    if (product) {
        const alreadyReviewed = product.reviews.find(
            (r) => r.user.toString() === req.user._id.toString()
        );

        if (alreadyReviewed) {
            res.status(400);
            throw new Error('Product already reviewed');
        }

        const review = {
            name: req.user.name,
            rating: Number(rating),
            comment,
            user: req.user._id,
        };

        product.reviews.push(review);
        product.numReviews = product.reviews.length;
        product.rating =
            product.reviews.reduce((acc, item) => item.rating + acc, 0) /
            product.reviews.length;

        await product.save();
        res.status(201).json({ message: 'Review added' });
    } else {
        res.status(404);
        throw new Error('Product not found');
    }
});

export {
    getProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
    createProductReview,
};
    