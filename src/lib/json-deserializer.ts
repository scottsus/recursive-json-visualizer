export function recursivelyDeserializeJSON(obj: any): any {
  if (obj === null || obj === undefined) {
    return obj;
  }

  if (typeof obj === "string") {
    try {
      const parsed = JSON.parse(obj);
      return recursivelyDeserializeJSON(parsed);
    } catch {
      return obj;
    }
  }

  if (Array.isArray(obj)) {
    return obj.map((item) => recursivelyDeserializeJSON(item));
  }

  if (typeof obj === "object") {
    const result: any = {};
    for (const [key, value] of Object.entries(obj)) {
      result[key] = recursivelyDeserializeJSON(value);
    }
    return result;
  }

  return obj;
}
