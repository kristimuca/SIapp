import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import App from './App';
import * as api from './api';

// Mock the API module
jest.mock('./api');

describe('App Component', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  test('renders the app title', () => {
    render(<App />);
    const titleElement = screen.getByText(/Text Encryption App/i);
    expect(titleElement).toBeInTheDocument();
  });

  test('renders input textarea', () => {
    render(<App />);
    const textarea = screen.getByLabelText(/Enter Text to Encrypt/i);
    expect(textarea).toBeInTheDocument();
  });

  test('renders Encrypt, Decrypt, and Clear buttons', () => {
    render(<App />);
    expect(screen.getByRole('button', { name: /Encrypt/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Decrypt/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Clear/i })).toBeInTheDocument();
  });

  test('Encrypt button is disabled when input is empty', () => {
    render(<App />);
    const encryptButton = screen.getByRole('button', { name: /Encrypt/i });
    expect(encryptButton).toBeDisabled();
  });

  test('can type in textarea', () => {
    render(<App />);
    const textarea = screen.getByLabelText(/Enter Text to Encrypt/i);
    fireEvent.change(textarea, { target: { value: 'Test message' } });
    expect(textarea.value).toBe('Test message');
  });

  test('encrypts text successfully', async () => {
    const mockEncryptedData = {
      data: {
        ciphertext: 'encrypted123',
        iv: 'iv123',
        authTag: 'tag123'
      }
    };
    api.encryptText.mockResolvedValue(mockEncryptedData);

    render(<App />);
    
    const textarea = screen.getByLabelText(/Enter Text to Encrypt/i);
    fireEvent.change(textarea, { target: { value: 'Test message' } });
    
    const encryptButton = screen.getByRole('button', { name: /Encrypt/i });
    fireEvent.click(encryptButton);

    await waitFor(() => {
      expect(api.encryptText).toHaveBeenCalledWith('Test message');
      expect(screen.getByText(/Text encrypted successfully/i)).toBeInTheDocument();
      expect(screen.getByText(/Encrypted Data/i)).toBeInTheDocument();
    });
  });

  test('decrypts text successfully', async () => {
    const mockEncryptedData = {
      data: {
        ciphertext: 'encrypted123',
        iv: 'iv123',
        authTag: 'tag123'
      }
    };
    const mockDecryptedData = {
      data: {
        plaintext: 'Test message'
      }
    };

    api.encryptText.mockResolvedValue(mockEncryptedData);
    api.decryptText.mockResolvedValue(mockDecryptedData);

    render(<App />);
    
    // First encrypt
    const textarea = screen.getByLabelText(/Enter Text to Encrypt/i);
    fireEvent.change(textarea, { target: { value: 'Test message' } });
    
    const encryptButton = screen.getByRole('button', { name: /Encrypt/i });
    fireEvent.click(encryptButton);

    await waitFor(() => {
      expect(screen.getByText(/Encrypted Data/i)).toBeInTheDocument();
    });

    // Then decrypt
    const decryptButton = screen.getByRole('button', { name: /Decrypt/i });
    fireEvent.click(decryptButton);

    await waitFor(() => {
      expect(api.decryptText).toHaveBeenCalledWith(mockEncryptedData.data);
      expect(screen.getByText(/Text decrypted successfully/i)).toBeInTheDocument();
      expect(screen.getByText(/Decrypted Text/i)).toBeInTheDocument();
    });
  });

  test('shows error message when encryption fails', async () => {
    api.encryptText.mockRejectedValue({ message: 'Encryption failed' });

    render(<App />);
    
    const textarea = screen.getByLabelText(/Enter Text to Encrypt/i);
    fireEvent.change(textarea, { target: { value: 'Test message' } });
    
    const encryptButton = screen.getByRole('button', { name: /Encrypt/i });
    fireEvent.click(encryptButton);

    await waitFor(() => {
      expect(screen.getByText(/Encryption failed/i)).toBeInTheDocument();
    });
  });

  test('Clear button resets all fields', async () => {
    const mockEncryptedData = {
      data: {
        ciphertext: 'encrypted123',
        iv: 'iv123',
        authTag: 'tag123'
      }
    };
    api.encryptText.mockResolvedValue(mockEncryptedData);

    render(<App />);
    
    // Type and encrypt
    const textarea = screen.getByLabelText(/Enter Text to Encrypt/i);
    fireEvent.change(textarea, { target: { value: 'Test message' } });
    
    const encryptButton = screen.getByRole('button', { name: /Encrypt/i });
    fireEvent.click(encryptButton);

    await waitFor(() => {
      expect(screen.getByText(/Encrypted Data/i)).toBeInTheDocument();
    });

    // Click Clear
    const clearButton = screen.getByRole('button', { name: /Clear/i });
    fireEvent.click(clearButton);

    // Verify everything is cleared
    expect(textarea.value).toBe('');
    expect(screen.queryByText(/Encrypted Data/i)).not.toBeInTheDocument();
  });

  test('shows error when trying to decrypt without encrypting first', () => {
    render(<App />);
    
    const decryptButton = screen.getByRole('button', { name: /Decrypt/i });
    expect(decryptButton).toBeDisabled();
  });
});
