import { renderHook } from '@testing-library/react-hooks';
import { TestApp } from './TestApp';

const renderHookWithWrapper = (hook) => renderHook(hook, { wrapper: TestApp });

export { renderHookWithWrapper };
