"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";

interface HeaderProps {
    onScrollTo: (id: string) => void;
}

export default function Header({ onScrollTo }: HeaderProps) {
    const router = useRouter();

    return (
        <>
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

            {/* NAVBAR */}
            <header className="bg-gradient-to-r from-blue-900 to-blue-800 p-4 flex justify-center md:justify-end gap-4 sticky top-0 z-40 shadow-lg">
                {["platform", "history", "ai-tools", "contact"].map((section) => (
                    <button
                        key={section}
                        onClick={() => section === "history" ? router.push("/history") : onScrollTo(section)}
                        className="text-white font-semibold px-4 py-2 rounded-lg transition-all hover:bg-white/10 hover:shadow-md active:scale-95 capitalize"
                    >
                        {section.replace("-", " ")}
                    </button>
                ))}

                <button
                    onClick={() => {
                        localStorage.removeItem("token");
                        router.push("/login");
                    }}
                    className="text-white font-bold bg-red-600 hover:bg-red-700 px-5 py-2 rounded-lg shadow-md transition-all hover:-translate-y-0.5"
                >
                    Logout
                </button>
            </header>
        </>
    );
}
