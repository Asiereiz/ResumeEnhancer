import { ResumeResult } from "@/types";
import { useState } from "react";
import { DiffView } from "@/components/common/DiffView";
import { Copy, Check, FileText, List, Search, GitCompare } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface ResultsDisplayProps {
    result: ResumeResult;
    originalText: string;
}

type Tab = "enhanced" | "bullets" | "keywords" | "diff";

export default function ResultsDisplay({ result, originalText }: ResultsDisplayProps) {
    const [tab, setTab] = useState<Tab>("enhanced");
    const [copiedIndex, setCopiedIndex] = useState<number | string | null>(null);

    const handleCopy = (text: string, id: number | string) => {
        navigator.clipboard.writeText(text);
        setCopiedIndex(id);
        setTimeout(() => setCopiedIndex(null), 2000);
    };

    const tabs = [
        { id: "enhanced", label: "Enhanced CV", icon: FileText },
        { id: "bullets", label: "Bullet Points", icon: List },
        { id: "keywords", label: "ATS Keywords", icon: Search },
        { id: "diff", label: "Diff View", icon: GitCompare },
    ];

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-10"
        >
            {/* SCORES SUMMARY */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <div className="bg-primary-50 dark:bg-primary-900/20 border border-primary-200 dark:border-primary-800 p-6 rounded-2xl text-center relative overflow-hidden group">
                    <div className="absolute inset-0 bg-primary-100/50 dark:bg-primary-800/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <h3 className="relative z-10 text-lg font-bold text-primary-900 dark:text-primary-100 mb-2">ATS Score</h3>
                    <div className="relative z-10 text-4xl font-black text-primary-600 dark:text-primary-300">
                        {result.ats_score}<span className="text-xl text-primary-400">/100</span>
                    </div>
                </div>

                <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 p-6 rounded-2xl text-center relative overflow-hidden">
                    <h3 className="text-lg font-bold text-emerald-900 dark:text-emerald-100 mb-2">Readability (Flesch)</h3>
                    <div className="flex justify-center items-center gap-3">
                        <div className="flex flex-col">
                            <span className="text-xs uppercase tracking-wider text-emerald-600/70 dark:text-emerald-400">Original</span>
                            <span className="font-mono text-lg text-emerald-700 dark:text-emerald-300">
                                {result.original_readability_flesch ? Math.round(result.original_readability_flesch) : "-"}
                            </span>
                        </div>
                        <span className="text-emerald-400">→</span>
                        <div className="flex flex-col">
                            <span className="text-xs uppercase tracking-wider text-emerald-600/70 dark:text-emerald-400">Enhanced</span>
                            <span className="font-mono text-3xl font-bold text-emerald-600 dark:text-emerald-300">
                                {result.readability_flesch ? Math.round(result.readability_flesch) : "N/A"}
                            </span>
                        </div>
                    </div>
                    <p className="text-xs text-emerald-600/70 dark:text-emerald-400 mt-2 font-medium">(Higher is easier)</p>
                </div>

                <div className="bg-violet-50 dark:bg-violet-900/20 border border-violet-200 dark:border-violet-800 p-6 rounded-2xl text-center relative overflow-hidden">
                    <h3 className="text-lg font-bold text-violet-900 dark:text-violet-100 mb-2">Grade Level</h3>
                    <div className="flex justify-center items-center gap-3">
                        <div className="flex flex-col">
                            <span className="text-xs uppercase tracking-wider text-violet-600/70 dark:text-violet-400">Original</span>
                            <span className="font-mono text-lg text-violet-700 dark:text-violet-300">
                                {result.original_readability_kincaid ? Math.round(result.original_readability_kincaid) : "-"}
                            </span>
                        </div>
                        <span className="text-violet-400">→</span>
                        <div className="flex flex-col">
                            <span className="text-xs uppercase tracking-wider text-violet-600/70 dark:text-violet-400">Enhanced</span>
                            <span className="font-mono text-3xl font-bold text-violet-600 dark:text-violet-300">
                                {result.readability_kincaid ? Math.round(result.readability_kincaid) : "N/A"}
                            </span>
                        </div>
                    </div>
                    <p className="text-xs text-violet-600/70 dark:text-violet-400 mt-2 font-medium">(Lower is better)</p>
                </div>
            </div>

            {/* TABS */}
            <div className="flex flex-wrap gap-2 mb-6 p-1 bg-gray-100 dark:bg-slate-800/50 rounded-xl backdrop-blur-sm">
                {tabs.map((t) => {
                    const Icon = t.icon;
                    const isActive = tab === t.id;
                    return (
                        <button
                            key={t.id}
                            onClick={() => setTab(t.id as Tab)}
                            className={`
                                flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200
                                ${isActive
                                    ? "bg-white dark:bg-slate-700 text-primary-600 dark:text-primary-300 shadow-sm ring-1 ring-black/5 dark:ring-white/5"
                                    : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-200/50 dark:hover:bg-slate-700/50"
                                }
                            `}
                        >
                            <Icon size={16} />
                            {t.label}
                        </button>
                    )
                })}
            </div>

            {/* CONTENT */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-sm min-h-[400px]">
                <div className="p-6">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={tab}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.2 }}
                        >
                            {tab === "enhanced" && (
                                <div className="relative group">
                                    <button
                                        onClick={() => handleCopy(result.enhanced_text, "enhanced-main")}
                                        className="absolute top-0 right-0 p-2 text-gray-400 hover:text-primary-600 transition-colors"
                                        title="Copy text"
                                    >
                                        {copiedIndex === "enhanced-main" ? <Check size={18} className="text-green-500" /> : <Copy size={18} />}
                                    </button>
                                    <p className="whitespace-pre-wrap leading-relaxed text-gray-700 dark:text-gray-300 text-lg font-light">
                                        {result.enhanced_text}
                                    </p>
                                </div>
                            )}

                            {tab === "bullets" && (
                                <ul className="space-y-4">
                                    {result.bullet_points.map((b: string, i: number) => (
                                        <li key={i} className="flex gap-4 p-4 rounded-xl bg-gray-50 dark:bg-slate-900/50 hover:bg-white hover:shadow-md transition-all border border-transparent hover:border-gray-100 dark:hover:border-slate-700 group">
                                            <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-primary-600 dark:text-primary-400 text-sm font-bold mt-0.5">
                                                {i + 1}
                                            </div>
                                            <p className="flex-grow text-gray-700 dark:text-gray-300 leading-relaxed">{b}</p>
                                            <button
                                                onClick={() => handleCopy(b, i)}
                                                className="opacity-0 group-hover:opacity-100 p-2 text-gray-400 hover:text-primary-600 transition-all"
                                                title="Copy bullet"
                                            >
                                                {copiedIndex === i ? <Check size={16} className="text-green-500" /> : <Copy size={16} />}
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            )}

                            {tab === "keywords" && (
                                <div className="flex flex-wrap gap-2">
                                    {result.ats_keywords.map((k, i) => (
                                        <span key={i} className="px-3 py-1.5 rounded-full bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 text-sm font-medium border border-blue-100 dark:border-blue-800">
                                            #{k}
                                        </span>
                                    ))}
                                </div>
                            )}

                            {tab === "diff" && (
                                <DiffView original={originalText} enhanced={result.enhanced_text} />
                            )}
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>
        </motion.div>
    );
}
