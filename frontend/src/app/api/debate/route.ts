import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const q = searchParams.get('q')?.trim() || '';
    const topic = searchParams.get('topic')?.trim() || '';
    const format = searchParams.get('format')?.trim() || '';
    const difficulty = searchParams.get('difficulty')?.trim() || '';
    const language = searchParams.get('language')?.trim() || '';

    const where: any = {};

    if (q) {
      where.OR = [
        { title: { contains: q } },
        { description: { contains: q } },
        { tags: { contains: q } },
      ];
    }

    if (topic && topic !== 'ALL') {
      where.topic = topic;
    }

    if (format && format !== 'ALL') {
      where.format = format;
    }

    if (difficulty && difficulty !== 'ALL') {
      where.difficulty = difficulty;
    }

    if (language && language !== 'ALL') {
      where.language = language;
    }

    const resources = await prisma.debateResource.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({
      success: true,
      resources,
      total: resources.length,
    });
  } catch (error: any) {
    console.error('Debate resource query error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
