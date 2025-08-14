"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const [inputJson, setInputJson] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputJson(e.target.value);
    setError("");
  };

  const handleTransform = () => {
    if (!inputJson.trim()) {
      setError("Please enter some JSON to transform");
      return;
    }

    try {
      JSON.parse(inputJson);
      sessionStorage.setItem("inputJson", inputJson);
      router.push("/results");
    } catch (err) {
      setError(
        `Invalid JSON: ${err instanceof Error ? err.message : "Unknown error"}`
      );
    }
  };

  const handleClear = () => {
    setInputJson("");
    setError("");
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-800">
      <div className="bg-white dark:bg-gray-700 shadow-sm border-b border-gray-200 dark:border-gray-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Recursive JSON Visualizer
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Transform JSON with serialized strings into readable,
              pretty-printed format
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white dark:bg-gray-700 rounded-lg shadow-lg p-6">
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Paste Your JSON
              </h2>
              <button
                onClick={handleClear}
                className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors text-sm font-medium"
              >
                Clear
              </button>
            </div>

            <textarea
              value={inputJson}
              onChange={handleInputChange}
              placeholder="Paste your JSON here... The tool will recursively deserialize any nested JSON strings and pretty-print the result."
              className="w-full h-96 p-4 border border-gray-300 dark:border-gray-600 rounded-lg font-mono text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-gray-500 focus:border-transparent resize-none"
            />

            <div className="flex items-center justify-between mt-4">
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {inputJson.length} characters
              </span>

              <button
                onClick={handleTransform}
                disabled={!inputJson.trim()}
                className="px-8 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium text-lg"
              >
                Transform JSON
              </button>
            </div>

            {error && (
              <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                <p className="text-sm text-red-600 dark:text-red-400 font-medium">
                  {error}
                </p>
              </div>
            )}
          </div>

          <div className="border-t border-gray-200 dark:border-gray-600 pt-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">
              How it works:
            </h3>
            <ul className="space-y-2 text-gray-600 dark:text-gray-400">
              <li className="flex items-start">
                <span className="text-green-500 mr-2">•</span>
                Detects JSON strings within your data and recursively
                deserializes them
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">•</span>
                Handles multiple levels of nested serialization
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">•</span>
                Converts escaped newlines (\n) to actual line breaks
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">•</span>
                Pretty-prints the result with syntax highlighting
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
