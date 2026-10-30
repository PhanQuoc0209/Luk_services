import { NextRequest, NextResponse } from 'next/server';
import { updateCartItem, removeCartItem } from '@/lib/cart';
import { z } from 'zod';

const updateSchema = z.object({
  quantity: z.number().int().min(0),
  itemNotes: z.string().optional(),
});

interface RouteParams {
  params: Promise<{ itemId: string }>;
}

export async function PATCH(req: NextRequest, { params }: RouteParams) {
  try {
    const { itemId } = await params;
    const body = await req.json();
    const parsed = updateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ success: false, error: parsed.error.format() }, { status: 400 });
    }

    const updated = await updateCartItem(itemId, parsed.data.quantity, parsed.data.itemNotes);
    return NextResponse.json({ success: true, item: updated });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: RouteParams) {
  try {
    const { itemId } = await params;
    await removeCartItem(itemId);
    return NextResponse.json({ success: true, removed: true });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
