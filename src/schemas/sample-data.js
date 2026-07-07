export const sampleCharacterDesign = {
  name: "My Character",
  imageUrl: "data:image/png",
  partSelections: [{ partOptionId: 1 }],
};

export const sampleOrder = {
  email: "customer@example.com",
  phone: "0912345678",
  address: "123 Nguyen Hue, District 1, HCMC",
  accountId: null,
  items: [
    {
      skuId: 1,
      characterDesignId: 42,
      quantity: 1,
    },
  ],
};
