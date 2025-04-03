import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Form, Button, Row, Col, Image } from 'react-bootstrap';
import { toast } from 'react-toastify';
import Loader from '../../components/Loader';
import Message from '../../components/Message';
import FormContainer from '../../components/FormContainer';
import { useGetProductQuery, useUpdateProductMutation, useCreateProductMutation } from '../../slices/productsApiSlice';

const ProductEditScreen = () => {
  const { id: productId } = useParams();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [price, setPrice] = useState(0);
  const [images, setImages] = useState([]);
  const [brand, setBrand] = useState('');
  const [category, setCategory] = useState('');
  const [countInStock, setCountInStock] = useState(0);
  const [description, setDescription] = useState('');
  const [features, setFeatures] = useState([]);
  const [specifications, setSpecifications] = useState({});
  const [imageUrls, setImageUrls] = useState([]);
  const [previewImages, setPreviewImages] = useState([]);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const { data: product, isLoading, error } = useGetProductQuery(productId);
  const [updateProduct, { isLoading: isUpdating }] = useUpdateProductMutation();
  const [createProduct, { isLoading: isCreating }] = useCreateProductMutation();

  useEffect(() => {
    if (product) {
      setName(product.name);
      setPrice(product.price);
      setImages(product.images || []);
      setBrand(product.brand);
      setCategory(product.category);
      setCountInStock(product.countInStock);
      setDescription(product.description);
      setFeatures(product.features || []);
      setSpecifications(product.specifications || {});
      setImageUrls(product.images || []);
      setPreviewImages(product.images || []);
    }
  }, [product]);

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + imageUrls.length > 6) {
      toast.error('Maximum 6 images allowed');
      return;
    }

    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImages(prev => [...prev, reader.result]);
        setImageUrls(prev => [...prev, reader.result]); // In production, you'd upload to cloud storage
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index) => {
    setPreviewImages(prev => prev.filter((_, i) => i !== index));
    setImageUrls(prev => prev.filter((_, i) => i !== index));
    if (selectedImageIndex >= index && selectedImageIndex > 0) {
      setSelectedImageIndex(prev => prev - 1);
    }
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    if (imageUrls.length === 0) {
      toast.error('At least one image is required');
      return;
    }

    try {
      const productData = {
        name,
        price: Number(price),
        images: imageUrls,
        brand,
        category,
        countInStock: Number(countInStock),
        description,
        features,
        specifications,
      };

      if (productId) {
        await updateProduct({ id: productId, updatedProduct: productData }).unwrap();
        toast.success('Product updated successfully');
      } else {
        await createProduct(productData).unwrap();
        toast.success('Product created successfully');
      }
      navigate('/admin/products');
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  return (
    <>
      <Link to='/admin/products' className='btn btn-light my-3'>
        Go Back
      </Link>
      <FormContainer>
        <h1>{productId ? 'Edit Product' : 'Create Product'}</h1>
        {isLoading ? (
          <Loader />
        ) : error ? (
          <Message variant='danger'>{error.data.message}</Message>
        ) : (
          <Form onSubmit={submitHandler}>
            <Row>
              <Col md={6}>
                <Form.Group controlId='name' className='my-2'>
                  <Form.Label>Name</Form.Label>
                  <Form.Control
                    type='text'
                    placeholder='Enter name'
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </Form.Group>

                <Form.Group controlId='price' className='my-2'>
                  <Form.Label>Price</Form.Label>
                  <Form.Control
                    type='number'
                    placeholder='Enter price'
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    required
                  />
                </Form.Group>

                <Form.Group controlId='brand' className='my-2'>
                  <Form.Label>Brand</Form.Label>
                  <Form.Control
                    type='text'
                    placeholder='Enter brand'
                    value={brand}
                    onChange={(e) => setBrand(e.target.value)}
                    required
                  />
                </Form.Group>

                <Form.Group controlId='category' className='my-2'>
                  <Form.Label>Category</Form.Label>
                  <Form.Control
                    type='text'
                    placeholder='Enter category'
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    required
                  />
                </Form.Group>

                <Form.Group controlId='countInStock' className='my-2'>
                  <Form.Label>Count In Stock</Form.Label>
                  <Form.Control
                    type='number'
                    placeholder='Enter count in stock'
                    value={countInStock}
                    onChange={(e) => setCountInStock(e.target.value)}
                    required
                  />
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group controlId='images' className='my-2'>
                  <Form.Label>Images (Max 6)</Form.Label>
                  <Form.Control
                    type='file'
                    onChange={handleImageUpload}
                    multiple
                    accept='image/*'
                    disabled={previewImages.length >= 6}
                  />
                </Form.Group>

                {previewImages.length > 0 && (
                  <div className='my-3'>
                    <Row>
                      <Col md={3}>
                        <div className='image-thumbnails' style={{ maxHeight: '400px', overflowY: 'auto' }}>
                          {previewImages.map((img, index) => (
                            <div
                              key={index}
                              className={`thumbnail-container mb-2 ${index === selectedImageIndex ? 'selected' : ''}`}
                              style={{ position: 'relative' }}
                            >
                              <Image
                                src={img}
                                alt={`Preview ${index + 1}`}
                                style={{ width: '100%', cursor: 'pointer' }}
                                onClick={() => setSelectedImageIndex(index)}
                                thumbnail
                              />
                              <Button
                                variant='danger'
                                size='sm'
                                style={{
                                  position: 'absolute',
                                  top: '5px',
                                  right: '5px',
                                  padding: '2px 6px',
                                }}
                                onClick={() => removeImage(index)}
                              >
                                ×
                              </Button>
                            </div>
                          ))}
                        </div>
                      </Col>
                      <Col md={9}>
                        <div className='main-image-container' style={{ maxHeight: '400px' }}>
                          <Image
                            src={previewImages[selectedImageIndex]}
                            alt='Main preview'
                            style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                          />
                        </div>
                      </Col>
                    </Row>
                  </div>
                )}
              </Col>
            </Row>

            <Form.Group controlId='description' className='my-2'>
              <Form.Label>Description</Form.Label>
              <Form.Control
                as='textarea'
                rows={3}
                placeholder='Enter description'
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </Form.Group>

            <Button
              type='submit'
              variant='primary'
              className='my-2'
              disabled={isUpdating || isCreating}
            >
              {isUpdating || isCreating ? 'Saving...' : 'Save Product'}
            </Button>
          </Form>


        )}
      </FormContainer>
    </>
  );
};

export default ProductEditScreen;