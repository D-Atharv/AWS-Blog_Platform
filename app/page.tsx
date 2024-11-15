'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface Blog {
  id: number;
  title: string;
  content: string;
  imagePath?: string;
}

export default function HomePage() {
  const [blogs, setBlogs] = useState<Blog[]>([]);

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    const res = await fetch('/api/blog');
    const data = await res.json();
    setBlogs(data);
  };

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to delete this blog?')) {
      await fetch('/api/blog', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      fetchBlogs();
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6 text-gray-700">Blog List</h1>
      <ul className="space-y-6">
        {blogs.map((blog) => (
          <li key={blog.id} className="p-6 bg-white border border-gray-200 rounded-lg shadow hover:shadow-lg transition">
            <h2 className="text-xl font-semibold mb-2 text-gray-800">{blog.title}</h2>
            <p className="text-gray-600 mb-4">{blog.content}</p>
            {blog.imagePath && (
              <Image src={blog.imagePath} alt={blog.title} width={400} height={300} className="mb-4 max-w-full h-auto rounded-lg" />
            )}
            <div className="flex gap-4">
              <Link href={`/blog/${blog.id}/`} className="text-blue-500 underline">
                Edit Blog
              </Link>
              <button
                onClick={() => handleDelete(blog.id)}
                className="text-red-500 underline"
              >
                Delete Blog
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
