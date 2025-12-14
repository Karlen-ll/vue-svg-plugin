import { SFCTemplateCompileResults } from '@vue/compiler-sfc';

export const TEST_PATH = 'test.svg';
export const TEST_CODE = '<svg></svg>';
export const TEST_URL = `export default "${TEST_PATH}"`;
export const TEST_DATA = { importType: 'component', code: TEST_CODE, path: TEST_PATH };

export const MOCK_COMPILE_SUCCESS = { code: 'function render() { return "" }' } as SFCTemplateCompileResults;
export const MOCK_COMPILE_ERROR = { errors: ['Compilation error'] } as SFCTemplateCompileResults;

export const MOCK_TRANSFORM_RESULT = {
  code: `${MOCK_COMPILE_SUCCESS.code}\nexport default { render }`,
  tips: undefined,
};
