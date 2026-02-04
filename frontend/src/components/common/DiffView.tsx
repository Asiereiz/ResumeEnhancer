"use client";

import React, { useMemo } from 'react';
import { diffWords } from 'diff';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface DiffViewProps {
    original: string;
    enhanced: string;
    className?: string;
}

export function DiffView({ original, enhanced, className }: DiffViewProps) {
    const diff = useMemo(() => {
        if (!original || !enhanced) return [];
        return diffWords(original, enhanced);
    }, [original, enhanced]);

    return (
        <div className={twMerge("p-4 bg-white dark:bg-slate-900 rounded-lg border border-gray-200 dark:border-gray-700 font-mono text-sm leading-relaxed overflow-x-auto", className)}>
            {diff.map((part, index) => {
                const color = part.added
                    ? 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300'
                    : part.removed
                        ? 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300 line-through decoration-red-500/50'
                        : 'text-gray-700 dark:text-gray-300';

                return (
                    <span key={index} className={clsx(color, "px-0.5 rounded")}>
                        {part.value}
                    </span>
                );
            })}
        </div>
    );
}
