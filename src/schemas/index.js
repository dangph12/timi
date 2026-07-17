import * as yup from "yup";

export const characterPartSelectionSchema = yup.object({
  partOptionId: yup.number().required(),
});

export const characterDesignSchema = yup.object({
  name: yup.string().required(),
  imageUrl: yup.string().required(),
  characterPartSelections: yup.array(characterPartSelectionSchema),
});

export const orderItemSchema = yup.object({
  skuId: yup.number().required(),
  characterDesignId: yup.number().required(),
  quantity: yup.number().required(),
});

export const checkoutFormSchema = yup.object().shape({
  name: yup.string().required('Vui lòng nhập họ và tên'),
  phone: yup.string().required('Vui lòng nhập số điện thoại'),
  email: yup.string().email('Email không hợp lệ').required('Vui lòng nhập email'),
  address: yup.string().required('Vui lòng nhập địa chỉ'),
  note: yup.string(),
});

export const orderSchema = yup.object({
  email: yup.string().required(),
  phone: yup.string().required(),
  address: yup.string().required(),
  note: yup.string(),
  accountId: yup.number(),
  items: yup.array(orderItemSchema),
});
