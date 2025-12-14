/**
 * Formats the error cause into a readable string
 */
function formatErrorCause(cause: unknown): string {
  return (Array.isArray(cause) ? cause : [cause])
    .map((item: string | Error) => item instanceof Error ? item.message : String(item))
    .join('\n');
}

/**
 * Extracts a readable error message
 */
export function getErrorMessage(error: unknown) {
  if (error instanceof Error) {
    const details = error.cause
      ? `\nDetails:\n${formatErrorCause(error.cause)}`
      : '';

    return `${error.message}${details}`;
  }

  return String(error);
}
