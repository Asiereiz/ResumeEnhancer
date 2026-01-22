"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { jsPDF } from "jspdf";

type Tab = "enhanced" | "bullets" | "keywords";

export default function Page() {
    const [text, setText] = useState("");
    const [result, setResult] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [tab, setTab] = useState<Tab>("enhanced");
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

    const enhanceResume = async () => {
        if (!text.trim()) {
            showMessage("Please paste your resume first!");
            return;
        }

        setLoading(true);
        setResult(null);

        try {
            const res = await fetch("http://127.0.0.1:8000/enhance", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("token")}`
                },
                body: JSON.stringify({ text }),
            });

            if (!res.ok) throw new Error("Failed to process resume");

            const data = await res.json();
            setResult(data);
            showMessage("Resume enhanced successfully!");
        } catch (error) {
            showMessage("Error enhancing resume");
        } finally {
            setLoading(false);
        }
    };

    const exportPDF = () => {
        if (!result) return showMessage("No content to export");

        const doc = new jsPDF();
        const pageWidth = doc.internal.pageSize.getWidth();
        const margin = 10;
        const maxLineWidth = pageWidth - margin * 2;

        // Title
        doc.setFontSize(16);
        doc.text("Enhanced Resume", margin, 20);

        // Enhanced Text
        doc.setFontSize(12);
        const splitText = doc.splitTextToSize(result.enhanced_text || "", maxLineWidth);
        doc.text(splitText, margin, 35);

        // Add some spacing after text
        let yPos = 35 + (splitText.length * 5) + 10;

        // Bullet Points
        if (result.bullet_points && result.bullet_points.length > 0) {
            if (yPos > 250) { // Check if we need a new page
                doc.addPage();
                yPos = 20;
            }

            doc.setFontSize(14);
            doc.text("Improved Bullet Points", margin, yPos);
            yPos += 10;

            doc.setFontSize(12);
            result.bullet_points.forEach((bullet: string) => {
                const bulletText = `• ${bullet}`;
                const splitBullet = doc.splitTextToSize(bulletText, maxLineWidth);

                if (yPos + (splitBullet.length * 5) > 280) {
                    doc.addPage();
                    yPos = 20;
                }

                doc.text(splitBullet, margin, yPos);
                yPos += (splitBullet.length * 5) + 2;
            });
        }

        doc.save("resume.pdf");
    };

    const exportDOCX = () => {
        if (!result) return showMessage("No content to export");
        const textContent = result.enhanced_text || JSON.stringify(result, null, 2);
        const blob = new Blob(
            [
                `<html xmlns:w="urn:schemas-microsoft-com:office:word">
          <head><meta charset="utf-8"></head>
          <body>${textContent}</body>
        </html>`,
            ],
            { type: "application/msword" }
        );
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "resume.docx";
        a.click();
        URL.revokeObjectURL(url);
    };

    const exportJSON = () => {
        if (!result) return showMessage("No content to export");

        // Match the specific format requested by the user
        const jsonContent = JSON.stringify({
            corrected_text: result.enhanced_text || "",
            improved_bullets: result.bullet_points || [],
            ats_score: result.ats_score || 0,
            strengths: result.strengths || [],
            suggestions: result.suggestions || []
        }, null, 2);

        const blob = new Blob([jsonContent], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "resume_data.json";
        a.click();
        URL.revokeObjectURL(url);
    };

    const scrollTo = (id: string) => {
        document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    };

    return (
        <main className="min-h-screen bg-gray-100 text-gray-900 font-sans dark:bg-gray-900 dark:text-gray-100 transition-colors">
            {/* Notification */}
            {message && (
                <div className="fixed top-5 right-5 bg-blue-600 text-white px-4 py-2 rounded shadow z-50">
                    {message}
                </div>
            )}

            {/* TOP BLUE BAR */}
            <div className="bg-blue-800 text-white py-4 px-6 flex flex-col md:flex-row md:justify-between items-center gap-2">
                <div className="flex items-center gap-4">
                    <Image src="/logo-mans-www.png" alt="Logo" width={100} height={50} />
                    <div>
                        <h1 className="text-2xl font-bold">AI Resume Enhancer</h1>
                        <p className="text-sm md:text-base">
                            Optimize your CV for recruiters and ATS systems in seconds
                        </p>
                    </div>
                </div>
            </div>

            {/* HEADER / NAVBAR */}
            <header className="bg-gradient-to-r from-blue-900 to-blue-800 p-4 flex justify-center md:justify-end gap-6 sticky top-0 z-40">
                <button onClick={() => scrollTo("platform")} className="text-white font-medium hover:underline">
                    Platform
                </button>
                <button onClick={() => scrollTo("ai-tools")} className="text-white font-medium hover:underline">
                    AI Tools
                </button>
                <button onClick={() => scrollTo("contact")} className="text-white font-medium hover:underline">
                    Contact
                </button>
                <button onClick={() => {
                    localStorage.removeItem("token");
                    router.push("/login");
                }} className="text-white font-medium hover:underline bg-red-600 px-3 py-1 rounded">
                    Logout
                </button>
            </header>

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
            <section className="max-w-4xl mx-auto -mt-12 mb-16 bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-xl transition-colors">
                <textarea
                    rows={8}
                    placeholder="Paste your resume here..."
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    className="w-full p-4 rounded-xl border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                />

                <div className="flex flex-wrap gap-4 mt-5">
                    <button
                        onClick={enhanceResume}
                        disabled={loading}
                        className={`px-6 py-3 rounded-xl font-semibold text-white ${loading ? "bg-gray-400" : "bg-blue-800 hover:bg-blue-900"
                            } transition-colors`}
                    >
                        {loading ? "Processing..." : "Enhance Resume"}
                    </button>

                    <button
                        onClick={() => {
                            setText("");
                            setResult(null);
                        }}
                        className="px-6 py-3 rounded-xl font-semibold bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                    >
                        Clear
                    </button>

                    <button
                        onClick={exportPDF}
                        className="px-6 py-3 rounded-xl font-semibold bg-green-600 hover:bg-green-700 text-white transition-colors"
                    >
                        Export PDF
                    </button>

                    <button
                        onClick={exportDOCX}
                        className="px-6 py-3 rounded-xl font-semibold bg-indigo-600 hover:bg-indigo-700 text-white transition-colors"
                    >
                        Export DOCX
                    </button>

                    <button
                        onClick={exportJSON}
                        className="px-6 py-3 rounded-xl font-semibold bg-yellow-600 hover:bg-yellow-700 text-white transition-colors"
                    >
                        Export JSON
                    </button>
                </div>

                {loading && (
                    <div className="mt-8 animate-pulse">
                        <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
                        <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded w-full mb-2"></div>
                        <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded w-5/6"></div>
                    </div>
                )}

                {result && (
                    <div className="mt-10">
                        {/* TABS */}
                        <div className="flex gap-3 mb-5">
                            {[
                                ["enhanced", "Enhanced CV"],
                                ["bullets", "Bullet Points"],
                                ["keywords", "ATS Keywords"],
                            ].map(([key, label]) => (
                                <button
                                    key={key}
                                    onClick={() => setTab(key as Tab)}
                                    className={`px-4 py-2 rounded-lg font-semibold transition-colors ${tab === key
                                        ? "bg-blue-800 text-white"
                                        : "bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100 hover:bg-gray-300 dark:hover:bg-gray-600"
                                        }`}
                                >
                                    {label}
                                </button>
                            ))}
                        </div>

                        {/* CONTENT */}
                        <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-xl transition-colors">
                            {tab === "enhanced" && <p>{result.enhanced_text}</p>}
                            {tab === "bullets" && (
                                <ul className="list-disc pl-5">
                                    {result.bullet_points.map((b: string, i: number) => (
                                        <li key={i}>{b}</li>
                                    ))}
                                </ul>
                            )}
                            {tab === "keywords" && <p>{result.ats_keywords.join(", ")}</p>}
                        </div>
                    </div>
                )}
            </section>

            {/* CONTACT SECTION */}
            <section id="contact" className="bg-gray-50 dark:bg-gray-800 text-center py-16 px-4">
                <h2 className="text-3xl font-bold mb-4">Contact</h2>
                <p className="text-gray-600 dark:text-gray-300">
                    For inquiries, reach us at <a href="mailto:asiereiz@ucm.es" className="underline text-blue-600 dark:text-blue-400">asiereiz@ucm.es</a>
                </p>
            </section>

            {/* FOOTER */}
            <footer className="bg-gray-900 dark:bg-gray-950 text-gray-300 dark:text-gray-400 p-8 flex justify-between items-center transition-colors">
                <p className="text-sm">© 2025 AI Resume Enhancer · Warsaw Management University</p>
                <Image src="/logo-mans-www.png" alt="Logo" width={120} height={55} />
            </footer>
        </main>
    );
}
