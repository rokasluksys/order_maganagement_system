import './Orders.css'
import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import orderService from '../../services/orders'

const Orders = ({ user, setUser }) => {
  const navigate = useNavigate()
  const [orders, setOrders] = useState([])
  const [shownOrders, setShownOrders] = useState([])
  const [searchOption, setSearchOption] = useState('')
  const [searchString, setSearchString] = useState('')

  useEffect(() => {
    if (!user) {
      toast.info('Please log in')
      navigate('/login')
      return
    }

    const fetchOrders = async () => {
      try {
        orderService.setToken(user.token)
        const fetchedOrders = await orderService.getAll()
        setOrders(fetchedOrders)
      } catch (error) {
        console.error('Error fetching orders:', error)
        toast.error('Failed to fetch orders')
      }
    }

    fetchOrders()
  }, [user])

  useEffect(() => {
    if (searchOption && searchString) {
      setShownOrders(
        orders.filter(order => {
          const value = searchOption.split('.').reduce((obj, key) => obj?.[key], order)
  
          const displayValue = typeof value === 'boolean' ? (value ? 'Yes' : 'No') : value
  
          return displayValue?.toString().toLowerCase().includes(searchString.toLowerCase())
        })
      )
    } else {
      setShownOrders(orders)
    }
  }, [searchOption, searchString, orders])

  const logout = () => {
    if (window.confirm("Logout?")) {
      setUser(null)
      toast.success('Logged-out')
    }
  }

  return (
    <div className="pageWrapper">

      <div className="sidemenu">
        <Link to="/" className='sidemenuChild'>Orders</Link>
        <Link to="/settings" className='sidemenuChild'>Settings</Link>
        <div className='sidemenuChild' onClick={logout}>Logout</div>
      </div>

      <div className="ordersWrapper">
        <h1>Orders</h1>
        <div className="searchWrapper">
          <h2>Search</h2>
          <div className="searchInputs">
            <select value={searchOption} onChange={({ target }) => setSearchOption(target.value)}>
              <option value="">--select column--</option>
              <option value="user.name">User Name</option>
              <option value="customer">Customer</option>
              <option value="orderDescription">Order Description</option>
              <option value="designService">Design Service</option>
              <option value="format">Format</option>
              <option value="singleSidedPrint">Single-Sided Print</option>
              <option value="doubleSidedPrint">Double-Sided Print</option>
              <option value="paper">Paper</option>
              <option value="lamination">Lamination</option>
              <option value="binding">Binding</option>
              <option value="uv3DCoating">UV 3D Coating</option>
              <option value="otherPostPrintingWorks">Other Post Printing Works</option>
              <option value="quantity">Quantity</option>
              <option value="additionalOrderInformation">Additional Order Information</option>
              <option value="deliveryCost">Delivery Cost</option>
              <option value="shippingDate">Shipping Date</option>
              <option value="orderPrice">Order Price</option>
              <option value="invoiceNumber">Invoice Number</option>
              <option value="invoiceStatus">Invoice Status</option>
              <option value="additionalNotes">Additional Notes</option>
              <option value="customerContactDetails">Customer Contact Details</option>
            </select>

            <input
              type="text"
              value={searchString}
              onChange={({ target }) => setSearchString(target.value)}
            />
          </div>
        </div>

        {parseOrdersToTable(shownOrders)}

        <div className='orderButtons'>
          <button>Create Order</button>
          <button>Edit Order</button>
          <button>Delete Order</button>
        </div>

      </div>
    </div>
  )
}

const parseOrdersToTable = (orders) => {
  return (
    <div
      style={{
        overflowX: 'auto',
        width: '100%',
      }}
    >
      <table className="ordersTable">
        <thead>
          <tr>
            <th>User Name</th>
            <th>Customer</th>
            <th>Order Description</th>
            <th>Design Service</th>
            <th>Format</th>
            <th>Single-Sided Print</th>
            <th>Double-Sided Print</th>
            <th>Paper</th>
            <th>Lamination</th>
            <th>Binding</th>
            <th>UV 3D Coating</th>
            <th>Other Post Printing Works</th>
            <th>Quantity</th>
            <th>Additional Order Information</th>
            <th>Delivery Cost</th>
            <th>Shipping Date</th>
            <th>Order Price</th>
            <th>Invoice Number</th>
            <th>Invoice Status</th>
            <th>Additional Notes</th>
            <th>Customer Contact Details</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id}>
              <td>{order.user.name}</td>
              <td>{order.customer}</td>
              <td>{order.orderDescription}</td>
              <td>{order.designService ? 'Yes' : 'No'}</td>
              <td>{order.format}</td>
              <td>{order.singleSidedPrint ? 'Yes' : 'No'}</td>
              <td>{order.doubleSidedPrint ? 'Yes' : 'No'}</td>
              <td>{order.paper}</td>
              <td>{order.lamination}</td>
              <td>{order.binding}</td>
              <td>{order.uv3DCoating ? 'Yes' : 'No'}</td>
              <td>{order.otherPostPrintingWorks}</td>
              <td>{order.quantity}</td>
              <td>{order.additionalOrderInformation}</td>
              <td>{order.deliveryCost}</td>
              <td>{new Date(order.shippingDate).toLocaleDateString()}</td>
              <td>{order.orderPrice}</td>
              <td>{order.invoiceNumber}</td>
              <td>{order.invoiceStatus}</td>
              <td>{order.additionalNotes}</td>
              <td>{order.customerContactDetails}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}


export default Orders