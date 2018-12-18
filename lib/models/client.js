// Load required packages
var mongoose = require('mongoose');
 Schema = mongoose.Schema;
// Define our client schema

var ClientSchema = new Schema({
  name: { type: String, unique: true, required: true },
  id: { type: String,unique: true, required: true },
  secret: { type: String, unique: true,required: true },
  userId: { type: String, unique: true,required: true },
  practicename: { type: String, required: true },
  status: { type: Boolean, default:1 }
});
mongoose.model('Client', ClientSchema);