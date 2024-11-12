import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  const blogs = await prisma.blog.findMany();
  return NextResponse.json(blogs);
}

export async function POST(req: Request) {
  const { title, content, imagePath } = await req.json();
  const newBlog = await prisma.blog.create({
    data: { title, content, imagePath },
  });
  return NextResponse.json(newBlog);
}

export async function PUT(req: Request) {
  const { id, title, content, imagePath } = await req.json();
  const updatedBlog = await prisma.blog.update({
    where: { id },
    data: { title, content, imagePath },
  });
  return NextResponse.json(updatedBlog);
}

export async function DELETE(req: Request) {
  const { id } = await req.json();
  await prisma.blog.delete({
    where: { id: id },
  });
  return NextResponse.json({ message: 'Blog deleted' });
}
