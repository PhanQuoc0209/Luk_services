import test from 'node:test';
import assert from 'node:assert/strict';

function createCartManager() {
  const carts = new Map();

  return {
    getOrCreateCart(id) {
      if (!carts.has(id)) {
        carts.set(id, { id, items: [] });
      }
      return carts.get(id);
    },
    addToCart(cartId, serviceId, quantity = 1, itemNotes = '') {
      const cart = this.getOrCreateCart(cartId);
      const existing = cart.items.find((i) => i.serviceId === serviceId);
      if (existing) {
        existing.quantity += quantity;
        if (itemNotes) existing.itemNotes = itemNotes;
        return existing;
      }
      const newItem = { id: 'item_' + Math.random(), serviceId, quantity, itemNotes };
      cart.items.push(newItem);
      return newItem;
    },
    updateQuantity(cartId, itemId, quantity) {
      const cart = this.getOrCreateCart(cartId);
      if (quantity <= 0) {
        cart.items = cart.items.filter((i) => i.id !== itemId);
        return null;
      }
      const item = cart.items.find((i) => i.id === itemId);
      if (item) item.quantity = quantity;
      return item;
    },
    removeItem(cartId, itemId) {
      const cart = this.getOrCreateCart(cartId);
      cart.items = cart.items.filter((i) => i.id !== itemId);
    },
    mergeCart(fromCartId, toCartId) {
      const from = this.getOrCreateCart(fromCartId);
      const to = this.getOrCreateCart(toCartId);
      for (const item of from.items) {
        this.addToCart(toCartId, item.serviceId, item.quantity, item.itemNotes);
      }
      from.items = [];
    },
  };
}

test('Cart: Adding service increases item count without creating order', () => {
  const manager = createCartManager();
  const guestCart = manager.getOrCreateCart('session_guest_123');

  manager.addToCart('session_guest_123', 'srv_slide_design', 1, 'Cần 20 slide');
  assert.equal(guestCart.items.length, 1);
  assert.equal(guestCart.items[0].serviceId, 'srv_slide_design');
  assert.equal(guestCart.items[0].quantity, 1);

  // Adding same item increases quantity
  manager.addToCart('session_guest_123', 'srv_slide_design', 2);
  assert.equal(guestCart.items.length, 1);
  assert.equal(guestCart.items[0].quantity, 3);
});

test('Cart: Update quantity and remove item', () => {
  const manager = createCartManager();
  const item = manager.addToCart('cart_1', 'srv_video_editing', 1);

  manager.updateQuantity('cart_1', item.id, 5);
  const cart = manager.getOrCreateCart('cart_1');
  assert.equal(cart.items[0].quantity, 5);

  manager.removeItem('cart_1', item.id);
  assert.equal(cart.items.length, 0);
});

test('Cart: Merging guest cart into user cart upon login', () => {
  const manager = createCartManager();
  manager.addToCart('guest_session', 'srv_debate_bp', 2);

  manager.addToCart('user_123', 'srv_slide_design', 1);
  manager.mergeCart('guest_session', 'user_123');

  const userCart = manager.getOrCreateCart('user_123');
  assert.equal(userCart.items.length, 2);
  assert.ok(userCart.items.find((i) => i.serviceId === 'srv_debate_bp'));
  assert.ok(userCart.items.find((i) => i.serviceId === 'srv_slide_design'));

  const guestCart = manager.getOrCreateCart('guest_session');
  assert.equal(guestCart.items.length, 0);
});
