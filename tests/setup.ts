import { vi, afterEach } from 'vitest';

vi.mock('@vue/compiler-sfc', () => ({ compile: vi.fn() }));

afterEach(() => {
  vi.clearAllMocks();
});
