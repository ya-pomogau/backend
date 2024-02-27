import mongoose from 'mongoose';

export const rawUserProfile = {
  address: { required: true, type: mongoose.SchemaTypes.String },

  avatar: { default: '', type: mongoose.SchemaTypes.String },

  name: { required: true, type: mongoose.SchemaTypes.String },

  phone: { required: true, type: mongoose.SchemaTypes.String },

  _id: { required: true, type: mongoose.SchemaTypes.String },
};

export const rawCategory = {
  accessLevel: { required: true, type: mongoose.SchemaTypes.Number },
  points: { required: true, type: mongoose.SchemaTypes.Number },
  title: { required: true, type: mongoose.SchemaTypes.String },
};
