import React, { useMemo } from 'react';
import { diffWords } from 'diff';
import { motion } from 'framer-motion';

interface DiffViewProps {
    original: string;
    enhanced: string;
}

export const DiffView: React.FC<DiffViewProps> = ({ original, enhanced }) => {
    const differences = useMemo(() => {
        return diffWords(original || "", enhanced || "");
    }, [original, enhanced]);

    return (
        <div className="p-4 bg-white dark:bg-slate-900 rounded-lg shadow-inner border border-slate-200 dark:border-slate-700 font-mono text-sm leading-relaxed whitespace-pre-wrap">
            {differences.map((part, index) => {
                const color = part.added
                    ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300'
                    : part.removed
                        ? 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 line-through decoration-red-500'
                        : 'text-slate-600 dark:text-slate-400';

                return (
                    <motion.span
                        key={index}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: index * 0.001 }}
                        className={`${color} px-0.5 rounded transition-colors`}
                    >
                        {part.value}
                    </motion.span>
                );
            })}
        </div>
    );
};
