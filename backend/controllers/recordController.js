const { validationResult } = require('express-validator');
const Record = require('../models/Record');

exports.create = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  const { name, description, category, active } = req.body;
  try {
    const r = new Record({ name, description, category, active: !!active, createdBy: req.user._id });
    await r.save();
    res.json(r);
  } catch (err) { console.error(err); res.status(500).json({ message: 'Server error' }); }
};

exports.list = async (req, res) => {
  try {
    const { active, search } = req.query;
    const filter = {};
    if (active === 'true') filter.active = true;
    if (active === 'false') filter.active = false;
    if (search) filter.name = { $regex: search, $options: 'i' };
    const records = await Record.find(filter).populate('category').sort({ createdAt: -1 });
    res.json(records);
  } catch (err) { console.error(err); res.status(500).json({ message: 'Server error' }); }
};

exports.get = async (req, res) => {
  try {
    const record = await Record.findById(req.params.id).populate('category');
    if (!record) return res.status(404).json({ message: 'Record not found' });
    res.json(record);
  } catch (err) { console.error(err); res.status(500).json({ message: 'Server error' }); }
};

exports.update = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  try {
    const { name, description, category, active } = req.body;
    const record = await Record.findById(req.params.id);
    if (!record) return res.status(404).json({ message: 'Record not found' });
    record.name = name;
    record.description = description;
    record.category = category;
    record.active = !!active;
    await record.save();
    res.json(record);
  } catch (err) { console.error(err); res.status(500).json({ message: 'Server error' }); }
};

exports.remove = async (req, res) => {
  try {
    const record = await Record.findById(req.params.id);
    if (!record) return res.status(404).json({ message: 'Record not found' });
    await record.remove();
    res.json({ message: 'Record removed' });
  } catch (err) { console.error(err); res.status(500).json({ message: 'Server error' }); }
};

exports.bulkDelete = async (req, res) => {
  try {
    const { ids } = req.body;
    if (!Array.isArray(ids) || !ids.length) return res.status(400).json({ message: 'ids required' });
    await Record.deleteMany({ _id: { $in: ids } });
    res.json({ message: 'Deleted' });
  } catch (err) { console.error(err); res.status(500).json({ message: 'Server error' }); }
};

