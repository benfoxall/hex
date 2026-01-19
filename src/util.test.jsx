import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, renderHook } from '@testing-library/react';
import { act } from 'react';
import React from 'react';
import { ByteSize, useObjectURL, useMedia } from './util';

describe('ByteSize', () => {
  it('should render formatted bytes', () => {
    render(<ByteSize bytes={1024} />);
    // Check that it contains 'kB' - the exact format may vary
    expect(screen.getByText(/kB/)).toBeInTheDocument();
  });

  it('should format 0 bytes', () => {
    render(<ByteSize bytes={0} />);
    expect(screen.getByText('0 B')).toBeInTheDocument();
  });

  it('should format large numbers', () => {
    render(<ByteSize bytes={1024 * 1024} />);
    // Check that it contains 'MB' - the exact format may vary
    expect(screen.getByText(/MB/)).toBeInTheDocument();
  });
});

describe('useObjectURL', () => {
  beforeEach(() => {
    // Mock URL.createObjectURL and URL.revokeObjectURL
    global.URL.createObjectURL = vi.fn(() => 'blob:mock-url');
    global.URL.revokeObjectURL = vi.fn();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should create object URL for blob', () => {
    const blob = new Blob(['test']);
    const { result } = renderHook(() => useObjectURL(blob));
    
    expect(global.URL.createObjectURL).toHaveBeenCalledWith(blob);
    expect(result.current).toBe('blob:mock-url');
  });

  it('should return undefined for no blob', () => {
    const { result } = renderHook(() => useObjectURL(null));
    expect(result.current).toBeFalsy();
  });

  it('should revoke URL on unmount', () => {
    const blob = new Blob(['test']);
    const { unmount } = renderHook(() => useObjectURL(blob));
    
    unmount();
    
    expect(global.URL.revokeObjectURL).toHaveBeenCalledWith('blob:mock-url');
  });

  it('should create new URL when blob changes', () => {
    const blob1 = new Blob(['test1']);
    const blob2 = new Blob(['test2']);
    
    const { result, rerender } = renderHook(
      ({ blob }) => useObjectURL(blob),
      { initialProps: { blob: blob1 } }
    );
    
    const firstUrl = result.current;
    expect(firstUrl).toBe('blob:mock-url');
    
    // Mock a different URL for the second blob
    global.URL.createObjectURL = vi.fn(() => 'blob:mock-url-2');
    
    rerender({ blob: blob2 });
    
    expect(result.current).toBe('blob:mock-url-2');
  });
});

describe('useMedia', () => {
  let mockMatchMedia;

  beforeEach(() => {
    mockMatchMedia = vi.fn();
    window.matchMedia = mockMatchMedia;
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should return true when media query matches', () => {
    const listeners = [];
    mockMatchMedia.mockReturnValue({
      matches: true,
      addEventListener: vi.fn((event, cb) => listeners.push(cb)),
      removeEventListener: vi.fn(),
    });

    const { result } = renderHook(() => useMedia('(max-width: 800px)'));
    
    expect(result.current).toBe(true);
    expect(mockMatchMedia).toHaveBeenCalledWith('(max-width: 800px)');
  });

  it('should return false when media query does not match', () => {
    const listeners = [];
    mockMatchMedia.mockReturnValue({
      matches: false,
      addEventListener: vi.fn((event, cb) => listeners.push(cb)),
      removeEventListener: vi.fn(),
    });

    const { result } = renderHook(() => useMedia('(max-width: 800px)'));
    
    expect(result.current).toBe(false);
  });

  it('should update when media query changes', () => {
    let changeCallback;
    const mockMedia = {
      matches: false,
      addEventListener: vi.fn((event, cb) => {
        changeCallback = cb;
      }),
      removeEventListener: vi.fn(),
    };
    mockMatchMedia.mockReturnValue(mockMedia);

    const { result } = renderHook(() => useMedia('(max-width: 800px)'));
    
    expect(result.current).toBe(false);
    
    // Simulate media query change
    mockMedia.matches = true;
    act(() => {
      changeCallback();
    });
    
    expect(result.current).toBe(true);
  });

  it('should clean up event listener on unmount', () => {
    const mockRemoveEventListener = vi.fn();
    mockMatchMedia.mockReturnValue({
      matches: false,
      addEventListener: vi.fn(),
      removeEventListener: mockRemoveEventListener,
    });

    const { unmount } = renderHook(() => useMedia('(max-width: 800px)'));
    
    unmount();
    
    expect(mockRemoveEventListener).toHaveBeenCalled();
  });
});

