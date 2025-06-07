"use client";

import React from 'react';

interface EsgErrorMessageProps {
  error: string;
}

export default function EsgErrorMessage({ error }: EsgErrorMessageProps) {
  return (
    <div className="bg-red-100 dark:bg-red-900/50 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-300 px-4 py-3 rounded mb-4">
      <p>{error}</p>
    </div>
  );
} 