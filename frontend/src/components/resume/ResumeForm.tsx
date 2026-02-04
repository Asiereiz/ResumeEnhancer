import Loader from "../ui/Loader";

interface ResumeFormProps {
    text: string;
    setText: (text: string) => void;
    loading: boolean;
    onEnhance: () => void;
    onClear: () => void;
    onExportPDF: () => void;
    onExportDOCX: () => void;
    onExportJSON: () => void;
}

export default function ResumeForm({
    text,
    setText,
    loading,
    onEnhance,
    onClear,
    onExportPDF,
    onExportDOCX,
    onExportJSON
}: ResumeFormProps) {
    return (
        <div className="flex flex-col md:flex-row gap-4 mt-5 overflow-x-auto pb-2">
            <button
                onClick={onEnhance}
                disabled={loading}
                className={`flex-shrink-0 px-6 py-3 rounded-xl font-bold text-white shadow-lg transform transition-all hover:-translate-y-1 hover:shadow-xl active:translate-y-0 ${loading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900"
                    }`}
            >
                {loading ? <Loader /> : "✨ Enhance Resume"}
            </button>

            <button
                onClick={onClear}
                className="flex-shrink-0 px-5 py-3 rounded-xl font-bold bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 shadow-md transition-all hover:-translate-y-0.5"
            >
                🧹 Clear
            </button>

            <div className="w-px bg-gray-300 dark:bg-gray-600 mx-2 hidden md:block"></div>

            <button
                onClick={onExportPDF}
                className="flex-shrink-0 px-5 py-3 rounded-xl font-bold bg-gradient-to-r from-green-500 to-green-700 text-white shadow-md hover:from-green-600 hover:to-green-800 hover:shadow-lg transition-all hover:-translate-y-0.5"
            >
                📄 PDF
            </button>

            <button
                onClick={onExportDOCX}
                className="flex-shrink-0 px-5 py-3 rounded-xl font-bold bg-gradient-to-r from-indigo-500 to-indigo-700 text-white shadow-md hover:from-indigo-600 hover:to-indigo-800 hover:shadow-lg transition-all hover:-translate-y-0.5"
            >
                📝 DOCX
            </button>

            <button
                onClick={onExportJSON}
                className="flex-shrink-0 px-5 py-3 rounded-xl font-bold bg-gradient-to-r from-yellow-500 to-yellow-700 text-white shadow-md hover:from-yellow-600 hover:to-yellow-800 hover:shadow-lg transition-all hover:-translate-y-0.5"
            >
                ⚙️ JSON
            </button>
        </div>
    );
}
