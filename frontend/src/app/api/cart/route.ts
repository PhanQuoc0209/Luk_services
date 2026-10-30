import { NextRequest, NextResponse } from 'next/server';
import { getOrCreateCart, addToCart, getCartSessionId } from '@/lib/cart';
import { z } from 'zod';

const addToCartSchema = z.object({
  serviceId: z.string(),
  quantity: z.number().int().min(1).default(1),
  itemNotes: z.string().optional(),
});

export async function GET() {
  try {
    const cart = await getOrCreateCart();
    const sessionId = await getCartSessionId();

    const response = NextResponse.json({ success: true, cart });
    // Set cookie if not present
    response.cookies.set('luk_cart_session', sessionId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 30, // 30 days
      path: '/',
    });
    return response;
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = addToCartSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ success: false, error: parsed.error.format() }, { status: 400 });
    }

    const { serviceId, quantity, itemNotes } = parsed.data;
    const item = await addToCart(serviceId, quantity, itemNotes);
    const sessionId = await getCartSessionId();

    const response = NextResponse.json({ success: true, item });
    response.cookies.set('luk_cart_session', sessionId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 30,
      path: '/',
    });
    return response;
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
