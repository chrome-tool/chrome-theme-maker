/**
 * File validation utilities
 */
import { FILE_SIZE_LIMIT, ALLOWED_IMAGE_TYPES } from '../constants';

export interface FileValidationError {
  isValid: false;
  code: 'SIZE_TOO_LARGE' | 'INVALID_TYPE' | 'FILE_ERROR';
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

  if (file.size > FILE_SIZE_LIMIT) {
    const limitMB = FILE_SIZE_LIMIT / (1024 * 1024);
    return {
      isValid: false,
      code: 'SIZE_TOO_LARGE',
      message: `File size exceeds ${limitMB}MB limit. Size: ${(file.size / (1024 * 1024)).toFixed(2)}MB`,
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
