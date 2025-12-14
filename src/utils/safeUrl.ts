import { safePath } from '@/utils/safePath';
import { safeString } from '@/utils/safeString';

/**
 *  Returns a safe URL string
 */
export function safeUrl(path: string): string {
  return safeString((safePath(path)));
}
