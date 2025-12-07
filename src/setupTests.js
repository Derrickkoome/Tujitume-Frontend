import '@testing-library/jest-dom'

// silence console.error during tests unless explicitly thrown
const originalError = console.error
console.error = (...args) => {
  if (/(Warning: An update to %s inside a test was not wrapped in act|not wrapped in act)/.test(args[0])) {
    return
  }
  originalError(...args)
}

// Polyfill TextEncoder/TextDecoder for Jest/node environment
if (typeof global.TextEncoder === 'undefined') {
  const { TextEncoder, TextDecoder } = require('util')
  global.TextEncoder = TextEncoder
  global.TextDecoder = TextDecoder
}
