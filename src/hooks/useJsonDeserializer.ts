import { useState, useCallback } from "react";

// Function to recursively deserialize JSON strings within an object
function recursivelyDeserializeJSON(obj: any): any {
  if (obj === null || obj === undefined) {
    return obj;
  }

  if (typeof obj === "string") {
    // Try to parse the string as JSON
    try {
      const parsed = JSON.parse(obj);
      // If successful, recursively process the parsed object
      return recursivelyDeserializeJSON(parsed);
    } catch {
      // If parsing fails, return the original string
      return obj;
    }
  }

  if (Array.isArray(obj)) {
    // Recursively process each element in the array
    return obj.map((item) => recursivelyDeserializeJSON(item));
  }

  if (typeof obj === "object") {
    // Recursively process each property in the object
    const result: any = {};
    for (const [key, value] of Object.entries(obj)) {
      result[key] = recursivelyDeserializeJSON(value);
    }
    return result;
  }

  // For primitive types (number, boolean), return as-is
  return obj;
}

export function useJsonDeserializer() {
  const [inputJson, setInputJson] = useState("");
  const [outputJson, setOutputJson] = useState("");
  const [error, setError] = useState("");

  const processJson = useCallback((jsonString: string) => {
    if (!jsonString.trim()) {
      setOutputJson("");
      setError("");
      return;
    }

    try {
      // First, parse the input JSON
      const parsed = JSON.parse(jsonString);

      // Then recursively deserialize any nested JSON strings
      const processed = recursivelyDeserializeJSON(parsed);

      // Pretty print the result and convert escaped newlines to actual newlines
      const prettyPrinted = JSON.stringify(processed, null, 2)
        .replace(/\\n/g, "\n")
        .replace(/\\t/g, "\t")
        .replace(/\\r/g, "\r");

      setOutputJson(prettyPrinted);
      setError("");
    } catch (err) {
      setError(
        `Invalid JSON: ${err instanceof Error ? err.message : "Unknown error"}`
      );
      setOutputJson("");
    }
  }, []);

  const handleInputChange = useCallback(
    (value: string) => {
      setInputJson(value);
      processJson(value);
    },
    [processJson]
  );

  const clearAll = useCallback(() => {
    setInputJson("");
    setOutputJson("");
    setError("");
  }, []);

  const loadSampleData = useCallback(() => {
    const sampleJson = {
      name: "John Doe",
      age: 30,
      address: {
        street: "123 Main St",
        city: "New York",
      },
      metadata:
        '{"timestamp": "2023-01-01T00:00:00Z", "source": "api", "nested": "{\\"level\\": 2, \\"data\\": [1, 2, 3]}"}',
      body: '{"message": "Hello World", "details": "{\\"priority\\": \\"high\\", \\"tags\\": [\\"urgent\\", \\"important\\"]}"}',
      items: [
        { id: 1, data: '{"type": "A", "value": 100}' },
        { id: 2, data: '{"type": "B", "value": 200}' },
      ],
    };

    const jsonString = JSON.stringify(sampleJson, null, 2);
    handleInputChange(jsonString);
  }, [handleInputChange]);

  return {
    inputJson,
    outputJson,
    error,
    handleInputChange,
    clearAll,
    loadSampleData,
  };
}
