"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Copy } from "lucide-react";
import { JsonHighlighter } from "@/components/JsonHighlighter";
import { recursivelyDeserializeJSON } from "@/lib/json-deserializer";

export default function ResultsPage() {
  const [outputJson, setOutputJson] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const inputJson = sessionStorage.getItem("inputJson");

    if (!inputJson) {
      router.push("/");
      return;
    }

    try {
      const parsed = JSON.parse(inputJson);
      const processed = recursivelyDeserializeJSON(parsed);
      const prettyPrinted = JSON.stringify(processed, null, 2)
        .replace(/\\n/g, "\n")
        .replace(/\\t/g, "\t")
        .replace(/\\r/g, "\r");

      setOutputJson(prettyPrinted);
      setIsLoading(false);
    } catch (err) {
      setError(
        `Error processing JSON: ${
          err instanceof Error ? err.message : "Unknown error"
        }`
      );
      setIsLoading(false);
    }
  }, [router]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(outputJson);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const handleBackToInput = () => {
    router.push("/");
  };

  const handleTransformNew = () => {
    sessionStorage.removeItem("inputJson");
    router.push("/");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-800 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Processing JSON...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-red-600 dark:text-red-400 mb-2">
              Processing Error
            </h2>
            <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
            <button
              onClick={handleBackToInput}
              className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
            >
              Back to Input
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-800">
      <div className="bg-white dark:bg-gray-700 shadow-sm border-b border-gray-200 dark:border-gray-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Transformed JSON
              </h1>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                Your JSON has been recursively deserialized and pretty-printed
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleCopy}
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors text-sm font-medium flex items-center gap-2"
              >
                <Copy size={16} />
                Copy JSON
              </button>
              <button
                onClick={handleTransformNew}
                className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors text-sm font-medium"
              >
                Transform New
              </button>
              <button
                onClick={handleBackToInput}
                className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors text-sm font-medium"
              >
                Back to Input
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white dark:bg-gray-700 rounded-lg shadow-lg">
          <div className="p-6">
            <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 overflow-auto max-h-[calc(100vh-250px)]">
              <JsonHighlighter json={outputJson} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
