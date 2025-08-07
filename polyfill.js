// polyfill.js - Web API polyfills for Node.js environments
// This needs to be loaded before any other modules

// File class polyfill
if (typeof global.File === 'undefined') {
  global.File = class File {
    constructor(bits, name, options = {}) {
      this.name = name;
      this.lastModified = options.lastModified || Date.now();
      this.type = options.type || '';
      this._bits = bits;
    }
  };
}

// FormData class polyfill
if (typeof global.FormData === 'undefined') {
  global.FormData = class FormData {
    constructor() {
      this.entries = [];
    }
    append(name, value, filename) {
      this.entries.push({ name, value, filename });
    }
  };
}

// Blob class polyfill
if (typeof global.Blob === 'undefined') {
  global.Blob = class Blob {
    constructor(bits, options = {}) {
      this._bits = bits;
      this.type = options.type || '';
    }
  };
}

// URL class polyfill if needed
if (typeof global.URL === 'undefined' && typeof URL === 'undefined') {
  const url = require('url');
  global.URL = url.URL;
}

// Add DOMException if needed
if (typeof global.DOMException === 'undefined') {
  global.DOMException = class DOMException extends Error {
    constructor(message, name) {
      super(message);
      this.name = name || 'Error';
      this.message = message || '';
    }
  };
}

console.log('Web API polyfills loaded successfully');
