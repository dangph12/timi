import { serverTimestamp } from 'firebase/firestore';

export class Order {
  constructor(data = {}) {
    this.customer = {
      fullName: data.customer?.fullName || '',
      phoneNumber: data.customer?.phoneNumber || '',
      email: data.customer?.email || ''
    };
    this.delivery = {
      address: data.delivery?.address || '',
      deliveryNotes: data.delivery?.deliveryNotes || ''
    };
    this.cart = {
      lineItems: (data.cart?.lineItems || []).map(item => ({
        id: item.id,
        name: item.name,
        price: item.price
      })),
      customization: {
        elements: (data.cart?.customization?.elements || []).map(el => ({
          id: el.id,
          name: el.name,
          category: el.category
        })),
        finalImageUrl: data.cart?.customization?.finalImageUrl || ''
      },
      subtotal: data.cart?.subtotal || 0,
      shipping: data.cart?.shipping || 0,
      total: data.cart?.total || 0
    };
    this.payment = {
      discountCode: data.payment?.discountCode || '',
      status: data.payment?.status || 'pending'
    };
    this.timestamps = {
      createdAt: data.timestamps?.createdAt || serverTimestamp()
    };
  }

  toFirestore() {
    return { ...this };
  }
}
