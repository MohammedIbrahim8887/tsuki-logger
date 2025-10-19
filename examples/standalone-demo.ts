import { standaloneLogger } from '../dist/index.js';

console.log('🌙 Tsuki Logger - Standalone Demo\n');

// Basic logging examples
standaloneLogger.info('Application started');
standaloneLogger.error('Something went wrong');
standaloneLogger.debug('Debug information');
standaloneLogger.warning('Warning message');
standaloneLogger.success('Operation completed successfully');
standaloneLogger.critical('Critical error occurred');

// Table logging example
const userData = { 
  name: 'John Doe', 
  age: 30, 
  city: 'New York',
  email: 'john@example.com'
};
standaloneLogger.table('User Information', userData);

// Logging with metadata
standaloneLogger.info('User login', { 
  userId: 123, 
  timestamp: new Date().toISOString(),
  ip: '192.168.1.1'
});

console.log('\n✅ Standalone logger demo completed!');
console.log('📁 Check the .log directory for file outputs');
console.log('\n💡 Usage:');
console.log('   import { standaloneLogger } from "tsuki-logger";');
console.log('   // or');
console.log('   import { logger } from "tsuki-logger/standalone";');