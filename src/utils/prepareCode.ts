const STYLE_OPEN_TAG = /<style\b/gi;
const STYLE_CLOSE_TAG = /<\/style\b/gi;

/**
 * Replaces `<style>` tags with custom component syntax
 * @desc `compileTemplate` removes standard `<style>` tags during compilation
 */
export function prepareCode (code: string): string {
  return code
    .replace(STYLE_OPEN_TAG, '<component is="style"')
    .replace(STYLE_CLOSE_TAG, '</component');
}
