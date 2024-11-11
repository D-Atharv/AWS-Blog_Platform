import Link from 'next/link';
import './globals.css';

export const metadata = {
  title: 'Blog App',
  description: 'A simple blog app with CRUD functionality',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <nav className="p-4 border-b border-gray-200 bg-white flex gap-4">
          <Link href="/" className="text-gray-700 font-semibold hover:text-blue-500">
            Home
          </Link>
          <Link href="/blog" className="text-gray-700 font-semibold hover:text-blue-500">
            Create Blog
          </Link>
        </nav>
        <main className="max-w-3xl mx-auto mt-8 p-4 bg-white rounded-lg shadow-md">
          {children}
        </main>
      </body>
    </html>
  );
}
