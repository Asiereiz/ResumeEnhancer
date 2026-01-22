'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        try {
            console.log("Attempting login...");
            const response = await fetch('http://127.0.0.1:8000/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            if (!response.ok) {
                throw new Error('Login failed. Please check your credentials.');
            }

            const data = await response.json();
            localStorage.setItem('token', data.access_token);
            router.push('/');
        } catch (err: any) {
            setError(err.message);
        }
    };

    return (
        <main className="min-h-screen bg-gray-100 text-gray-900 font-sans dark:bg-gray-900 dark:text-gray-100 transition-colors flex flex-col">
            {/* TOP BLUE BAR */}
            <div className="bg-blue-800 text-white py-4 px-6 flex flex-col md:flex-row md:justify-between items-center gap-2">
                <div className="flex items-center gap-4">
                    <img src="/logo-mans-www.png" alt="Logo" width={100} height={50} />
                    <div>
                        <h1 className="text-2xl font-bold">AI Resume Enhancer</h1>
                        <p className="text-sm md:text-base">
                            Optimize your CV for recruiters and ATS systems in seconds
                        </p>
                    </div>
                </div>
            </div>

            <div className="flex-grow flex items-center justify-center p-4">
                <div className="w-full max-w-md rounded-lg bg-white dark:bg-gray-800 p-8 shadow-md transition-colors">
                    <h1 className="mb-6 text-2xl font-bold text-center text-gray-800 dark:text-gray-100">Login</h1>
                    {error && <p className="mb-4 text-red-500 text-sm text-center">{error}</p>}
                    <form onSubmit={handleLogin} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
                            <input
                                type="email"
                                required
                                className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 p-2 focus:border-blue-500 focus:outline-none text-gray-900 bg-white"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Password</label>
                            <input
                                type="password"
                                required
                                className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 p-2 focus:border-blue-500 focus:outline-none text-gray-900 bg-white"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                        <button
                            type="submit"
                            className="w-full rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 focus:outline-none"
                        >
                            Sign In
                        </button>
                    </form>
                    <p className="mt-4 text-center text-sm text-gray-600 dark:text-gray-400">
                        Don't have an account?{' '}
                        <a href="/register" className="text-blue-600 hover:underline dark:text-blue-400">
                            Register
                        </a>
                    </p>
                </div>
            </div>

            <footer className="bg-gray-900 dark:bg-gray-950 text-gray-300 dark:text-gray-400 p-8 flex justify-between items-center transition-colors">
                <p className="text-sm">© 2025 AI Resume Enhancer · Warsaw Management University</p>
                <img src="/logo-mans-www.png" alt="Logo" width={120} height={55} />
            </footer>
        </main>
    );
}
