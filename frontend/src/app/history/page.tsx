"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

interface ResumeHistory {
    id: number;
    ats_score: number;
    created_at: string;
    enhanced_summary: string;
}

export default function HistoryPage() {
    const [history, setHistory] = useState<ResumeHistory[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            router.push("/login");
            return;
        }

        fetchHistory(token);
    }, [router]);

    const fetchHistory = async (token: string) => {
        try {
            const res = await fetch("http://127.0.0.1:8000/history", {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });

            if (res.ok) {
                const data = await res.json();
                setHistory(data);
            }
        } catch (error) {
            console.error("Failed to fetch history", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="min-h-screen bg-gray-100 text-gray-900 font-sans dark:bg-gray-900 dark:text-gray-100 transition-colors">
            {/* TOP BLUE BAR */}
            <div className="bg-blue-800 text-white py-4 px-6 flex flex-col md:flex-row md:justify-between items-center gap-2">
                <div className="flex items-center gap-4 cursor-pointer" onClick={() => router.push("/")}>
                    <Image src="/logo-mans-www.png" alt="Logo" width={100} height={50} />
                    <div>
                        <h1 className="text-2xl font-bold">AI Resume Enhancer</h1>
                        <p className="text-sm md:text-base">History</p>
                    </div>
                </div>
            </div>

            {/* HEADER / NAVBAR */}
            <header className="bg-gradient-to-r from-blue-900 to-blue-800 p-4 flex justify-center md:justify-end gap-6 sticky top-0 z-40 shadow-md">
                <button onClick={() => router.push("/")} className="text-white font-medium hover:underline">
                    Back to Enhancer
                </button>
                <button onClick={() => {
                    localStorage.removeItem("token");
                    router.push("/login");
                }} className="text-white font-medium hover:underline bg-red-600 px-3 py-1 rounded">
                    Logout
                </button>
            </header>

            <section className="max-w-4xl mx-auto py-10 px-4">
                <h2 className="text-3xl font-bold mb-8 text-center">Your Enhancement History</h2>

                {loading ? (
                    <div className="flex justify-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                    </div>
                ) : history.length === 0 ? (
                    <p className="text-center text-gray-500">No history found. Enhance your first resume!</p>
                ) : (
                    <div className="grid gap-4">
                        {history.map((item) => (
                            <div key={item.id} className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
                                <div className="flex justify-between items-start mb-2">
                                    <div className="text-sm text-gray-500 dark:text-gray-400">
                                        {new Date(item.created_at).toLocaleString()}
                                    </div>
                                    <div className={`px-3 py-1 rounded-full text-white font-bold text-sm ${item.ats_score >= 80 ? "bg-green-600" :
                                            item.ats_score >= 60 ? "bg-yellow-600" : "bg-red-600"
                                        }`}>
                                        ATS: {item.ats_score}
                                    </div>
                                </div>
                                <p className="text-gray-700 dark:text-gray-300">
                                    {item.enhanced_summary}
                                </p>
                            </div>
                        ))}
                    </div>
                )}
            </section>
        </main>
    );
}
