'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Blog {
  id: number;
  title: string;
  content: string;
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
    await fetch('/api/blog', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });
    fetchBlogs(); // Refresh the list after deletion
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Blog List</h1>
      <ul className="space-y-6">
        {blogs.map((blog) => (
          <li key={blog.id} className="p-4 border border-gray-300 rounded-lg hover:shadow-lg">
            <h2 className="text-xl font-semibold mb-2">{blog.title}</h2>
            <p className="text-gray-700 mb-4">{blog.content}</p>
            <div className="flex gap-4">
              <Link href={`/blog/${blog.id}/edit`} className="text-blue-500 underline">
                Edit Blog
              </Link>
              <button
                onClick={() => handleDelete(blog.id)}
                className="text-red-500 underline"
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
