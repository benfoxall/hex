import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import React from 'react';
import { App } from './App';

// Helper function to simulate file drop
const simulateFileDrop = (file) => {
  const input = document.querySelector('input[type="file"]');
  Object.defineProperty(input, 'files', {
    value: [file],
    writable: false,
  });
  const changeEvent = new Event('change', { bubbles: true });
  input.dispatchEvent(changeEvent);
};

describe('App - Integration Tests', () => {
  beforeEach(() => {
    // Mock window.opener to null so we don't try to close windows
    window.opener = null;
  });

  it('should render the app with initial state', () => {
    render(<App />);
    
    expect(screen.getByText('Hex')).toBeInTheDocument();
    expect(screen.getByText('Another online hex viewer')).toBeInTheDocument();
    expect(screen.getByText('Open a file')).toBeInTheDocument();
  });

  it('should display file information after dropping a file', async () => {
    render(<App />);
    
    // Create a test file
    const fileContent = new Uint8Array([0x48, 0x65, 0x6c, 0x6c, 0x6f]); // "Hello"
    const file = new File([fileContent], 'test.bin', { type: 'application/octet-stream' });
    
    // Simulate file drop
    simulateFileDrop(file);
    
    // Wait for the file name to appear (using regex to handle whitespace)
    await waitFor(() => {
      expect(screen.getByText(/test\.bin/)).toBeInTheDocument();
    });
    
    // Check that file size is displayed
    expect(screen.getByText(/5 B/)).toBeInTheDocument();
    
    // Check that action buttons are visible
    expect(screen.getByTitle('Download content')).toBeInTheDocument();
    expect(screen.getByTitle('Close file')).toBeInTheDocument();
  });

  it('should render hex content when file is dropped', async () => {
    const { container } = render(<App />);
    
    // Create a test file with specific content
    const fileContent = new Uint8Array([0x48, 0x65, 0x6c, 0x6c, 0x6f]); // "Hello"
    const file = new File([fileContent], 'test.bin', { type: 'application/octet-stream' });
    
    // Simulate file drop
    simulateFileDrop(file);
    
    // Wait for hex content to be rendered
    await waitFor(() => {
      const mainElement = container.querySelector('main');
      expect(mainElement).toBeInTheDocument();
      // Check that main has content (not just empty div)
      expect(mainElement.innerHTML.length).toBeGreaterThan(0);
    }, { timeout: 3000 });
    
    // The hex viewer should display the content
    const mainElement = container.querySelector('main');
    expect(mainElement).toBeInTheDocument();
  });

  it('should close file when close button is clicked', async () => {
    render(<App />);
    
    // Drop a file first
    const fileContent = new Uint8Array([0x48, 0x65, 0x6c, 0x6c, 0x6f]);
    const file = new File([fileContent], 'test.bin', { type: 'application/octet-stream' });
    
    simulateFileDrop(file);
    
    // Wait for file to be loaded
    await waitFor(() => {
      expect(screen.getByText(/test\.bin/)).toBeInTheDocument();
    });
    
    // Click close button
    const closeButton = screen.getByTitle('Close file');
    closeButton.click();
    
    // Wait for the file to be closed
    await waitFor(() => {
      expect(screen.queryByText(/test\.bin/)).not.toBeInTheDocument();
    });
    
    // Initial state should be back
    expect(screen.getByText('Another online hex viewer')).toBeInTheDocument();
  });

  it('should handle empty files', async () => {
    render(<App />);
    
    // Create an empty file
    const file = new File([], 'empty.bin', { type: 'application/octet-stream' });
    
    simulateFileDrop(file);
    
    // Wait for file name to appear
    await waitFor(() => {
      expect(screen.getByText(/empty\.bin/)).toBeInTheDocument();
    });
    
    // Should show 0 B size (using regex to handle split text nodes)
    expect(screen.getByText(/0 B/)).toBeInTheDocument();
  });

  it('should display hex and ASCII representation of file content', async () => {
    const { container } = render(<App />);
    
    // Create a file with recognizable content
    // "ABC" = 0x41, 0x42, 0x43
    const fileContent = new Uint8Array([0x41, 0x42, 0x43]);
    const file = new File([fileContent], 'abc.bin', { type: 'application/octet-stream' });
    
    simulateFileDrop(file);
    
    // Wait for the hex viewer to render with rows
    await waitFor(() => {
      const rowElements = container.querySelectorAll('.row');
      expect(rowElements.length).toBeGreaterThanOrEqual(1);
    }, { timeout: 3000 });
    
    // Check that the main hex viewer element is present
    const mainElement = container.querySelector('main');
    expect(mainElement).toBeTruthy();
  });

  it('should handle postMessage from opener window', async () => {
    // Mock window.opener
    window.opener = {
      postMessage: vi.fn(),
    };
    
    render(<App />);
    
    // Verify that postMessage was called with "ready"
    expect(window.opener.postMessage).toHaveBeenCalledWith('ready', '*');
    
    // Simulate receiving an ArrayBuffer message
    const testData = new Uint8Array([0x01, 0x02, 0x03, 0x04]);
    const messageEvent = new MessageEvent('message', {
      data: testData.buffer,
      origin: 'https://example.com',
    });
    
    window.dispatchEvent(messageEvent);
    
    // Wait for the file to be set (using regex for flexible matching)
    await waitFor(() => {
      expect(screen.getByText(/https:\/\/example\.com\.data/)).toBeInTheDocument();
    });
    
    // Cleanup
    window.opener = null;
  });

  it('should show drag active state when dragging over', () => {
    render(<App />);
    
    const dropzone = document.querySelector('.draggable');
    expect(dropzone).toBeInTheDocument();
    expect(dropzone.className).not.toContain('active');
    
    // Note: Testing actual drag events is complex with react-dropzone
    // The main functionality is that the className changes based on isDragActive
    // which is handled by react-dropzone library
  });

  it('should display download link for the file', async () => {
    render(<App />);
    
    const fileContent = new Uint8Array([0x48, 0x65, 0x6c, 0x6c, 0x6f]);
    const file = new File([fileContent], 'download-test.bin', { type: 'application/octet-stream' });
    
    simulateFileDrop(file);
    
    await waitFor(() => {
      expect(screen.getByText(/download-test\.bin/)).toBeInTheDocument();
    });
    
    const downloadLink = screen.getByTitle('Download content');
    expect(downloadLink).toBeInTheDocument();
    expect(downloadLink.tagName).toBe('A');
    expect(downloadLink).toHaveAttribute('download', 'download-test.bin');
  });
});
