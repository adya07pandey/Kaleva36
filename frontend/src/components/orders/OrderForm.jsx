import { useState, useEffect } from "react";
import { getCustomers, createCustomer } from "../../services/customerService";
import { getMenuItems } from "../../services/menuServices";
import { createOrder, getOrders, updateOrder } from "../../services/orderService";

const OrderForm = ({ closeForm, editOrder, refreshOrders }) => {
  const [customers, setCustomers] = useState([]);
  const [items, setItems] = useState([]);
  const [comments, setComments] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [phone, setPhone] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [suggestions, setSuggestions] = useState([]);

  const [itemSearch, setItemSearch] = useState("");
  const [itemSuggestions, setItemSuggestions] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [loading,setLoading] = useState(false);
  const isEditMode = !!editOrder;
  // Fetch customers + items once
  useEffect(() => {
    const fetchData = async () => {
      try {
        const custRes = await getCustomers();
        setCustomers(custRes.data);

        const itemRes = await getMenuItems();
        setItems(itemRes.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, []);
  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await getOrders();
      console.log(res.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (editOrder) {
      setCustomerName(editOrder.customerName || "");
      setPhone(editOrder.PhoneNo || "");
      setSelectedCustomer(null);
      const formattedItems = editOrder.items.map((item) => ({
        id: item.itemId,
        name: item.name,
        pricePerKg: item.priceAtOrder,
        quantity: item.quantity,
        displayQuantity: `${item.quantity}kg`,
      }));

      setSelectedItems(formattedItems);
      setComments(editOrder.comments || "");
    }
  }, [editOrder]);

  // ------------------------
  // CUSTOMER SEARCH
  // ------------------------

  const handleCustomerSearch = (value) => {
    setCustomerName(value);
    setSelectedCustomer(null);

    if (!value.trim()) {
      setSuggestions([]);
      return;
    }

    const filtered = customers.filter((customer) =>
      customer.name.toLowerCase().includes(value.toLowerCase())
    );

    setSuggestions(filtered);
  };

  const handleSelectCustomer = (customer) => {
    setSelectedCustomer(customer);
    setCustomerName(customer.name);
    setPhone(customer.phone || "");
    setSuggestions([]);
  };

  // ------------------------
  // ITEM SEARCH
  // ------------------------

  const handleItemSearch = (value) => {
    setItemSearch(value);

    if (!value.trim()) {
      setItemSuggestions([]);
      return;
    }

    const filtered = items.filter((item) =>
      item.name.toLowerCase().includes(value.toLowerCase())
    );

    setItemSuggestions(filtered);
  };

  const handleSelectItem = (item) => {
    // prevent duplicate
    if (selectedItems.find((i) => i.id === item.id)) return;

    setSelectedItems([
      ...selectedItems,
      {
        id: item.id,
        name: item.name,
        pricePerKg: item.price, // assuming price stored per kg
        quantity: 1,
        displayQuantity: "1kg",
      },
    ]);

    setItemSearch("");
    setItemSuggestions([]);
  };

  // ------------------------
  // QUANTITY PARSER
  // ------------------------

  const parseQuantityInput = (input) => {
    const match = input.trim().toLowerCase().match(/^(\d+(\.\d+)?)(kg|gm)$/);

    if (!match) return null;

    let value = parseFloat(match[1]);
    const unit = match[3];

    if (unit === "gm") {
      value = value / 1000;
    }

    return value;
  };

  const handleQuantityChange = (index, inputValue) => {
    const updated = [...selectedItems];

    // Always update display value (so backspace works)
    updated[index].displayQuantity = inputValue;

    const quantityInKg = parseQuantityInput(inputValue);

    // Only update real quantity if valid format
    if (quantityInKg !== null) {
      updated[index].quantity = quantityInKg;
    }

    setSelectedItems(updated);
  };

  const handleRemoveItem = (id) => {
    setSelectedItems(selectedItems.filter((item) => item.id !== id));
  };

  // ------------------------
  // TOTAL CALCULATION
  // ------------------------

  const totalAmount = selectedItems.reduce(
    (sum, item) => sum + item.pricePerKg * item.quantity,
    0
  );

  // ------------------------
  // SUBMIT
  // ------------------------

  const handleSubmit = async () => {
  try {
    if(!customerName){
      alert("CustomerName should be filled")
      return;
    }
    let customerId;

    if (isEditMode) {
      customerId = editOrder.customerId;
    } else {
      if (selectedCustomer) {
        customerId = selectedCustomer.id;
      } else {
        const res = await createCustomer({
          name: customerName,
          phone,
        });
        customerId = res.data.id;
      }
    }

    const formattedItems = selectedItems.map((item) => ({
      itemId: item.id,
      name: item.name,
      quantity: item.quantity,
      priceAtOrder: item.pricePerKg,
    }));

    const payload = {
      customerId,
      customerName: customerName || "",
      PhoneNo: phone || "",
      status: isEditMode ? editOrder.status : "ongoing",
      items: formattedItems,
      comments: comments || "",
    };

    if (isEditMode) {
      await updateOrder(editOrder.id, payload);
      await refreshOrders();
      alert("Order Updated!");
    } else {
      await createOrder(payload);
      await refreshOrders();
      alert("Order Created!");
    }

    closeForm();
  } catch (error) {
    console.log(error);
  }
};
  // ------------------------
  // UI
  // ------------------------

  return (
    <div className="dialoguebox">
      <div className="order-form">
        <button className="closeformbtn" onClick={closeForm}>
          x
        </button>

        <div className="orderform">
          <label>Customer Name</label>
          <input
            type="text"
            placeholder="Name"
            value={customerName}
            onChange={(e) => handleCustomerSearch(e.target.value)}
            disabled={isEditMode}
          />

          {suggestions.length > 0 && (
            <div className="dropdown">
              {suggestions.map((customer) => (
                <div
                  key={customer.id}
                  className="dropdown-item"
                  onClick={() => handleSelectCustomer(customer)}
                >
                  {customer.name} ({customer.phone})
                </div>
              ))}
            </div>
          )}

          <label>Phone No.</label>
          <input
            type="text"
            placeholder="Phone No."
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />

          <label>Items</label>
          <input
            type="text"
            placeholder="Search item..."
            value={itemSearch}
            onChange={(e) => handleItemSearch(e.target.value)}
          />

          {itemSuggestions.length > 0 && (
            <div className="dropdown">
              {itemSuggestions.map((item) => (
                <div
                  key={item.id}
                  className="dropdown-item"
                  onClick={() => handleSelectItem(item)}
                >
                  {item.name} - ₹{item.price}/kg
                </div>
              ))}
            </div>
          )}

          {/* Selected Items */}
          <div className="selected-items">


  {selectedItems.map((item, index) => (
    <div key={item.id} className="selected-item">
      <span>{item.name}</span>
      <input
        type="text"
        value={item.displayQuantity}
        onChange={(e) => handleQuantityChange(index, e.target.value)}
      />
      <span>₹{(item.pricePerKg * item.quantity).toFixed(2)}</span>
      <button onClick={() => handleRemoveItem(item.id)}>x</button>
    </div>
  ))}
</div>

          <h3>Total: ₹{totalAmount.toFixed(2)}</h3>
          <label >Comments</label>
          <input
            type="text"
            value={comments}
            onChange={(e) => setComments(e.target.value)}
            placeholder="Comments"
          />
          <button className="savebtn" onClick={handleSubmit}>Save</button>
        </div>
      </div>
    </div>
  );
};

export default OrderForm;