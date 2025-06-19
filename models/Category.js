const mongoose = require('mongoose');
const categorySchema = new mongoose.Schema({
    categoryName:{
        type:String,
        required: true,
        minlength: [3, 'Category Name cannot be smaller than 3 characters'],
        maxlength: [100 , 'Category Name cannot be longer than 100 characters'],
    },
//Boys Clothes   =>boys-clothes
    categorySlug:{
        type: String,
        required: true,
        unique:true,
    },
    categoryImage:{
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

const Category = mongoose.model('Category', categorySchema);
module.exports= Category;
