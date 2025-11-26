const mongoose = require('mongoose')

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  date: Date,
  customer: String,
  orderDescription: String,
  designService: Boolean,
  format: String,
  singleSidedPrint: Boolean,
  doubleSidedPrint: Boolean,
  paper: String,
  lamination: String,
  binding: String,
  uv3DCoating: Boolean,
  otherPostPrintingWorks: String,
  quantity: Number,
  additionalOrderInformation: String,
  deliveryCost: Number,
  shippingDate: Date,
  orderPrice: Number,
  invoiceNumber: String,
  invoiceStatus: String,
  additionalNotes: String,
  customerContactDetails: String
})

orderSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

const Order = mongoose.model('Order', orderSchema)

module.exports = Order