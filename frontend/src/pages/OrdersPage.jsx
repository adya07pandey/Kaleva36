import { useEffect, useState } from "react";
import OrderForm from "../components/orders/OrderForm";
import { useNavigate } from "react-router-dom";
import "../index.css";
import { getOrders, updateOrderStatus } from "../services/orderService";
import { getCustomers } from "../services/customerService";

const OrdersPage = () => {
  const navigate = useNavigate();
  const [showForm, setShowForm] = useState(false);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [customers, setCustomers] = useState([])
  const [editingOrder, setEditingOrder] = useState(null);
  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await getOrders();
      setOrders(res.data);
      setOrders(res.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const res = await getCustomers();
      setCustomers(res.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
    fetchCustomers();
  }, []);

  const getCustomerDetails = (customerId) => {
    return customers.find((c) => c.id === customerId);
  };

  const handleMarkDone = async (orderId) => {
    try {
      await updateOrderStatus(orderId);
      fetchOrders();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <div className="navbar">
        <h1>Kaleva36</h1>
        <div className="pages">
          <button onClick={() => navigate("/")}>Order</button>
          <button onClick={() => navigate("/menu")}>Menu</button>
        </div>
      </div>

      <div className="container">
        <button
          className="createorderbtn"
          onClick={() => setShowForm(true)}
        >
          + Create Order
        </button>

        {showForm && (
          <OrderForm
            closeForm={() => {
              setShowForm(false);
              fetchOrders();
              setEditingOrder(null);
            }}
            editOrder={editingOrder}
            refreshOrders={fetchOrders}
          />
        )}

        <div className="ordercards">
          {loading ? (
            <p>Loading...</p>
          ) : orders.length === 0 ? (
            <p>No Orders Yet</p>
          ) : (
            orders.map((order) => {
              const customer = getCustomerDetails(order.customerId);
              return (
                <div key={order.id} className={`order-card ${order.status === "done" ? "done" : "ongoing"}`}>
                  <div className="a">

                    <button className={`ordernobtn ${order.status === "done" ? "doneno" : "ongoingno"}`}><b>{order.serialNo}</b></button>
                  </div>
                  <div className="b">

                    <p className="cname">
                      <b>{order.customerName || "(Unknown)"}</b>
                    </p>

                    <p className="phoneno">
                      {order.PhoneNo || ""}
                    </p>

                    <div className="items-list">
                      {order.items.map((item, index) => (
                        <div key={index} className="item-row">
                          <span>{item.name}</span>
                          <span>{item.quantity} kg</span>
                          {/* <span>₹{item.priceAtOrder}/kg</span> */}
                          <span>
                            ₹{(item.quantity * item.priceAtOrder).toFixed(2)}
                          </span>
                          <br />
                        </div>
                      ))}
                    </div>

                    <p>
                      <b>Total:  ₹{order.totalPrice}</b>
                    </p>

                    {order.comments && (
                      <p className="comments">
                        <b>Comments:</b>{order.comments}
                      </p>
                    )}

                    <p>
                      {/* <b>Status:</b>{" "} */}
                      <span

                      >
                        {/* {order.status} */}
                      </span>
                    </p>

                    {/* Buttons Section */}
                    <div className="order-actions">
                      {order.status === "ongoing" && (
                        <>
                          <button
                            className="done-btn"
                            onClick={() => handleMarkDone(order.id)}
                          >
                           Done
                          </button>

                          
                        </>
                      )}

                      {order.status === "ongoing" && (
                        <button
                            className="edit-btn"
                            onClick={() => {
                              setEditingOrder(order);
                              setShowForm(true);
                            }}
                          >
                            Edit
                          </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default OrdersPage;