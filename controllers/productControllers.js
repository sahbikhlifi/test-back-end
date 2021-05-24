const Product = require("../models/product");
// const passport = require("passport");

// passport.authenticate('bearer', { session: false }),

exports.addProduct = (req, res) => {
    const { name, productCode, quantity, price, brand, model, category } = req.body;

    if (!name || !productCode || !quantity || !price || !brand || !model || !category) {
        res.status(400).send({
            name: "Error",
            message: "Please enter all informations about product"
        })
    } else {
        const product = new Product({ name, productCode, quantity, price, brand, model, category })
        product.save().then(data => {
            res.status(201).send({
                success: true,
                data: data,
                message: "Product successfully created"
            })
        }).catch(err => {
            res.status(500).send({
                success: false,
                message: err.message || "Some error occurred while creating the product."
            });
        })
    }
}

exports.allProducts = (req, res) => {
    Product.find().then(data => {
        if(req.query.data){
            const filteredProduct = data.filter(d => d.brand === req.query.data)
            res.status(200).send({
                success: true,
                data: filteredProduct,
                message: ('Products successfully retrieved')
            })
        }
        res.status(200).send({
            success: true,
            data: data,
            message: ('Products successfully retrieved')
        })
    }).catch(err => {
        res.status(500).send({
            success: false,
            message: err.message || "Some error occurred while retrieving products."
        })
    })
}

exports.productDetails = (req, res) => {
    Product.findById(req.params.id).then(data => {
        if (!data) {
            return res.status(400).send({
                success: false,
                message: "Product not found with id " + req.params.id
            })
        }
        res.send({
            success: true,
            message: 'Product successfully retrieved',
            data: data
        });
    }).catch(err => {
        if (err.kind === 'ObjectId') {
            return res.status(404).send({
                success: false,
                message: "Product not found with id " + req.params.id
            });
        }
        return res.status(500).send({
            success: false,
            message: "Error retrieving product with id " + req.params.id
        });
    });
};

exports.updateProduct = (req, res) => {
    const { name, productCode, quantity, price, brand, model, category } = req.body;

    if (!name || !productCode || !quantity || !price || !brand || !model || !category) {
        res.status(400).send({
            success: false,
            message: "Please enter all informations about product"
        })
    }
    Product.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true }).then(data => {
        if (!data) {
            return res.status(400).send({
                success: false,
                message: "Product not found with id " + req.params.id
            });
        }
        res.send({
            success: true,
            data: data
        });
    }).catch(err => {
        if (err.kind === 'ObjectId') {
            return res.status(400).send({
                success: false,
                message: "Product not found with id " + req.params.id
            });
        }
        return res.status(500).send({
            success: false,
            message: "Error updating product with id " + req.params.id
        });
    })
}

exports.deleteProduct = (req,res) => {
    Product.findByIdAndDelete(req.params.id).then(data => {
        if (!data) {
            return res.status(404).send({
                success: false,
                message: "Product not found with id " + req.params.id
            });
        }
        res.status(200).send({
            success: true,
            message: "Product successfully deleted!"
        });
    }).catch(err => {
    if (err.kind === 'ObjectId' || err.name === 'NotFound') {
        return res.status(404).send({
            success: false,
            message: "Product not found with id " + req.params.id
        });
    }
    return res.status(500).send({
        success: false,
        message: "Could not delete product with id " + req.params.id
    });
    })
}