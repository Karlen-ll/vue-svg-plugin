/**
 * Creates export statement
 */
export function getExport(defaultValue: string, code = ''): string {
  return `${code ? code + '\n' : ''}export default ${defaultValue}`;
}
