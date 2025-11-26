const ordersRouter = require('express').Router()
const Order = require('../models/order')
const User = require('../models/user')
const jwt = require('jsonwebtoken')
const logger = require('../utils/logger')
const middleware = require('../utils/middleware')

ordersRouter.get('/', middleware.userExtractor, async (request, response) => {
  const user = request.user
  const filter = user.role === 'admin' ? {} : {user: user.id}

  const orders = await Order
    .find(filter)
    .populate('user', {username: 1, name: 1})

  response.json(orders)
})

ordersRouter.get('/:id', async (request, response) => {
  const order = await Order
    .findById(request.params.id)
    .populate('user', {username: 1, name: 1})

  response.json(order)
})

ordersRouter.post('/', middleware.userExtractor, async (request, response) => {
  const {date, customer, orderDescription, designService, format, singleSidedPrint, 
    doubleSidedPrint, paper, lamination, binding, uv3DCoating, otherPostPrintingWorks, 
    quantity, additionalOrderInformation, deliveryCost, shippingDate, orderPrice, 
    invoiceNumber, invoiceStatus, additionalNotes, customerContactDetails} = request.body

  const user = request.user

  const order = new Order({
    user: user.id,
    date,
    customer,
    orderDescription,
    designService,
    format,
    singleSidedPrint,
    doubleSidedPrint,
    paper,
    lamination,
    binding,
    uv3DCoating,
    otherPostPrintingWorks,
    quantity,
    additionalOrderInformation,
    deliveryCost,
    shippingDate,
    orderPrice,
    invoiceNumber,
    invoiceStatus,
    additionalNotes,
    customerContactDetails
  })

  const savedOrder = await order.save()

  user.orders = user.orders.concat(savedOrder.id)
  await user.save()

  response.status(201).json(savedOrder)
})

// ordersRouter.put('/:id', middleware.userExtractor, async (request, response) => {
//   const {date, customer, orderDescription, designService, format, singleSidedPrint, 
//     doubleSidedPrint, paper, lamination, binding, uv3DCoating, otherPostPrintingWorks, 
//     quantity, additionalOrderInformation, deliveryCost, shippingDate, orderPrice, 
//     invoiceNumber, invoiceStatus, additionalNotes, customerContactDetails} = request.body
    
//   const user = request.user

//   const order = {
//     user: user.id,
//     date,
//     customer,
//     orderDescription,
//     designService,
//     format,
//     singleSidedPrint,
//     doubleSidedPrint,
//     paper,
//     lamination,
//     binding,
//     uv3DCoating,
//     otherPostPrintingWorks,
//     quantity,
//     additionalOrderInformation,
//     deliveryCost,
//     shippingDate,
//     orderPrice,
//     invoiceNumber,
//     invoiceStatus,
//     additionalNotes,
//     customerContactDetails
//   }

//   const updatedOrder = await Order.findByIdAndUpdate(request.params.id, order, {new: true})

//   response.json(updatedOrder)
// })

ordersRouter.patch('/:id', middleware.userExtractor, async (request, response) => {
  const user = request.user
  const orderUpdate = {...request.body}

  const order = await Order.findById(request.params.id)

  if (user.id === order.user.toString() || user.role === 'admin') {
    const updatedOrder = await Order.findByIdAndUpdate(request.params.id, orderUpdate, {new: true})
    response.json(updatedOrder)
  } else {
    response.status(401).json({error: 'user does not have permission for this action'})
  }
})

ordersRouter.delete('/:id', middleware.userExtractor, async (request, response) => {
  const user = request.user

  const order = await Order.findById(request.params.id)

  if (!order) {
    return response.status(404).json({ error: 'Order not found' });
  }

  if (user.id === order.user.toString() || user.role === 'admin') {
    await Order.findByIdAndDelete(request.params.id)
    response.status(204).end()
  } else {
    response.status(401).json({error: 'user does not have permission for this action'})
  }
})

module.exports = ordersRouter