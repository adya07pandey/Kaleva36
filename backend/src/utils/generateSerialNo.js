import { db } from "../config/firebaseAdmin.js"

export const generateSerialNo = async () => {
  const counterRef = db.collection("counters").doc("orders");

  const newSerial = await db.runTransaction(async (transaction) => {
    const doc = await transaction.get(counterRef);

    if (!doc.exists) {
      transaction.set(counterRef, { value: 1 });
      return 1;
    }

    const newValue = doc.data().value + 1;
    transaction.update(counterRef, { value: newValue });
    return newValue;
  });

  return newSerial;
};