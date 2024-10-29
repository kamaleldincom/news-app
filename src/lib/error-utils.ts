// src/lib/error-utils.ts

export class ApiError extends Error {
    constructor(
      message: string,
      public status: number,
      public code?: string
    ) {
      super(message);
      this.name = 'ApiError';
    }
  }
  
  export function handleApiError(error: unknown): never {
    if (error instanceof ApiError) {
      throw error;
    }
  
    if (error instanceof Error) {
      throw new ApiError(error.message, 500);
    }
  
    throw new ApiError('An unknown error occurred', 500);
  }
  
  export async function fetchWithErrorHandling<T>(
    url: string,
    options?: RequestInit
  ): Promise<T> {
    try {
      const response = await fetch(url, options);
      
      if (!response.ok) {
        const error = await response.json().catch(() => ({ message: 'An error occurred' }));
        throw new ApiError(
          error.message || 'An error occurred',
          response.status,
          error.code
        );
      }
  
      return response.json();
    } catch (error) {
      throw handleApiError(error);
    }
  }