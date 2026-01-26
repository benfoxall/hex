import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock window.matchMedia for tests
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // deprecated
    removeListener: vi.fn(), // deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Mock URL.createObjectURL and revokeObjectURL
global.URL.createObjectURL = vi.fn(() => 'blob:mock-url');
global.URL.revokeObjectURL = vi.fn();

// Mock ResizeObserver for @tanstack/react-virtual
if (typeof global.ResizeObserver === 'undefined') {
  global.ResizeObserver = class ResizeObserver {
    constructor(callback) {
      this.callback = callback;
      this.observations = new Map();
    }
    observe(target) {
      // Provide reasonable default dimensions for test environment
      const mockWidth = 1024;
      const mockHeight = 768;
      this.observations.set(target, { clientWidth: mockWidth, clientHeight: mockHeight });
      // Trigger callback immediately with mock entry
      this.callback([
        {
          target,
          contentRect: { width: mockWidth, height: mockHeight, top: 0, left: 0, bottom: mockHeight, right: mockWidth },
        },
      ], this);
    }
    unobserve(target) {
      this.observations.delete(target);
    }
    disconnect() {
      this.observations.clear();
    }
  };
}

// Mock Blob.arrayBuffer() for jsdom compatibility
if (typeof Blob !== 'undefined' && !Blob.prototype.arrayBuffer) {
  Blob.prototype.arrayBuffer = function() {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        resolve(reader.result);
      };
      reader.onerror = () => {
        reject(new Error('Failed to read blob as array buffer'));
      };
      reader.readAsArrayBuffer(this);
    });
  };
}

// Mock File.arrayBuffer() for jsdom compatibility
if (typeof File !== 'undefined' && !File.prototype.arrayBuffer) {
  File.prototype.arrayBuffer = function() {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        resolve(reader.result);
      };
      reader.onerror = () => {
        reject(new Error('Failed to read file as array buffer'));
      };
      reader.readAsArrayBuffer(this);
    });
  };
}

