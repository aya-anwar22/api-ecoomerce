const mongoose = require('mongoose');
const bcrypt = require('bcrypt')
const validator = require('validator');

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        minlength:[3,'Name cannot be smaller than 3 characters'],
        maxlength:[50,'Name cannot be longer than 50 characters'],
    },
    email: {
       type: String,
        unique: true,
        required:true,
        lowercase: true,
        validate: [validator.isEmail, 'Please enter a valid email address']
},

    password:{
        type:String,
        required:true,
        minlength:[10, 'Too short Password']
    },
    isVerified:{
        type:Boolean,
        default:false
    },
   
    phoneNumber: {
    type: String,
    required: true,
    validate: {
        validator: function(v) {
            return /^\d{11}$/.test(v);
        },
        message: props => `${props.value} is not a valid phone number! Must be 11 digits.`
    }
},


    role:{
        type:String,
        enum: ['user', 'admin'],
        default: function(){
            return this.email ===  process.env.ADMIN_EMAIL ? 'admin' : 'user';
        }
    },
    addresses:[
    {
    label: String, 
    details: String,   
    isDefault: Boolean
    }
    ],
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
    } ,
    refreshToken: {
    type: String,
    default: null
  },
  refreshTokenExpiry:{
    type: Date,
    default:null
  },

  verficationEmail : {
    type: String,
    default: null,
    minlength: [6, 'email Verification Code cannot be smaller than 6 characters'],
    maxlength: [6, 'email Verification Code cannot be longer than 6 characters'],
  },
  verficationEmailExpire:{
    type:Date,
    default:null,

  },
  restePassword:{
    type: String,
    default: null,
    minlength: [6, 'reset Password Code cannot be smaller than 6 characters'],
    maxlength: [6, 'reset Password Code cannot be longer than 6 characters'],
  },

  restePasswordExpire:{
    type:Date,
    default:null,
  },

}, { timestamps: true });


const User = mongoose.model('User', userSchema);
module.exports = User;