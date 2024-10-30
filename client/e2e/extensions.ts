import { Response } from "@playwright/test";

/**
 * Create a response predicate for the `page.waitForResponse` method.
 * @param path - URL absolute path
 * @param method - HTTP method
 * @returns A predicate function that returns true if the response matches the
 * specified path and method.
 */
export const getResponsePredicate = (method: string, path: string) => {
  return (response: Response): boolean => {
    const request = response.request();

    return (
      new URL(request.url()).pathname === path && request.method() === method
    );
  };
};
