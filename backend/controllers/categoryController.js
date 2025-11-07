const Category = require('../models/Category');
exports.list = async (req, res) => {
  try {
    const cats = await Category.find().sort('name');
    res.json(cats);
  } catch (err) { res.status(500).json({ message: 'Server error' }); }
};

exports.create = async (req, res) => {
  const { name } = req.body;
  try {
    const exists = await Category.findOne({ name });
    if (exists) return res.status(400).json({ message: 'Category already exists' });
    const c = new Category({ name });
    await c.save();
    res.json(c);
  } catch (err) { res.status(500).json({ message: 'Server error' }); }
};
