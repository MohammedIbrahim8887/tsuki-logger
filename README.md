# Tsuki Logger 🌙

A clean, modular Winston-based logger for Elysia with Bun-first runtime detection and TypeScript support.

[![Bun](https://img.shields.io/badge/Bun-1.2+-000000?style=flat&logo=bun)](https://bun.sh)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-3178C6?style=flat&logo=typescript)](https://www.typescriptlang.org)
[![Elysia](https://img.shields.io/badge/Elysia-1.4+-00D8FF?style=flat)](https://elysiajs.com)
[![Winston](https://img.shields.io/badge/Winston-3.17+-FF6B6B?style=flat)](https://github.com/winstonjs/winston)

## ✨ Features

- **🚀 Runtime Detection**: Automatically detects and optimizes for Bun vs Node.js
- **🏗️ Modular Architecture**: Clean separation of concerns with dedicated utilities
- **🔒 TypeScript Support**: Full type safety throughout
- **🌐 Elysia Integration**: Seamless Elysia plugin with HTTP request logging
- **📝 Standalone Usage**: Can be used independently without Elysia
- **🎨 Custom Log Levels**: success, critical, table, and standard levels
- **🌈 Color Support**: Beautiful console output with chalk colors
- **📁 File Logging**: Automatic log file creation with ANSI color stripping
- **⚡ Performance**: Optimized for speed with lazy loading and caching
- **🧪 Tested**: Comprehensive test suite with visual demonstrations

## 📁 Project Structure

```
tsuki/
├── index.ts                    # Main exports
├── core/
│   ├── elysia-logger.ts       # Elysia plugin implementation
│   └── standalone-logger.ts   # Standalone logger implementation
├── types/
│   ├── index.ts               # Re-export all types
│   ├── logger.types.ts        # Logger interfaces & configs
│   ├── elysia.types.ts        # Elysia-specific types
│   └── runtime.types.ts       # Runtime detection types
├── utils/
│   ├── index.ts               # Re-export all utils
│   ├── colors.ts              # All color functions & constants
│   ├── formatters.ts          # Winston formatters
│   ├── runtime.ts             # Runtime detection & adapter
│   └── helpers.ts             # General helper functions
├── tests/
│   ├── comprehensive.test.ts  # Main test suite
│   ├── run-tests.ts          # Test runner script
│   └── README.md             # Test documentation
└── README.md
```

## 🚀 Installation

```bash
# Using Bun (recommended)
bun add tsuki

# Using npm
npm install tsuki

# Using yarn
yarn add tsuki

# Using pnpm
pnpm add tsuki
```

## 📖 Usage

### Standalone Logger

```typescript
import { logger } from 'tsuki';

// Basic logging
logger.info('Hello world');
logger.success('Operation completed');
logger.critical('Critical error occurred');
logger.debug('Debug information');
logger.error('Something went wrong');
logger.warning('Warning message');

// Table logging with visual output
logger.table('User data', { 
  name: 'John Doe', 
  age: 30, 
  city: 'New York' 
});
```

### Elysia Integration

```typescript
import { Elysia } from 'elysia';
import { createLogger } from 'tsuki';

const app = new Elysia()
  .use(createLogger({
    level: 'debug',
    autoLogging: true,
    customProps: (ctx) => ({ 
      userId: ctx.headers['user-id'],
      requestId: crypto.randomUUID()
    })
  }))
  .get('/', () => 'Hello World')
  .get('/users', () => ({ users: [] }))
  .listen(3000);
```

### Advanced Configuration

```typescript
import { createLogger } from 'tsuki';

const logger = createLogger({
  level: 'info',
  autoLogging: {
    ignore: (ctx) => ctx.path === '/health'
  },
  customProps: (ctx) => ({
    userId: ctx.headers['user-id'],
    ip: ctx.request.headers.get('x-forwarded-for'),
    userAgent: ctx.request.headers.get('user-agent')
  }),
  logErrors: true
});
```

### Runtime Detection

```typescript
import { runtime } from 'tsuki/utils';

console.log(`Running on: ${runtime.type}`); // 'bun' or 'node'
console.log(`Is Bun: ${runtime.isBun}`);
console.log(`Is Node: ${runtime.isNode}`);

// Use runtime-specific optimizations
if (runtime.isBun) {
  console.log('Using Bun optimizations');
} else {
  console.log('Using Node.js fallbacks');
}
```

### Color Utilities

```typescript
import { 
  getMethodColor, 
  getStatusColor, 
  getColoredLevel 
} from 'tsuki/utils';

// Color HTTP methods
console.log(getMethodColor('GET'));    // Green GET
console.log(getMethodColor('POST'));   // Blue POST
console.log(getMethodColor('DELETE')); // Red DELETE

// Color status codes
console.log(getStatusColor(200)); // Green 200
console.log(getStatusColor(404)); // Red 404
console.log(getStatusColor(500)); // Magenta 500

// Color log levels
console.log(getColoredLevel('info'));    // Blue INFO
console.log(getColoredLevel('success')); // Green SUCCESS
console.log(getColoredLevel('error'));   // Red ERROR
```

## Configuration

### LoggerConfig

```typescript
interface LoggerConfig {
  level?: 'error' | 'critical' | 'warning' | 'info' | 'success' | 'debug' | 'table';
  autoLogging?: boolean | { ignore?: (ctx: Context) => boolean };
  customProps?: (ctx: Context) => Record<string, unknown>;
  logErrors?: boolean;
}
```

## Log Levels

- `error` (0) - Error messages
- `critical` (1) - Critical system errors
- `warning` (2) - Warning messages
- `info` (3) - General information
- `success` (4) - Success messages
- `debug` (5) - Debug information
- `table` (6) - Table data logging

## HTTP Request Logging

The Elysia logger automatically logs HTTP requests with:
- Colored HTTP methods (GET, POST, PUT, PATCH, DELETE)
- Status codes with appropriate colors
- Response times
- Request paths
- Custom arrows for different methods (→, ←, ×)

Example output:
```
[2025-09-20 16:15:43] INFO PUT ← 200 /api/users
[2025-09-20 16:15:43] ERROR GET → 404 /api/not-found
```

## File Logging

Logs are automatically written to `.log/` directory:
- `log.txt` - All logs
- `log.error.txt` - Error logs only
- `log.debug.txt` - Debug logs only

File logs strip ANSI color codes for clean text output.

## 🧪 Testing

Tsuki includes a comprehensive test suite using Bun's built-in testing framework.

### Running Tests

```bash
# Run all tests
bun run test

# Run tests in watch mode
bun run test:watch

# Run all test files
bun run test:all

# Run specific test file
bun test tests/comprehensive.test.ts
```

### Preview
#### Integrated logger preview
![Preview of Tsuki Logger output](./assets/api-preview.png)


#### Test mode preview with standalone logger 
![Preview of Tsuki Logger output](./assets/preview.png)


### Test Coverage

The test suite covers:
- ✅ Runtime Detection (Bun vs Node.js)
- ✅ Standalone Logger (all log levels)
- ✅ Elysia Integration
- ✅ Color Functions
- ✅ Visual Output Demo
- ✅ Error Handling
- ✅ Performance Testing (100 logs in ~3ms)

### Visual Testing

The tests include beautiful visual demonstrations showing:
- Colored log messages with timestamps
- Formatted tables with data
- Consistent styling across all levels
- Performance metrics

## 🛠️ Development

### Prerequisites

- [Bun](https://bun.sh) 1.2+ (recommended)
- [Node.js](https://nodejs.org) 18+ (fallback)
- [TypeScript](https://www.typescriptlang.org) 5.0+

### Setup

```bash
# Clone the repository
git clone https://github.com/mohammedibrahim8887/tsuki.git
cd tsuki

# Install dependencies
bun install

# Run tests
bun run test

# Run tests in watch mode
bun run test:watch
```

### Project Structure

- `core/` - Core logger implementations
- `types/` - TypeScript type definitions
- `utils/` - Utility functions and helpers
- `tests/` - Test suite and documentation

### Building

```bash
# Build the project
bun run build

# Type check
bun run type-check
```

## 🤝 Contributing

We welcome contributions! Please follow these guidelines:

### Getting Started

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes
4. Run tests: `bun run test`
5. Commit your changes: `git commit -m 'Add amazing feature'`
6. Push to the branch: `git push origin feature/amazing-feature`
7. Open a Pull Request

### Code Style

- Use TypeScript with strict type checking
- Follow the existing code structure and patterns
- Add tests for new features
- Update documentation as needed
- Use meaningful commit messages

### Pull Request Process

1. Ensure all tests pass
2. Add tests for new functionality
3. Update documentation if needed
4. Request review from maintainers
5. Address any feedback

### Issues

- Use GitHub Issues for bug reports and feature requests
- Provide clear descriptions and reproduction steps
- Use appropriate labels

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Winston](https://github.com/winstonjs/winston) - Logging library
- [Elysia](https://elysiajs.com) - Web framework
- [Chalk](https://github.com/chalk/chalk) - Terminal string styling
- [Bun](https://bun.sh) - JavaScript runtime

## 📊 Performance

- **100 log calls**: ~3ms execution time
- **Runtime detection**: Cached for performance
- **Color functions**: Optimized for speed
- **File operations**: Efficient Bun/Node.js adapters

## 🔗 Links

- [GitHub Repository](https://github.com/mohammedibrahim8887/tsuki)
- [NPM Package](https://www.npmjs.com/package/tsuki)
- [Documentation](https://github.com/mohammedibrahim8887/tsuki#readme)
- [Issues](https://github.com/mohammedibrahim8887/tsuki/issues)

---

Made with ❤️ and TypeScript
