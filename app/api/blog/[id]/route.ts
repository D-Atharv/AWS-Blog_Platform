// api/blog/[id]/route.ts (create this file)
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Fetch a single blog post by id (GET)
export async function GET(req: Request, { params }: { params: { id: string } }) {
  const { id } = params;
  const blog = await prisma.blog.findUnique({
    where: { id: parseInt(id) },
  });
  if (!blog) {
    return NextResponse.error(); // Return 404 if blog not found
  }
  return NextResponse.json(blog);
}
