import { renderHook, act } from '@testing-library/react-hooks';
import { useToggle } from '../hooks/useToggle';

describe('useToggle', () => {
  test('should set value when called with argument', () => {
    const { result } = renderHook(() => useToggle());
    act(() => {
      result.current[1](true);
    });
    expect(result.current[0]).toBe(true);
    act(() => {
      result.current[1](false);
    });
    expect(result.current[0]).toBe(false);
  });

  test('should toggle value when called', () => {
    const { result } = renderHook(() => useToggle());
    act(() => {
      result.current[1]();
    });
    expect(result.current[0]).toBe(true);
    act(() => {
      result.current[1]();
    });
    expect(result.current[0]).toBe(false);
  });
});
