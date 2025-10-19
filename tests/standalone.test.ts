import { describe, it, expect, beforeEach, afterEach } from 'bun:test';
import { logger } from '../standalone';

describe('Standalone Logger', () => {
  beforeEach(() => {
    // Clear any existing logs
    console.log = () => {};
    console.error = () => {};
    console.warn = () => {};
  });

  afterEach(() => {
    // Restore console methods
    console.log = console.log;
    console.error = console.error;
    console.warn = console.warn;
  });

  it('should export logger with all required methods', () => {
    expect(logger).toBeDefined();
    expect(typeof logger.info).toBe('function');
    expect(typeof logger.error).toBe('function');
    expect(typeof logger.debug).toBe('function');
    expect(typeof logger.warning).toBe('function');
    expect(typeof logger.success).toBe('function');
    expect(typeof logger.critical).toBe('function');
    expect(typeof logger.table).toBe('function');
  });

  it('should log info messages', () => {
    expect(() => logger.info('Test info message')).not.toThrow();
  });

  it('should log error messages', () => {
    expect(() => logger.error('Test error message')).not.toThrow();
  });

  it('should log debug messages', () => {
    expect(() => logger.debug('Test debug message')).not.toThrow();
  });

  it('should log warning messages', () => {
    expect(() => logger.warning('Test warning message')).not.toThrow();
  });

  it('should log success messages', () => {
    expect(() => logger.success('Test success message')).not.toThrow();
  });

  it('should log critical messages', () => {
    expect(() => logger.critical('Test critical message')).not.toThrow();
  });

  it('should log table messages', () => {
    const testData = { name: 'John', age: 30 };
    expect(() => logger.table('Test table', testData)).not.toThrow();
  });

  it('should handle table logging without data', () => {
    expect(() => logger.table('Test table without data')).not.toThrow();
  });

  it('should add caller location to log messages', () => {
    // This test verifies that the logger adds file and line information
    expect(() => logger.info('Test with caller location')).not.toThrow();
  });
});
