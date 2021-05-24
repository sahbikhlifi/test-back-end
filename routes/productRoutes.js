const express = require("express")
const router = express.Router()

// Load controllers
const { addProduct, allProducts, productDetails, updateProduct, deleteProduct } = require('../controllers/productControllers')

// Routes 
router.post('/add', addProduct)
router.get('/', allProducts)
router.get('/:id', productDetails)
router.put('/update/:id', updateProduct)
router.delete('/delete/:id', deleteProduct);

module.exports = router
