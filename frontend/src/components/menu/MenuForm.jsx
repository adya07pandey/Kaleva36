import { useState } from "react";
import { createMenuItem, searchMenuItems } from "../../services/menuServices";
import { toast } from "react-toastify";

const MenuForm = ({ closeForm }) => {

    const [name, setName] = useState("");
    const [unit, setUnit] = useState("");
    const [price, setPrice] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async () => {
        if (!name || !unit || !price) {
            toast.error("Please fill all fields");
            return;
        }
        try {
            setLoading(true);
            const newItem = { name, unit, price: Number(price), };
            await createMenuItem(newItem);
            toast.success("Menu item added successfully!");
            setName("");
            setUnit("");
            setPrice("");
            closeForm();
        } catch (error) {
            console.log(error)
            toast.error("Something went wrong!");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="dialoguebox">

            <div className="menu-form">
                <button className="closeformbtn" onClick={closeForm}>x</button>

                <label >Name</label>
                <input
                    placeholder="Item Name..."
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
                <label >Units in kg</label>
                <input
                    placeholder="Units..."
                    type="text"
                    value={unit}
                    onChange={(e) => setUnit(e.target.value)}
                />
                <label >Price</label>

                <input type="text"
                    placeholder="Price..."
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                />

                <button className="submitbtn" onClick={() => { handleSubmit() }} disabled={loading}>Submit</button>

            </div>
        </div>
    );
};

export default MenuForm;