import Image from "next/image";

export default function Footer() {
    return (
        <footer className="bg-gray-900 dark:bg-gray-950 text-gray-300 dark:text-gray-400 p-8 flex justify-between items-center transition-colors">
            <p className="text-sm">© 2025 AI Resume Enhancer · Warsaw Management University</p>
            <Image src="/logo-mans-www.png" alt="Logo" width={120} height={55} />
        </footer>
    );
}
