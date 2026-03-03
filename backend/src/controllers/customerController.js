import { db } from "../config/firebaseAdmin.js"

export const createCustomer = async (req, res, next) => {
  try {
    const { name, phone } = req.body;

    const newCustomer = await db.collection("customers").add({
      name,
      phone: phone || "",
      createdAt: new Date(),
    });

    res.json({ id: newCustomer.id, name, phone });
  } catch (error) {
    next(error);
  }
};

export const searchCustomers = async (req, res, next) => {
  try {
    const { search } = req.query;

    const snapshot = await db
      .collection("customers")
      .where("name", ">=", search)
      .where("name", "<=", search + "\uf8ff")
      .get();

    const customers = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    res.json(customers);
  } catch (error) {
    next(error);
  }
};
export const getCustomers = async (req, res, next) => {
  try {
    const snapshot = await db
      .collection("customers")
      .orderBy("createdAt", "desc")
      .get();

    const customers = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    res.json(customers);
  } catch (error) {
    next(error);
  }
};