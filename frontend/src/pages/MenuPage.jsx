import { useState } from "react";
import { useNavigate } from "react-router-dom";
import MenuForm from "../components/menu/MenuForm";
import "../index.css";
import { deleteMenuItem, getMenuItems } from "../services/menuServices";
import { useEffect } from "react";

const MenuPage = () => {
    const navigate = useNavigate();
    const [showForm, setshowForm] = useState(false);
    const [loading, setLoading] = useState(false);
    const [items, setItems] = useState([]);
    const fetchItems = async () => {
        try {
            setLoading(true);
            const res = await getMenuItems();
            setItems(res.data);
        } catch (err) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchItems();
    }, []);

    const handleDelete = async (id) => {
  const confirmDelete = window.confirm("Are you sure?");
  if (!confirmDelete) return;

  try {
    await deleteMenuItem(id);
    fetchItems();
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
                <button className="createorderbtn" onClick={() => setshowForm(true)}>+ Create Items</button>
                {showForm && <MenuForm closeForm={() => setshowForm(false)} />}
                <div className="menulist">
                    <div className="menu-card-header">
                        <p>Name</p>
                        <p>Unit</p>
                        <p>Price</p>
                    </div>
                    {loading ? (
                        <p>Loading...</p>
                    ) : items.length === 0 ? (
                        <p>No menu items found.</p>
                    ) : (

                        (Array.isArray(items) ? items : []).map((item) => (
                            <div key={item.id} className="menu-card">
                                <p>{item.name}</p>
                                <p>{item.unit}kg</p>
                                <p>₹{item.price}</p>
                                <button
                                    className="delete-btn"
                                    onClick={() => handleDelete(item.id)}
                                >
                                    x
                                </button>
                            </div>

                        ))
                    )}
                </div>
            </div>
        </div>
    )
}
export default MenuPage;