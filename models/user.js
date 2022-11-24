const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    passwordHash: {
        type: String,
        required: true,
    },
    date:{
        type:String,
        required:true,
    },
    phone:{ 
        type: Number, 
        required: true 
    },
    isAdmin: {
        type: Boolean,
        required:false,
        default: false,
    },
    avatarId:{
        type:String,
        required:'false'
    }
});

/* userSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

userSchema.set('toJSON', {
    virtuals: true,
}); */

exports.User = mongoose.model('User', userSchema);
exports.userSchema = userSchema;
