const express = require('express');
const router = express.Router();

const accessories = [
  { id: 1, name: "Wireless Earbuds", price: 2999, image: "/images/earbuds.jpg", description: "High quality wireless earbuds." },
  { id: 2, name: "Phone Case", price: 499, image: "/images/case.jpg", description: "Protective phone case." },
  { id: 3, name: "Screen Protector", price: 299, image: "/images/screen.jpg", description: "Tempered glass screen protector." }
];

router.get('/', (req, res) => {
  res.json(accessories);
});

module.exports = router;