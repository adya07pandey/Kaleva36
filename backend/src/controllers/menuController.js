import { db } from "../config/firebaseAdmin.js"

export const createMenuItem = async (req, res, next) => {
  try {
    const { name, unit, price } = req.body;

    const newItem = await db.collection("menuItems").add({
      name,
      unit,
      price,
      createdAt: new Date(),
    });

    res.json({ id: newItem.id, name,unit, price });
  } catch (error) {
    next(error);
  }
};

export const searchMenuItems = async (req, res, next) => {
  try {
    const { search } = req.query;

    const snapshot = await db
      .collection("menuItems")
      .where("name", ">=", search)
      .where("name", "<=", search + "\uf8ff")
      .get();

    const items = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    res.json(items);
  } catch (error) {
    next(error);
  }
};

export const getMenuItems = async (req, res, next) => {
  try {
    const snapshot = await db
      .collection("menuItems")
      .orderBy("createdAt", "desc")
      .get();

    const items = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    res.json(items);
  } catch (error) {
    next(error);
  }
};

export const deleteMenuItem = async (req, res, next) => {
  try {
    const { id } = req.params;

    await db.collection("menuItems").doc(id).delete();

    res.json({ message: "Menu item deleted successfully" });
  } catch (error) {
    next(error);
  }
};
