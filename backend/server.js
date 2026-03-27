
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const multer = require('multer');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// ===== MongoDB =====
mongoose.connect('mongodb://127.0.0.1:27017/woodvibe')
.then(() => console.log('MongoDB Connected'));

// ===== Category Schema =====
const CategorySchema = new mongoose.Schema({
  categoryId: String,
  categoryName: String,
  photo: String
});
const Category = mongoose.model('Category', CategorySchema);

// ===== Product Schema =====
const Product = mongoose.model('Product', {
  category: String,
  pname: String,
  pdesc: String,
  price: Number,
  qty: Number,
  date: String,
  photo: String,
  photos: [String]
});
// ===== User Schema =====
const UserSchema = new mongoose.Schema({
  fname: String,
  lname: String,
  email: { type: String, unique: true },
  contact: String,
  password: String,
  status: { type: String, default: "active" },
  createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', UserSchema);

// ===== Wishlist Schema =====
const WishlistSchema = new mongoose.Schema({
  uid: String,
  pid: String,
  pname: String,
  price: Number,
  photo: String,
  createdAt: { type: Date, default: Date.now }
});

const Wishlist = mongoose.model("Wishlist", WishlistSchema);

// ===== CART SCHEMA =====

const CartSchema = new mongoose.Schema({

uid:String,
pid:String,
pname:String,
price:Number,
photo:String,
qty:{type:Number, default:1},
createdAt:{type:Date, default:Date.now}

});

const Cart = mongoose.model("Cart",CartSchema);

// ===== ORDER SCHEMA =====

const OrderSchema = new mongoose.Schema({

uid:String,
pid:String,
pname:String,
price:Number,
photo:String,
qty:Number,
email:String,
address:String,
city:String,
pincode:String,
mobile:String,

status:{type:String, default:"Pending"},

createdAt:{type:Date, default:Date.now}

});

const Orders = mongoose.model("Orders",OrderSchema);

// ===== FETCH ALL USER  =====

app.get("/api/users", async(req,res)=>{

const users = await User.find();

res.json(users);

});



app.put("/users/:id/status", async (req, res) => {
  const id = req.params.id;
  const status = req.body.status;
  await User.findByIdAndUpdate(id, { status });
  res.json({ message: "Status updated" });
});

// UPDATE USER PROFILE
app.put('/api/users/:id', async (req, res) => {
  try {
    const { fname, lname, contact } = req.body;
    await User.findByIdAndUpdate(req.params.id, { fname, lname, contact });
    res.json({ message: "Profile updated successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// CHANGE PASSWORD
app.post('/api/change-password', async (req, res) => {
  try {
    const { userId, oldPassword, newPassword } = req.body;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    if (user.password !== oldPassword) {
      return res.status(400).json({ message: 'Old password is incorrect' });
    }
    user.password = newPassword;
    await user.save();
    res.json({ message: 'Password changed successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
// const User = mongoose.model('User', UserSchema);

// ===== Multer =====
const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage });

// ========== APIs ==========

// ========== APIs ==========

// ➕ Add Category
app.post('/api/category', upload.single('photo'), async (req, res) => {
  await Category.create({
    categoryId: req.body.categoryId,
    categoryName: req.body.categoryName,
    photo: req.file ? req.file.filename : ''
  });
  res.json({ message: 'Category Added' });
});

// 📋 View Categories (USED BY DROPDOWN)
app.get('/api/category', async (req, res) => {
  const data = await Category.find();
  res.json(data);
});

// DELETE category
app.delete('/api/category/:id', async (req, res) => {
  await Category.findByIdAndDelete(req.params.id);
  res.json({ message: 'Deleted' });
});



// UPDATE category (with optional image)
app.put('/api/category/:id', upload.single('photo'), async (req, res) => {
  try {

    const updateData = {
      categoryId: req.body.categoryId,
      categoryName: req.body.categoryName
    };

    // If new image uploaded
    if (req.file) {
      updateData.photo = req.file.filename;
    }

    await Category.findByIdAndUpdate(req.params.id, updateData);

    res.json({ message: 'Category Updated Successfully' });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ➕ Add Product
app.post('/api/product', upload.array('photos', 5), async (req, res) => {
  let mainPhoto = '';
  let photos = [];
  
  if (req.files && req.files.length > 0) {
    photos = req.files.map(file => file.filename);
    mainPhoto = req.files[0].filename; 
  }

  await Product.create({
    category: req.body.category,
    pname: req.body.pname,
    pdesc: req.body.pdesc,
    price: req.body.price,
    qty: req.body.qty,
    date: req.body.date,
    photo: mainPhoto,
    photos: photos
  });
  res.json({ message: 'Product Added' });
});

// 📋 View Products (optional)
app.get('/api/product', async (req, res) => {
  res.json(await Product.find());
});

app.get("/products/category/:category", async (req, res) => {

  const category = req.params.category;

  const products = await Product.find({
    category: { $regex: new RegExp("^" + category + "$", "i") }
  });

  res.json(products);

});

// 🗑 DELETE Product
app.delete('/api/product/:id', async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: 'Product Deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✏ UPDATE Product (with optional image)
app.put('/api/product/:id', upload.array('photos', 5), async (req, res) => {
  try {

    const updateData = {
      category: req.body.category,
      pname: req.body.pname,
      pdesc: req.body.pdesc,
      price: req.body.price,
      qty: req.body.qty,
      date: req.body.date
    };

    // If new images uploaded, append them to existing photos
    if (req.files && req.files.length > 0) {
      const existingProduct = await Product.findById(req.params.id);
      
      let existingPhotos = existingProduct.photos || [];
      if (existingPhotos.length === 0 && existingProduct.photo) {
        existingPhotos = [existingProduct.photo];
      }

      const newPhotos = req.files.map(file => file.filename);
      updateData.photos = [...existingPhotos, ...newPhotos];
      updateData.photo = updateData.photos[0]; // Ensure primary photo exists
    }

    await Product.findByIdAndUpdate(req.params.id, updateData);

    res.json({ message: 'Product Updated Successfully' });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/products/:id", async (req, res) => {

  const product = await Product.findById(req.params.id);

  res.json(product);

});


// ===== REGISTER USER =====
app.post('/api/register', async (req, res) => {
  try {

    const { fname, lname, email, contact, password } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    const newUser = new User({
      fname,
      lname,
      email,
      contact,
      password
    });

    await newUser.save();

    res.status(201).json({ message: 'User registered successfully' });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ===== LOGIN USER =====
app.post('/api/login', async (req, res) => {
  try {

    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }

if(password !== user.password){
  return res.status(400).json({ message: 'Invalid password' });
}
    

    res.json({
      message: 'Login successful',
      user: {
        id: user._id,
        fname: user.fname,
        lname: user.lname,
        email: user.email
      }
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ADD TO WISHLIST
app.post("/api/wishlist", async (req,res)=>{

const {uid,pid,pname,price,photo} = req.body;

const existing = await Wishlist.findOne({uid,pid});

if(existing){
return res.json({message:"Already in wishlist"});
}

const wish = new Wishlist({
uid,
pid,
pname,
price,
photo
});

await wish.save();

res.json({message:"Added to wishlist"});

});

// REMOVE FROM WISHLIST
app.delete("/api/wishlist/:id", async(req,res)=>{

await Wishlist.findByIdAndDelete(req.params.id);

res.json({message:"Removed from wishlist"});

});

// GET USER WISHLIST
app.get("/api/wishlist/:uid", async (req,res)=>{

const uid = req.params.uid;

const wishlist = await Wishlist.find({uid}).sort({createdAt:-1});

res.json(wishlist);

});

// GET WISHLIST COUNT (NAVBAR)
app.get("/api/wishlist-count/:uid", async (req,res)=>{

const uid = req.params.uid;

const count = await Wishlist.countDocuments({uid});

res.json({count});

});

// ADD TO CART
app.post("/api/cart", async(req,res)=>{

const {uid,pid,pname,price,photo} = req.body;

const existing = await Cart.findOne({uid,pid});

if(existing){

return res.json({
status:"exists",
message:"Item already in cart"
});

}

// CREATE CART ITEM
const cart = new Cart({
uid,
pid,
pname,
price,
photo,
qty:1
});

await cart.save();

res.json({
status:"added",
message:"Item added to cart"
});

});

// GET USER CART

app.get("/api/cart/:uid", async(req,res)=>{

const uid = req.params.uid;

const cart = await Cart.find({uid}).sort({createdAt:-1});

res.json(cart);

});

// REMOVE FROM THE CART

app.delete("/api/cart/:id", async(req,res)=>{

await Cart.findByIdAndDelete(req.params.id);

res.json({message:"Item removed"});

});

// UPDATE QUANTITY

app.put("/api/cart/:id", async(req,res)=>{

const {qty} = req.body;

await Cart.findByIdAndUpdate(req.params.id,{qty});

res.json({message:"Quantity updated"});

});

// GET CART COUNT (NAVBAR)



// GET CART COUNT
app.get("/api/cart/count/:uid", async (req,res)=>{

const uid = req.params.uid;

const cart = await Cart.find({uid});

let count = 0;

cart.forEach(item=>{
count += item.qty;
});

res.json({count});

});

// INCREASE CART QTY
app.put("/api/cart/increase/:pid/:uid", async(req,res)=>{

const {pid,uid} = req.params;

await Cart.findOneAndUpdate(
{pid,uid},
{$inc:{qty:1}}
);

res.json({message:"Quantity increased"});

});

// PLACE ORDER

app.post("/api/place-order", async(req,res)=>{

const {uid,address,city,pincode,mobile} = req.body;

// GET CART ITEMS
const cartItems = await Cart.find({uid});

if(cartItems.length === 0){
return res.json({message:"Cart is empty"});
}

// INSERT ORDERS
for(const item of cartItems){

const order = new Orders({

uid:item.uid,
pid:item.pid,
pname:item.pname,
price:item.price,
photo:item.photo,
qty:item.qty,

address,
city,
pincode,
mobile

});

await order.save();

}

// CLEAR CART
await Cart.deleteMany({uid});

res.json({message:"Order placed successfully"});

});

// GET ALL ORDERS (ADMIN)

app.get("/api/admin/orders", async (req, res) => {

  const orders = await Orders.aggregate([

    {
      $addFields: {
        uid: { $toObjectId: "$uid" }
      }
    },

    {
      $lookup: {
        from: "users",
        localField: "uid",
        foreignField: "_id",
        as: "user"
      }
    },

    {
      $unwind: {
        path: "$user",
        preserveNullAndEmptyArrays: true
      }
    },

    {
      $project: {
        pname: 1,
        price: 1,
        qty: 1,
        photo: 1,
        address: 1,
        city: 1,
        pincode: 1,
        mobile: 1,
        createdAt: 1,

        fname: "$user.fname",
        lname: "$user.lname",
        email: "$user.email",
        contact: "$user.contact"
      }
    },

    { $sort: { createdAt: -1 } }

  ]);

  res.json(orders);

});

// ADMIN SIDE ORDERS VIEW DETAILS PART 
app.get("/api/admin/order/:id", async (req, res) => {

  const id = req.params.id;

  const orderById = await Orders.aggregate([

    {
      $match: { _id: new mongoose.Types.ObjectId(id) }
    },

    {
      $addFields: {
        uid: { $toObjectId: "$uid" }
      }
    },

    {
      $lookup: {
        from: "users",
        localField: "uid",
        foreignField: "_id",
        as: "user"
      }
    },

    { $unwind: "$user" }

  ]);

  res.json(orderById[0]);

});

// UPDATE ORDER STATUS (ADMIN)
app.put("/api/admin/order/:id/status", async (req, res) => {
  try {
    const { status } = req.body;
    await Orders.findByIdAndUpdate(req.params.id, { status });
    res.json({ message: "Order status updated successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET USER ORDERS
app.get('/api/userorders/:uid', async (req, res) => {
  try {
    const orders = await Orders.find({ uid: req.params.uid }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET SINGLE ORDER
app.get('/api/order/:id', async (req, res) => {
  try {
    const order = await Orders.findById(req.params.id);
    res.json(order);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ===== Server =====
app.listen(3000, () => console.log('Server started on port 3000'));