const mongoose = require('mongoose');

const categorySchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  icon: {
    type: String,
  },
  color: {
    type: String,
  },
});
userSchema.virtual('id').get(function () {
  return this._id.toHexString();
});

userSchema.set('toJSON', {
  virtuals: true,
});

exports.Category = mongoose.model('Category', categorySchema);
