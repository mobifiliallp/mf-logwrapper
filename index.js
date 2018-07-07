/**
 * Mobifilia Common - Log wrapper.
 *
 * Logging level configured by reading the 'logger' key from the configuration.
 * Enabled by default and level set to 'info' if configuration/values not provided.
 */
const pino = require('pino');
const config = require('config');

let loggerConfig = {};
if (config.has('logger')) {
  loggerConfig = config.get('logger');
}

loggerConfig.level = loggerConfig.level || 'info';
loggerConfig.enabled = !(loggerConfig.enabled === false);

const logger = pino(loggerConfig);

let appName;
if (config.has('appName')) {
  appName = config.get('appName');
}

const baseLogger = logger.child({
  _app: (appName || process.argv[1] || process.pid),
});
module.exports.defaultLogger = baseLogger;

/**
 * Gets a pino logger instance configured with the given context.
 *
 * @param {String} moduleName The contextual module name.
 * @param {String} classFileName The contextual class or file name.
 *
 * @returns {pino.logger} a logger instance.
 */
function getLogger(moduleName, classFileName) {
  let newLogger = baseLogger;

  if (moduleName !== undefined) {
    newLogger = newLogger.child({
      _mod: moduleName,
    });
  }
  if (classFileName !== undefined) {
    newLogger = newLogger.child({
      _cls: classFileName,
    });
  }

  return newLogger;
}
module.exports.getLogger = getLogger;

class ContextLogger {
  constructor(pinoLogger) {
    this.pinoLogger = pinoLogger;
  }

  /**
   * Logs a fatal level message.
   *
   * Arguments are the same as the underlying 'pino' logger.
   * @param {*} args Log arguments - e.g. (object, message, ...) or (error, message, ...) or (message, ...)
   */
  fatal(...args) {
    this.pinoLogger.fatal(...args);
  }

  /**
   * Logs an error level message.
   *
   * Arguments are the same as the underlying 'pino' logger.
   * Pass an Error object as the first argument to log error details including stack trace.
   * @param {*} args Log arguments - e.g. (object, message, ...) or (error, message, ...) or (message, ...)
   */
  error(...args) {
    this.pinoLogger.error(...args);
  }

  /**
   * Logs a warning level message.
   *
   * Arguments are the same as the underlying 'pino' logger.
   * @param {*} args Log arguments - e.g. (object, message, ...) or (error, message, ...) or (message, ...)
   */
  warn(...args) {
    this.pinoLogger.warn(...args);
  }

  /**
   * Logs an informational level message.
   *
   * Arguments are the same as the underlying 'pino' logger.
   * @param {*} args Log arguments - e.g. (object, message, ...) or (error, message, ...) or (message, ...)
   */
  info(...args) {
    this.pinoLogger.info(...args);
  }

  /**
   * Logs a debug level message.
   *
   * Arguments are the same as the underlying 'pino' logger.
   * @param {*} args Log arguments - e.g. (object, message, ...) or (error, message, ...) or (message, ...)
   */
  debug(...args) {
    this.pinoLogger.debug(...args);
  }

  /**
   * Logs a trace level message.
   *
   * Arguments are the same as the underlying 'pino' logger.
   * @param {*} args Log arguments - e.g. (object, message, ...) or (error, message, ...) or (message, ...)
   */
  trace(...args) {
    this.pinoLogger.trace(...args);
  }

  /**
   * Logs a debug level message in a function context.
   *
   * First argument should be the function name or context.
   * Remaining arguments are the same as the underlying 'pino' logger.
   * @param {String} functionName The contextual function name.
   * @param {*} args Other arguments - e.g. (object, message, ...) or (error, message, ...) or (message, ...)
   */
  debugF(functionName, ...args) {
    if (args.length > 0) {
      const firstArg = args[0];
      if (firstArg instanceof Error) {
        this.pinoLogger.debug(...args);
      } else {
        if (typeof firstArg === 'string') {
          args.unshift({ _fun: functionName });
        } else if (typeof firstArg === 'object' && firstArg !== null) {
          const newFirstArg = Object.assign({}, firstArg);
          newFirstArg._fun = functionName;
          args[0] = newFirstArg;
        }
        this.pinoLogger.debug(...args);
      }
    }
  }

  /**
   * Logs a trace level message in a function context.
   *
   * First argument should be the function name or context.
   * Remaining arguments are the same as the underlying 'pino' logger.
   * @param {String} functionName The contextual function name.
   * @param {*} args Other arguments - e.g. (object, message, ...) or (error, message, ...) or (message, ...)
   */
  traceF(functionName, ...args) {
    if (args.length > 0) {
      const firstArg = args[0];
      if (firstArg instanceof Error) {
        this.pinoLogger.trace(...args);
      } else {
        if (typeof firstArg === 'string') {
          args.unshift({ _fun: functionName });
        } else if (typeof firstArg === 'object' && firstArg !== null) {
          const newFirstArg = Object.assign({}, firstArg);
          newFirstArg._fun = functionName;
          args[0] = newFirstArg;
        }
        this.pinoLogger.trace(...args);
      }
    }
  }
}

/**
 * Gets a contextual logger instance.
 *
 * @param {String} moduleName The contextual module name.
 * @param {String} classFileName The contextual class or file name.
 *
 * @returns {ContextLogger} a logger instance.
 */
function getContextLogger(moduleName, classFileName) {
  return new ContextLogger(getLogger(moduleName, classFileName));
}
module.exports.getContextLogger = getContextLogger;
