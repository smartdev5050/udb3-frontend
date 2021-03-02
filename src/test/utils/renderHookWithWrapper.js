import { renderHook } from '@testing-library/react-hooks';
import App from '@/pages/_app';

const renderHookWithWrapper = (hook) => renderHook(hook, { wrapper: App });

export { renderHookWithWrapper };
