import { db } from "../config/firebaseAdmin.js"
import { generateSerialNo } from "../utils/generateSerialNo.js";

export const createOrder = async (req, res, next) => {
  try {
    const { customerId, customerName,PhoneNo,items, comments } = req.body;

    const serialNo = await generateSerialNo();

    const totalPrice = items.reduce(
      (sum, item) => sum + item.quantity * item.priceAtOrder,
      0
    );

    const newOrder = await db.collection("orders").add({
      serialNo,
      customerId,
      customerName:customerName ?? "",
      PhoneNo: PhoneNo ?? "",
      items,
      totalPrice,
      status: "ongoing",
      comments: comments ?? "",
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    res.json({ id: newOrder.id, serialNo });
  } catch (error) {
    next(error);
  }
};

export const getOrders = async (req, res, next) => {
  try {

    const ongoingSnapshot = await db
      .collection("orders")
      .where("status", "==", "ongoing")
      .orderBy("createdAt", "desc")
      .get();

    const ongoingOrders = ongoingSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    const doneSnapshot = await db
      .collection("orders")
      .where("status", "==", "done")
      .orderBy("createdAt", "desc")
      .get();

    const doneOrders = doneSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));


    const finalOrders = [...ongoingOrders, ...doneOrders];

    res.json(finalOrders);
  } catch (error) {
    next(error);
  }
};

export const updateOrder = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { customerName, PhoneNo, items, status, comments } = req.body;

    const updateData = {
      updatedAt: new Date(),
    };

    if (customerName !== undefined) updateData.customerName = customerName;
    if (PhoneNo !== undefined) updateData.PhoneNo = PhoneNo;
    if (status !== undefined) updateData.status = status;
    if (comments !== undefined) updateData.comments = comments;

    if (items !== undefined) {
      updateData.items = items;
      updateData.totalPrice = items.reduce(
        (sum, item) => sum + item.quantity * item.priceAtOrder,
        0
      );
    }

    await db.collection("orders").doc(id).update(updateData);

    res.json({ success: true });
  } catch (error) {
    next(error);
  }
};

// DELETE ORDER
export const deleteOrder = async (req, res, next) => {
  try {
    const { id } = req.params;

    const orderRef = db.collection("orders").doc(id);
    const orderDoc = await orderRef.get();

    if (!orderDoc.exists) {
      return res.status(404).json({ message: "Order not found" });
    }

    await orderRef.delete();

    res.json({
      success: true,
      message: "Order deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const updateOrderStatus = async (req, res, next) => {
  try {
    const { id } = req.params;

    await db.collection("orders").doc(id).update({
      status: "done",
      updatedAt: new Date(),
    });

    res.json({ message: "Order marked as done" });
  } catch (error) {
    next(error);
  }
};