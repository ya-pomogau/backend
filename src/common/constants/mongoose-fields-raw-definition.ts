import mongoose from 'mongoose';

export const rawUserProfile = {
  address: { required: true, type: mongoose.SchemaTypes.String },

  avatar: { default: '', type: mongoose.SchemaTypes.String },

  firstName: { required: true, type: mongoose.SchemaTypes.String },

  lastName: { required: true, type: mongoose.SchemaTypes.String },

  middleName: { default: '', type: mongoose.SchemaTypes.String },

  phone: { required: true, type: mongoose.SchemaTypes.String },

  _id: { required: true, type: mongoose.SchemaTypes.String },
};
