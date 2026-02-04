"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ResumeForm from "@/components/resume/ResumeForm";
import ResultsDisplay from "@/components/resume/ResultsDisplay";
import { enhanceResume } from "@/services/api";
import { ResumeResult } from "@/types";
import { exportPDF, exportDOCX, exportJSON } from "@/utils/exportUtils";
import { motion } from "framer-motion";

export default function Page() {
    const [text, setText] = useState("");
    const [result, setResult] = useState<ResumeResult | null>(null);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<string | null>(null);
    const router = useRouter();

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            router.push("/login");
        }
    }, [router]);

    const showMessage = (msg: string) => {
        setMessage(msg);
        setTimeout(() => setMessage(null), 3000);
    };

    const handleEnhance = async () => {
        if (!text.trim()) {
            showMessage("Please paste your resume first!");
            return;
        }

        setLoading(true);
        setResult(null);

        try {
            const data = await enhanceResume(text);
            setResult(data);
            showMessage("Resume enhanced successfully!");
        } catch (error) {
            showMessage("Error enhancing resume");
        } finally {
            setLoading(false);
        }
    };

    const scrollTo = (id: string) => {
        document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    };

    return (
        <main className="min-h-screen bg-gray-50 text-gray-900 font-sans dark:bg-slate-950 dark:text-gray-100 transition-colors selection:bg-primary-500/30">
            {/* Notification */}
            {message && (
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="fixed top-5 right-5 bg-primary-600 text-white px-6 py-3 rounded-lg shadow-lg z-50 font-medium"
                >
                    {message}
                </motion.div>
            )}

            <Header onScrollTo={scrollTo} />

            {/* PLATFORM SECTION */}
            <section id="platform" className="bg-gray-50 dark:bg-gray-800 text-center py-16 px-4">
                <h2 className="text-3xl font-bold mb-4">Platform</h2>
                <p className="text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                    The AI Resume Enhancer is designed to help job seekers optimize their CVs quickly and efficiently.
                    It uses cutting-edge AI, powered by <strong>Grok</strong>, to analyze your resume for readability,
                    structure, and compatibility with Applicant Tracking Systems (ATS). The platform generates enhanced
                    versions of your CV, highlights key achievements, creates bullet points for clarity, and extracts
                    essential keywords to improve your chances of getting noticed by recruiters. Built using modern
                    web technologies, the platform provides a seamless experience and instant results.
                </p>
            </section>

            {/* AI TOOLS SECTION */}
            <section id="ai-tools" className="bg-white dark:bg-gray-900 text-center py-16 px-4">
                <h2 className="text-3xl font-bold mb-4">AI Tools</h2>
                <p className="text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                    Our platform includes tools for enhancing resumes, generating bullet points, and extracting ATS keywords.
                    Each tool leverages the power of Grok AI to provide actionable improvements that increase your chances
                    of landing an interview.
                </p>
            </section>

            {/* APP CARD */}
            <section className="max-w-6xl mx-auto -mt-12 mb-16 bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-xl transition-colors">
                <div className="mb-8">
                    <textarea
                        rows={10}
                        placeholder="Paste your resume text here to start analyzing..."
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        className="w-full p-6 rounded-xl border border-gray-200 dark:border-slate-700 text-gray-900 dark:text-gray-100 bg-gray-50 dark:bg-slate-800 focus:outline-none focus:ring-4 focus:ring-primary-100 dark:focus:ring-primary-900 focus:border-primary-500 transition-all text-lg leading-relaxed resize-y font-mono"
                    />
                </div>

                <ResumeForm
                    text={text}
                    setText={setText}
                    loading={loading}
                    onEnhance={handleEnhance}
                    onClear={() => { setText(""); setResult(null); }}
                    onExportPDF={() => exportPDF(result)}
                    onExportDOCX={() => exportDOCX(result)}
                    onExportJSON={() => exportJSON(result)}
                />

                {loading && (
                    <div className="mt-12 space-y-4 animate-pulse max-w-3xl mx-auto">
                        <div className="h-4 bg-gray-200 dark:bg-slate-800 rounded w-3/4"></div>
                        <div className="h-4 bg-gray-200 dark:bg-slate-800 rounded w-full"></div>
                        <div className="h-4 bg-gray-200 dark:bg-slate-800 rounded w-5/6"></div>
                    </div>
                )}

                {result && <ResultsDisplay result={result} originalText={text} />}
            </section>

            {/* CONTACT SECTION */}
            <section id="contact" className="bg-gray-50 dark:bg-gray-800 text-center py-16 px-4">
                <h2 className="text-3xl font-bold mb-4">Contact</h2>
                <p className="text-gray-600 dark:text-gray-300">
                    For inquiries, reach us at <a href="mailto:asiereiz@ucm.es" className="underline text-blue-600 dark:text-blue-400">asiereiz@ucm.es</a>
                </p>
            </section>

            <Footer />
        </main >
    );
}
