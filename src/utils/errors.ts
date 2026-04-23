/**
 * Error handling utilities
 */

export class ThemeDownloadError extends Error {
  code: 'MANIFEST_ERROR' | 'ZIP_ERROR' | 'DOWNLOAD_ERROR' | 'UNKNOWN';

  constructor(
    code: 'MANIFEST_ERROR' | 'ZIP_ERROR' | 'DOWNLOAD_ERROR' | 'UNKNOWN',
    message: string,
  ) {
    super(message);
    this.name = 'ThemeDownloadError';
    this.code = code;
  }
}

/**
 * User-friendly error message mapping
 */
export function getErrorMessage(error: unknown): string {
  if (error instanceof ThemeDownloadError) {
    const messages: Record<string, string> = {
      MANIFEST_ERROR: 'Failed to create theme manifest',
      ZIP_ERROR: 'Failed to create theme package',
      DOWNLOAD_ERROR: 'Failed to download theme',
      UNKNOWN: 'An unexpected error occurred',
    };
    return messages[error.code] || messages.UNKNOWN;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return 'An unexpected error occurred';
}
