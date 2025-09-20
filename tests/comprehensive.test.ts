import { describe, it, expect } from "bun:test";
import { logger, createLogger, runtime } from "../index";
import { getMethodColor, getStatusColor, getColoredLevel } from "../utils/colors";

describe("Tsuki Logger - Comprehensive Test Suite", () => {
  describe("🚀 Runtime Detection", () => {
    it("should detect runtime correctly", () => {
      expect(runtime.type).toBeOneOf(["bun", "node"]);
      expect(typeof runtime.isBun).toBe("boolean");
      expect(typeof runtime.isNode).toBe("boolean");
      expect(runtime.isBun).not.toBe(runtime.isNode);
      console.log(`✅ Runtime detected: ${runtime.type}`);
    });

    it("should have working path operations", () => {
      const result = runtime.path.join("a", "b", "c");
      expect(result).toBe("a/b/c");
      console.log(`✅ Path operations work: ${result}`);
    });

    it("should have working environment access", () => {
      const nodeEnv = runtime.env.get("NODE_ENV");
      expect(typeof nodeEnv).toBeOneOf(["string", "undefined"]);
      console.log(`✅ Environment access works: NODE_ENV=${nodeEnv}`);
    });
  });

  describe("📝 Standalone Logger", () => {
    it("should log all message types", () => {
      console.log("\n📝 Testing all log levels:");
      
      expect(() => logger.info("Info message")).not.toThrow();
      expect(() => logger.success("Success message")).not.toThrow();
      expect(() => logger.critical("Critical message")).not.toThrow();
      expect(() => logger.debug("Debug message")).not.toThrow();
      expect(() => logger.error("Error message")).not.toThrow();
      expect(() => logger.warning("Warning message")).not.toThrow();
      
      console.log("✅ All log levels work correctly");
    });

    it("should log table data with visual output", () => {
      console.log("\n📊 Testing table logging:");
      
      const testData = { 
        name: "John Doe", 
        age: 30, 
        city: "New York",
        active: true 
      };
      
      expect(() => logger.table("User Information", testData)).not.toThrow();
      console.log("✅ Table logging works correctly");
    });
  });

  describe("🌐 Elysia Logger", () => {
    it("should create Elysia app with logger", () => {
      const elysiaApp = createLogger({ level: "debug" });
      expect(elysiaApp).toBeDefined();
      expect(typeof elysiaApp).toBe("object");
      console.log("✅ Elysia logger app created successfully");
    });

    it("should create logger with custom configuration", () => {
      const elysiaApp = createLogger({
        level: "error",
        autoLogging: false,
        logErrors: false,
        customProps: (ctx) => ({ userId: "test-user" })
      });
      expect(elysiaApp).toBeDefined();
      console.log("✅ Custom Elysia logger configuration works");
    });
  });

  describe("🎨 Color Functions", () => {
    it("should color log levels correctly", () => {
      const levels = ["error", "info", "success", "critical", "debug", "warning"];
      
      levels.forEach(level => {
        const colored = getColoredLevel(level);
        const expected = level === "warning" ? "WARN" : level.toUpperCase();
        expect(colored).toContain(expected);
      });
      
      console.log("✅ All log level colors work correctly");
    });

    it("should color HTTP methods correctly", () => {
      const methods = ["GET", "POST", "PUT", "PATCH", "DELETE"];
      
      methods.forEach(method => {
        const colored = getMethodColor(method);
        expect(colored).toContain(method);
      });
      
      console.log("✅ All HTTP method colors work correctly");
    });

    it("should color status codes correctly", () => {
      const statusCodes = [200, 201, 301, 400, 404, 500, 502];
      
      statusCodes.forEach(code => {
        const colored = getStatusColor(code);
        expect(colored).toContain(code.toString());
      });
      
      console.log("✅ All status code colors work correctly");
    });
  });

  describe("🎭 Visual Output Demo", () => {
    it("should display beautiful colored output", () => {
      console.log("\n🎭 Visual Logger Demo:");
      console.log("=====================");
      
      logger.info("This is an INFO message");
      logger.success("This is a SUCCESS message");
      logger.critical("This is a CRITICAL message");
      logger.debug("This is a DEBUG message");
      logger.error("This is an ERROR message");
      logger.warning("This is a WARNING message");
      
      logger.table("Sample Data", {
        feature: "Tsuki Logger",
        status: "Working",
        runtime: runtime.type,
        colors: "Enabled"
      });
      
      console.log("\n✅ Visual demo completed - check the beautiful colored output above!");
    });
  });

  describe("🛡️ Error Handling", () => {
    it("should handle invalid inputs gracefully", () => {
      expect(() => getColoredLevel("invalid")).not.toThrow();
      expect(() => getMethodColor("INVALID")).not.toThrow();
      expect(() => getStatusColor(999)).not.toThrow();
      
      console.log("✅ Error handling works correctly");
    });
  });

  describe("📊 Performance Test", () => {
    it("should handle multiple rapid log calls", () => {
      const start = performance.now();
      
      for (let i = 0; i < 100; i++) {
        logger.info(`Performance test message ${i}`);
      }
      
      const end = performance.now();
      const duration = end - start;
      
      expect(duration).toBeLessThan(1000); // Should complete in under 1 second
      console.log(`✅ Performance test: 100 log calls completed in ${duration.toFixed(2)}ms`);
    });
  });
});
