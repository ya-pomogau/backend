import mongoose from 'mongoose';

export const rawUserProfile = {
  address: { required: true, type: mongoose.SchemaTypes.String },

  avatar: { default: '', type: mongoose.SchemaTypes.String },

  name: { required: true, type: mongoose.SchemaTypes.String },

  phone: { required: true, type: mongoose.SchemaTypes.String },

  _id: { required: true, type: mongoose.SchemaTypes.String },
};
