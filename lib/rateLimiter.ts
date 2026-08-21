export class RateLimiter {
  private messages: number[] = [];
  private readonly maxMessages: number;
  private readonly windowMs: number;

  constructor(maxMessages: number = 5, windowMs: number = 10000) {
    this.maxMessages = maxMessages;
    this.windowMs = windowMs;
  }

  canSendMessage(): { allowed: boolean; waitTime?: number } {
    const now = Date.now();
    
    // Remove messages outside the time window
    this.messages = this.messages.filter((timestamp) => now - timestamp < this.windowMs);
    
    // Check if under the limit
    if (this.messages.length < this.maxMessages) {
      return { allowed: true };
    }
    
    // Calculate wait time until oldest message expires
    const oldestMessage = this.messages[0];
    const waitTime = oldestMessage + this.windowMs - now;
    
    return { allowed: false, waitTime };
  }

  recordMessage(): void {
    this.messages.push(Date.now());
  }

  reset(): void {
    this.messages = [];
  }

  getRemainingCount(): number {
    const now = Date.now();
    this.messages = this.messages.filter((timestamp) => now - timestamp < this.windowMs);
    return Math.max(0, this.maxMessages - this.messages.length);
  }
}
