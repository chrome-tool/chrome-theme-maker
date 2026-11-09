/**
 * File validation utilities
 */
import { ALLOWED_IMAGE_TYPES } from '../constants';

export interface FileValidationError {
  isValid: false;
  code: 'INVALID_TYPE' | 'FILE_ERROR';
  message: string;
}

export interface FileValidationSuccess {
  isValid: true;
}

export type FileValidationResult = FileValidationError | FileValidationSuccess;

/**
 * Validates image file before upload
 * @param file File to validate
 * @returns Validation result with error details if invalid
 */
export function validateImageFile(file: File): FileValidationResult {
  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    return {
      isValid: false,
      code: 'INVALID_TYPE',
      message: `Invalid file type. Allowed: ${ALLOWED_IMAGE_TYPES.join(', ')}`,
    };
  }

  return { isValid: true };
}

/**
 * Safely converts file to blob URL with cleanup support
 * @param file File to convert
 * @returns Object URL or null if creation fails
 */
export function createFileUrl(file: File): string | null {
  try {
    return URL.createObjectURL(file);
  } catch {
    return null;
  }
}

/**
 * Safely revokes a blob URL
 * @param url URL to revoke
 */
export function revokeFileUrl(url: string | undefined): void {
  if (url) {
    try {
      URL.revokeObjectURL(url);
    } catch {
      // Silent catch - URL may already be revoked
    }
  }
}
