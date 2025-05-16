export type LogEvent = {
  method: string;
  url: string;
  params?: Record<string, string | number | boolean>;
  body?: unknown;
  timestamp: string;
  user?: string; // Optional: add user info if available
};

export const logEvent = (event: LogEvent) => {
  // For now, just log to console. Replace with your preferred logging mechanism.
  // You could also push to an array, send to a server, etc.
  console.log('[Sensitive Event]', event);
  // Example: localStorage, remote API, etc.
  // localStorage.setItem('eventLogs', JSON.stringify([...existingLogs, event]));
};
