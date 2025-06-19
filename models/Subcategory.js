
const mongoose = require('mongoose');
const subcategorySchema = new mongoose.Schema({
    subcategoryName:{
        type:String,
        required:true,
        minlength: [3, 'Subcategory Name cannot be smaller than 3 characters'],
        maxlength: [100, 'Subcategory Name cannot be longer than 100 characters'],
    },

    subcategorySlug:{
        type: String,
        unique:true,
    },
    subcategoryImage:{
        type:String,
        required: true,
    },
    categoryId:{
            type: mongoose.Schema.Types.ObjectId,
            required:true,
            ref:'Category',
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

const Subcategory = mongoose.model('Subcategory', subcategorySchema);
module.exports = Subcategory