import api from "../api/axios";

export const getShippingCharges = async (items, pincode, paymentType) => {
  // Future API Call

  console.log("hit get shiping charges.......");

  console.log(
    "items:",
    items,
    "pincode:",
    pincode,
    "paymentType:",
    paymentType,
  );
  const totalWeight = 0.5;

  const res = await api.post("/Shiprocket/shipping-charge", {
    totalWeight,
    items,
    pincode,
    paymentType,
  });

  // return res.data;
  console.log("res data:", res.data);

  return {
    success: true,
    shipping_charge: res.data.data.shipping_charge,
  };
};

export const getCodCharges = async (items, pincode, paymentType) => {
  // Future API Call
  console.log("hit get cod charges.......");
  console.log(
    "items:",
    items,
    "pincode:",
    pincode,
    "paymentType:",
    paymentType,
  );
  const totalWeight = 0.5;
  const res = await api.post("/Shiprocket/cod-charge", {
    totalWeight,
    pincode,
    paymentType,
  });

  // return res.data;
  console.log(res.data);

  return {
    success: true,
    cod_charge: res.data.data.cod_charge,
  };
};

export const getServiceAbility = async (items, pincode, paymentType) => {
  // Future API Call
  console.log("hit get cod charges.......");
  console.log("items:",items,"pincode:", pincode, "paymentType:", paymentType );
  const totalWeight = 0.5;
  const res = await api.post("/Shiprocket/serviceability", {
    totalWeight,
    pincode,
    paymentType, 
   });
  // return res.data;
  console.log("++++++++++++++++++++++++++++",res.data);
  return res.data;
};
