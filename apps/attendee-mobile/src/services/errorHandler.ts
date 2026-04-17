const MAX_RETRIES = 3;
const BASE_DELAY_MS = 1000;

export type RetryableError = {
  statusCode: number;
  message: string;
};

export async function withRetry<T>(
  fn: () => Promise<T>,
  attempt = 0
): Promise<T> {
  try {
    return await fn();
  } catch (error: unknown) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const statusCode = (error as any)?.response?.status; 

    // Do not retry 4xx client errors (except 429 rate limit)
    if (statusCode && statusCode >= 400 && statusCode < 500 && statusCode !== 429) {
      throw error;
    }

    if (attempt >= MAX_RETRIES) {
      throw error;
    }

    const delay = BASE_DELAY_MS * Math.pow(2, attempt); // 1s, 2s, 4s
    await new Promise((resolve) => setTimeout(resolve, delay));
    return withRetry(fn, attempt + 1);
  }
}

export function mapErrorToMessage(error: unknown): string {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const anyError = error as any;
  const statusCode = anyError?.response?.status;
  const serverMessage = anyError?.response?.data?.message;

  if (serverMessage) return serverMessage;

  switch (statusCode) {
    case 400: return 'Invalid request. Please check your input.';
    case 401: return 'Session expired. Please log in again.';
    case 403: return 'You do not have permission for this action.';
    case 404: return 'The requested resource was not found.';
    case 429: return 'Too many requests. Please slow down.';
    case 500: return 'Server error. Please try again later.';
    default:
      if (!error.response) return 'Network error. Check your internet connection.';
      return 'An unexpected error occurred.';
  }
}
