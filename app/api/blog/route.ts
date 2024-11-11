import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Fetch all blog posts (GET)
export async function GET() {
  const blogs = await prisma.blog.findMany();
  return NextResponse.json(blogs);
}

// Create a new blog post (POST)
export async function POST(req: Request) {
  const { title, content } = await req.json();
  const newBlog = await prisma.blog.create({
    data: { title, content },
  });
  return NextResponse.json(newBlog);
}

// Update an existing blog post (PUT)
export async function PUT(req: Request) {
  const { id, title, content } = await req.json();
  const updatedBlog = await prisma.blog.update({
    where: { id: parseInt(id) },
    data: { title, content },
  });
  return NextResponse.json(updatedBlog);
}

// Delete an existing blog post (DELETE)
export async function DELETE(req: Request) {
  const { id } = await req.json();
  await prisma.blog.delete({
    where: { id: parseInt(id) },
  });
  return NextResponse.json({ message: 'Blog deleted' });
}
