const mongoose = require('mongoose');
const brandSchema = new mongoose.Schema({
    brandName:{
        type:String,
        required: true,
        minlength: [3, 'Brand Name cannot be smaller than 3 characters'],
        maxlength: [100, 'Brand Name cannot be longer than 100 characters'],
    },

    brandSlug:{
        type: String,
        required: true,
        unique:true,
    },
    brandImage:{
        type:String,
        required: true,
    },

     isDeleted:{
            type: Boolean,
            default:false,
        },
        deletedAt: {
            type: Date,
            default: null
      },
      deletedBy:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default:null
      } 

}, { timestamps: true });

const Brand = mongoose.model('Brand', brandSchema);
module.exports= Brand;
