// src/utils/logger.js
export class Logger {
    static getTimestamp() {
      return new Date().toISOString();
    }
  
    static formatMessage(level, message) {
      return `[${this.getTimestamp()}] [${level.toUpperCase()}] ${message}`;
    }
  
    static info(message) {
      console.log(this.formatMessage('info', message));
    }
  
    static error(message, error = null) {
      console.error(this.formatMessage('error', message));
      if (error) {
        console.error(error);
      }
    }
  
    static debug(message) {
      if (process.env.DEBUG) {
        console.debug(this.formatMessage('debug', message));
      }
    }
  
    static warn(message) {
      console.warn(this.formatMessage('warn', message));
    }
  
    static success(message) {
      console.log(this.formatMessage('success', `✓ ${message}`));
    }
  }