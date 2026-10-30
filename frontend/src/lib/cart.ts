import { cookies } from 'next/headers';
import { prisma } from './prisma';
import { getCurrentUser } from './auth';

const CART_COOKIE_NAME = 'luk_cart_session';

export async function getCartSessionId(): Promise<string> {
  const cookieStore = await cookies();
  let sessionId = cookieStore.get(CART_COOKIE_NAME)?.value;
  if (!sessionId) {
    sessionId = 'guest_' + Math.random().toString(36).substring(2, 15) + Date.now().toString(36);
  }
  return sessionId;
}

export async function getOrCreateCart() {
  const user = await getCurrentUser();
  const sessionId = await getCartSessionId();

  if (user) {
    let cart = await prisma.cart.findFirst({
      where: { userId: user.id },
      include: {
        items: {
          include: {
            service: true,
          },
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!cart) {
      cart = await prisma.cart.create({
        data: {
          userId: user.id,
        },
        include: {
          items: {
            include: {
              service: true,
            },
          },
        },
      });
    }

    // Merge guest cart if existed prior to login
    const guestCart = await prisma.cart.findUnique({
      where: { sessionId },
      include: { items: true },
    });

    if (guestCart && guestCart.items.length > 0) {
      for (const item of guestCart.items) {
        const existingInUserCart = cart.items.find((i) => i.serviceId === item.serviceId);
        if (existingInUserCart) {
          await prisma.cartItem.update({
            where: { id: existingInUserCart.id },
            data: { quantity: existingInUserCart.quantity + item.quantity },
          });
        } else {
          await prisma.cartItem.create({
            data: {
              cartId: cart.id,
              serviceId: item.serviceId,
              quantity: item.quantity,
              itemNotes: item.itemNotes,
            },
          });
        }
      }
      // Remove guest cart items after merge
      await prisma.cart.delete({
        where: { id: guestCart.id },
      });

      // Refetch merged cart
      cart = await prisma.cart.findUniqueOrThrow({
        where: { id: cart.id },
        include: {
          items: {
            include: {
              service: true,
            },
            orderBy: { createdAt: 'desc' },
          },
        },
      });
    }

    return cart;
  }

  // Guest Cart
  let cart = await prisma.cart.findUnique({
    where: { sessionId },
    include: {
      items: {
        include: {
          service: true,
        },
        orderBy: { createdAt: 'desc' },
      },
    },
  });

  if (!cart) {
    cart = await prisma.cart.create({
      data: {
        sessionId,
      },
      include: {
        items: {
          include: {
            service: true,
          },
        },
      },
    });
  }

  return cart;
}

export async function addToCart(serviceId: string, quantity = 1, itemNotes?: string) {
  const cart = await getOrCreateCart();

  const existingItem = cart.items.find((item) => item.serviceId === serviceId);

  if (existingItem) {
    return await prisma.cartItem.update({
      where: { id: existingItem.id },
      data: {
        quantity: existingItem.quantity + quantity,
        itemNotes: itemNotes ?? existingItem.itemNotes,
      },
      include: { service: true },
    });
  }

  return await prisma.cartItem.create({
    data: {
      cartId: cart.id,
      serviceId,
      quantity: Math.max(1, quantity),
      itemNotes: itemNotes || null,
    },
    include: { service: true },
  });
}

export async function updateCartItem(cartItemId: string, quantity: number, itemNotes?: string) {
  const cart = await getOrCreateCart();
  const item = cart.items.find((i) => i.id === cartItemId);
  if (!item) {
    throw new Error('CART_ITEM_NOT_FOUND');
  }

  if (quantity <= 0) {
    await prisma.cartItem.delete({
      where: { id: cartItemId },
    });
    return null;
  }

  return await prisma.cartItem.update({
    where: { id: cartItemId },
    data: {
      quantity,
      itemNotes: itemNotes !== undefined ? itemNotes : item.itemNotes,
    },
    include: { service: true },
  });
}

export async function removeCartItem(cartItemId: string) {
  const cart = await getOrCreateCart();
  const item = cart.items.find((i) => i.id === cartItemId);
  if (!item) {
    throw new Error('CART_ITEM_NOT_FOUND');
  }

  await prisma.cartItem.delete({
    where: { id: cartItemId },
  });
  return true;
}

export async function clearCart(cartId: string) {
  await prisma.cartItem.deleteMany({
    where: { cartId },
  });
}
