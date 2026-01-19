import { describe, it, expect } from 'vitest';

// TODO: These tests currently replicate the logic from Hex.jsx rather than importing
// the actual functions. In the future, consider refactoring Hex.jsx to export
// testable functions like:
// - export const formatHexPairs = (u8, size) => { ... }
// - export const formatAscii = (u8) => { ... }
// - export const formatRowAddress = (index, bytesPerRow) => { ... }
// This would allow testing the actual implementation instead of duplicating logic.

describe('HexPairs conversion', () => {
  // Test hex conversion logic directly
  it('should convert bytes to hex pairs', () => {
    const u8 = new Uint8Array([0x48, 0x65, 0x6c, 0x6c, 0x6f]); // "Hello"
    const result = u8.reduce((acc, value) => {
      return acc + value.toString(16).padStart(2, '0') + ' ';
    }, '');
    
    expect(result).toBe('48 65 6c 6c 6f ');
  });

  it('should pad single digit hex values', () => {
    const u8 = new Uint8Array([0x00, 0x01, 0x0f, 0x10]);
    const result = u8.reduce((acc, value) => {
      return acc + value.toString(16).padStart(2, '0') + ' ';
    }, '');
    
    expect(result).toBe('00 01 0f 10 ');
  });

  it('should handle all byte values', () => {
    const u8 = new Uint8Array([0x00, 0x7f, 0x80, 0xff]);
    const result = u8.reduce((acc, value) => {
      return acc + value.toString(16).padStart(2, '0') + ' ';
    }, '');
    
    expect(result).toBe('00 7f 80 ff ');
  });
});

describe('Ascii conversion', () => {
  it('should convert printable ASCII characters', () => {
    const u8 = new Uint8Array([0x48, 0x65, 0x6c, 0x6c, 0x6f]); // "Hello"
    const result = Array.from(u8, (value) =>
      value < 33 ||
      value == 0x7f ||
      value === 173 ||
      (value >= 129 && value <= 159)
        ? '.'
        : String.fromCharCode(value)
    ).join('');
    
    expect(result).toBe('Hello');
  });

  it('should replace non-printable characters with dots', () => {
    const u8 = new Uint8Array([0x00, 0x01, 0x20, 0x41]); // null, SOH, space, A
    const result = Array.from(u8, (value) =>
      value < 33 ||
      value == 0x7f ||
      value === 173 ||
      (value >= 129 && value <= 159)
        ? '.'
        : String.fromCharCode(value)
    ).join('');
    
    expect(result).toBe('...A');
  });

  it('should handle DEL character (0x7f)', () => {
    const u8 = new Uint8Array([0x41, 0x7f, 0x42]); // A, DEL, B
    const result = Array.from(u8, (value) =>
      value < 33 ||
      value == 0x7f ||
      value === 173 ||
      (value >= 129 && value <= 159)
        ? '.'
        : String.fromCharCode(value)
    ).join('');
    
    expect(result).toBe('A.B');
  });

  it('should handle soft hyphen (173)', () => {
    const u8 = new Uint8Array([0x41, 173, 0x42]); // A, soft hyphen, B
    const result = Array.from(u8, (value) =>
      value < 33 ||
      value == 0x7f ||
      value === 173 ||
      (value >= 129 && value <= 159)
        ? '.'
        : String.fromCharCode(value)
    ).join('');
    
    expect(result).toBe('A.B');
  });

  it('should handle control characters (129-159)', () => {
    const u8 = new Uint8Array([0x41, 129, 159, 160, 0x42]); // A, control chars, no-break space, B
    const result = Array.from(u8, (value) =>
      value < 33 ||
      value == 0x7f ||
      value === 173 ||
      (value >= 129 && value <= 159)
        ? '.'
        : String.fromCharCode(value)
    ).join('');
    
    expect(result).toBe('A..' + String.fromCharCode(160) + 'B');
  });

  it('should handle mixed content', () => {
    const u8 = new Uint8Array([
      0x48, 0x65, 0x6c, 0x6c, 0x6f, // "Hello"
      0x00,                         // null
      0x57, 0x6f, 0x72, 0x6c, 0x64  // "World"
    ]);
    const result = Array.from(u8, (value) =>
      value < 33 ||
      value == 0x7f ||
      value === 173 ||
      (value >= 129 && value <= 159)
        ? '.'
        : String.fromCharCode(value)
    ).join('');
    
    expect(result).toBe('Hello.World');
  });
});

describe('Row address formatting', () => {
  it('should format row address as hex with dot padding', () => {
    const index = 0;
    const bytesPerRow = 16;
    const address = (index * bytesPerRow).toString(16).padStart(4, '.');
    expect(address).toBe('...0');
  });

  it('should format larger addresses', () => {
    const index = 16;
    const bytesPerRow = 16;
    const address = (index * bytesPerRow).toString(16).padStart(4, '.');
    expect(address).toBe('.100');
  });

  it('should handle large row numbers', () => {
    const index = 256;
    const bytesPerRow = 16;
    const address = (index * bytesPerRow).toString(16).padStart(4, '.');
    expect(address).toBe('1000');
  });
});
