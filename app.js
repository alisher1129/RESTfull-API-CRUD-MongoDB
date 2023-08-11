const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser")
const app = express();

// MongoDB connection
mongoose.connect("mongodb://localhost:27017/restdata", { useNewUrlParser: true, useUnifiedTopology: true }).then(() => {
    console.log("DataBase is Connected")
}).catch((err) => {
    console.log(err)
})
// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());

// Define a schema for your data
const productSchema = new mongoose.Schema({
    name: String,
    description: String,
    price: Number,
})
// Create a model based on the schema
const product = new mongoose.model("product", productSchema);

//Create a new Product
app.post("/create", async (req, res) => {
    const Createproduct = await product.create(req.body);
    res.status(200).json({
        success: true,
        product: Createproduct,
    })
})

//Read Product 
app.get("/product", async (req, res) => {

    const products = await product.find();
    res.status(200).json({
        success: true,
        products
    })
})

//Upadte Product
app.put("/product/:id", async (req, res) => {

    let upproduct = await product.findById(req.params.id);

    upproduct = await product.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        useFindAndModify: false,
        runValidators: true
    })

    res.status(200).json({
        success: true,
        upproduct
    })

})
//Delete Product
app.delete("/product/:id", async (req, res) => {
    const products = await product.findByIdAndRemove(req.params.id);

    if (!products) {
        return res.status(500).json({
            success: false,
            message: "product not found"
        })
    }

    // await product.remove();

    res.status(200).json({
        success: true,
        message: "product is deleted successfully"
    })
})

app.listen(4500, () => {
    console.log("Server is working on Port 4500")
})