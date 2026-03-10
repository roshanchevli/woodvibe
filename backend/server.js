
const bcrypt = require('bcryptjs');
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
  photo: String
});
// ===== User Schema =====
const UserSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  contact: String,
  password: String,
  createdAt: { type: Date, default: Date.now }
});

app.get("/users", async(req,res)=>{

const users = await User.find();

res.json(users);

});

app.put("/users/:id/status", async(req,res)=>{

const id = req.params.id;
const status = req.body.status;

await User.findByIdAndUpdate(id,{status});

res.json({message:"Status updated"});

});

const User = mongoose.model('User', UserSchema);

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
app.post('/api/product', upload.single('photo'), async (req, res) => {
  await Product.create({
    category: req.body.category,
    pname: req.body.pname,
    pdesc: req.body.pdesc,
    price: req.body.price,
    qty: req.body.qty,
    date: req.body.date,
    photo: req.file ? req.file.filename : ''
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
app.put('/api/product/:id', upload.single('photo'), async (req, res) => {
  try {

    const updateData = {
      category: req.body.category,
      pname: req.body.pname,
      pdesc: req.body.pdesc,
      price: req.body.price,
      qty: req.body.qty,
      date: req.body.date
    };

    // If new image uploaded
    if (req.file) {
      updateData.photo = req.file.filename;
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
    const { name, email, contact, password } = req.body;

    // Check if email exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      contact,
      password: hashedPassword
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

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid password' });
    }

    res.json({
      message: 'Login successful',
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ===== Server =====
app.listen(3000, () => console.log('Server started on port 3000'));