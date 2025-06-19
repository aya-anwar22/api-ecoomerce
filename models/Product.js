
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    productName: {
        type: String,
        required: true,
        minlength: [3, 'product Name cannot be smaller than 3 characters'],
        maxlength: [100, 'product Name cannot be longer than 100 characters'],
    },
    productSlug:{
        type: String,
        required: true,
        unique:true,
    },
    description:String,
    brandId:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref:'Brand'
    },
    subcategoryId:{
        type: mongoose.Schema.Types.ObjectId,
        required:true,
        ref:'Subcategory',
    },
    price:{
        type:Number,
        required:true,
    },
    quantity:{
        type:Number,
        required:true,
    },
    gender:{
        type:String,
        enum:[ 'male' , 'female'],
        required:true
    },
    productImages: [{type: String}],

    stockAlertThreshold: {type:Number, default:0}, 
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
const Product = mongoose.model('Product', productSchema);
module.exports = Product