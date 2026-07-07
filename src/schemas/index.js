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

export const orderSchema = yup.object({
  email: yup.string().required(),
  phone: yup.string().required(),
  address: yup.string().required(),
  accountId: yup.number(),
  items: yup.array(orderItemSchema),
});
