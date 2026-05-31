export class PurchasableItem {
  constructor({ id = '', name = '', price = 0, type = '' } = {}) {
    this.id = id;
    this.name = name;
    this.price = price;
    this.type = type;
  }

  toFirestore() {
    return { ...this };
  }
}
