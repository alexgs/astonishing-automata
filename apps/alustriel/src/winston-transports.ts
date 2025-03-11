/*
 * Copyright 2025 Phillip Gates-Shannon. All rights reserved. Licensed under the Open Software License version 3.0.
 */

import * as winston from 'winston';

export const appLog = new winston.transports.File({
  filename: 'logs/app.log', // Ensure the "logs" directory exists
  level: 'info', // Log level threshold
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json(), // Logs in JSON format, which is great for parsing
  ),
});

export const consoleLog = new winston.transports.Console({
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.printf(({ level, message, timestamp }) => {
      return `${timestamp} [${level.toUpperCase()}]: ${message}`;
    }),
  ),
});

export const testLog = new winston.transports.File({
  filename: 'logs/test.log', // Ensure the "logs" directory exists
  level: 'debug', // Log level threshold
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.printf(({ context, level, message, timestamp }) => {
      return `${timestamp} [${level.toUpperCase()}] [${context}]: ${message}`;
    }),
  ),
});
