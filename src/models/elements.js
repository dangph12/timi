/**
 * @typedef {typeof ELEMENT_CATEGORIES[keyof typeof ELEMENT_CATEGORIES]} ElementCategory
 */

export class Element {
  /**
   * @param {Object} data
   * @param {string} [data.id]
   * @param {string} [data.name]
   * @param {ElementCategory} [data.category]
   */
  constructor({ id = '', name = '', category = '' } = {}) {
    this.id = id;
    this.name = name;
    this.category = category;
  }

  toFirestore() {
    return { id: this.id, name: this.name, category: this.category };
  }
}
