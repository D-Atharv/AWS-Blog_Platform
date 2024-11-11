'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link'; // Import Link from next/link for navigation

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    // If user is already logged in, redirect to home page
    const token = document.cookie.replace(
      /(?:(?:^|.*;\s*)token\s*=\s*([^;]*).*$)|^.*$/,
      '$1'
    );
    if (token) {
      router.push('/'); // Redirect to home page if logged in
    }
  }, [router]);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const res = await fetch('/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    if (res.ok) {
      router.push('/login'); // Redirect to login page after successful registration
    } else {
      const data = await res.json();
      setError(data.error || 'Registration failed');
    }
  };

  return (
    <form onSubmit={handleRegister} className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold mb-4">Register</h1>
      {error && <p className="text-red-500">{error}</p>}
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        className="p-2 border border-gray-300 rounded-lg"
        required
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        className="p-2 border border-gray-300 rounded-lg"
        required
      />
      <button
        type="submit"
        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
      >
        Register
      </button>

      <p className="mt-4 text-center">
        Already have an account?{' '}
        <Link href="/login" className="text-blue-500 hover:underline">
          Login here
        </Link>
      </p>
    </form>
  );
}
