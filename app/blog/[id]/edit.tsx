'use client';
import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';

export default function EditBlog() {
    const { id } = useParams();
    const router = useRouter();
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');

    useEffect(() => {
        fetch(`/api/blog/${id}`)
            .then((res) => res.json())
            .then((data) => {
                setTitle(data.title);
                setContent(data.content);
            });
    }, [id]);

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        await fetch('/api/blog', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id, title, content }),
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
        <form onSubmit={handleUpdate} className="flex flex-col gap-4">
            <h1 className="text-2xl font-bold mb-4">Edit Blog</h1>
            <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Title"
                className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            />
            <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Content"
                className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            />
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
