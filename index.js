const express = require("express");
const { connection } = require("./config/db");
const { ProductModel } = require("./models/Product.model");
const cors = require('cors')
const app = express();

app.use(express.json());

// const corsOptions = {
//   origin: ["http://localhost:4000"],
// };

// app.use(cors(corsOptions));
app.use(cors())
app.get("/products", async (req, res) => {
  try {

    const {category, search, page} = req.query;

    let filter ={};
    let sort = { date: -1 };
    let item_perPage = 4;


    if(category){
      filter.category = new RegExp(category, "i");
    }
    if(search){
      filter.name ={ $regex: search, $options: "i" };
    }

    const skip = (page - 1) * item_perPage;

    const product = await ProductModel.find(filter).sort(sort).skip(skip).limit(item_perPage);
    const totalProduct = await ProductModel.find()

    res.send({ message: "data", product, "totalProduct": totalProduct.length });
  } catch (error) {
    console.log("Failed to get db", error);
  }
});

app.post("/product/create", async (req, res) => {
  const product = req.body;

  try {
    const new_product = new ProductModel(product);

    await new_product.save();
    res.status(201).json({ message: "New product created successfully" });
  } catch (error) {
    console.log("Failed to post new product", error);
    res.status(500).json({ error: "Failed to create a new product" });
  }
});

app.delete("/product/delete/:id", async (req, res) => {
  const { id } = req.params;

  try {
    if (!id) {
      return res.status(400).send({ message: "Invalid request. Missing ID." });
    }

    const deletedItem = await ProductModel.findByIdAndDelete(id);

    if (!deletedItem) {
      return res.status(404).send({ message: "Product not found." });
    }

    res.status(200).send({ message: "Deleted item", deletedItem });
  } catch (error) {
    res.status(500).send({ message: "Failed to delete item.", error: error.message });
    console.error("Failed to delete item", error);
  }
});

app.use("*", (req, res) => {
  res.status(404).send({ error: "Not Found" });
});


 
app.listen(4000, async () => {
  try {
    await connection;
    console.log("Successfully connected to db server");
  } catch (error) {
    console.log("Failed connect to db server");
    console.log(error);
  }

  console.log("Server started at port 4000");
});
