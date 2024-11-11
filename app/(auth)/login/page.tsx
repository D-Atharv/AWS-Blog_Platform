'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    // Check if the user is already logged in
    const token = document.cookie.replace(
      /(?:(?:^|.*;\s*)token\s*=\s*([^;]*).*$)|^.*$/,
      '$1'
    );
    if (token) {
      router.push('/'); // Redirect to home if logged in
    }
  }, [router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const res = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (res.ok) {
      document.cookie = `token=${data.token}; path=/;`; // Store token in cookie
      router.push('/'); // Redirect to home page after login
    } else {
      setError(data.error || 'Login failed');
    }
  };

  return (
    <form onSubmit={handleLogin} className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold mb-4">Login</h1>
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
        Login
      </button>

      <p className="mt-4">
        Dont have an account?{' '}
        <Link href="/register" className="text-blue-500 hover:underline">
          Register here
        </Link>
      </p>
    </form>
  );
}
