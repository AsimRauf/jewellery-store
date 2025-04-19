export interface ApiError extends Error {
  status?: number;
  message: string;
}