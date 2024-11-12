'use client';
import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Image from 'next/image';

export default function EditBlog() {
  const { id } = useParams(); 
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [existingImagePath, setExistingImagePath] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      fetch(`/api/blog/${id}`)
        .then((res) => res.json())
        .then((data) => {
          setTitle(data.title);
          setContent(data.content);
          setExistingImagePath(data.imagePath); 
        })
        .catch((err) => console.error('Error fetching blog:', err));
    }
  }, [id]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();

    let imagePath = existingImagePath;
    if (image) {
      const formData = new FormData();
      formData.append('file', image);

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      imagePath = data.filePath;
    }

    await fetch('/api/blog', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, title, content, imagePath }),
    });
    router.push('/');
  };

  const handleDelete = async () => {
    await fetch('/api/blog', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });
    router.push('/');
  };

  return (
    <form onSubmit={handleUpdate} className="flex flex-col gap-4 bg-white p-6 rounded-lg shadow">
      <h1 className="text-2xl font-bold mb-4 text-gray-700">Edit Blog</h1>
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Title"
        className="p-3 border border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
      />
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Content"
        className="p-3 border border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
      />
      <div className="mb-4">
        {existingImagePath && (
          <Image src={existingImagePath} alt="Current blog image" width={200} height={200} className="mb-4 max-w-full h-auto rounded-lg" />
        )}
        <label className="block text-gray-700 font-medium mb-2">Update Image:</label>
        <input
          type="file"
          onChange={handleImageChange}
          className="p-3 border border-gray-200 rounded-lg"
        />
      </div>
      <div className="flex gap-4">
        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          Update
        </button>
        <button
          type="button"
          onClick={handleDelete}
          className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
        >
          Delete
        </button>
      </div>
    </form>
  );
}
