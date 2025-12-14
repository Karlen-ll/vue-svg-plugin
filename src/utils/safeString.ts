/**
 * Stringifies value to safely embed in generated code and prevent injection
 */
export function safeString(value?: string | null): string {
  return JSON.stringify(value);
}
