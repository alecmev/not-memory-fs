const fs = require('fs');
const path = require('path');

// eslint-disable-next-line import/no-extraneous-dependencies
const MemoryFileSystem = require('memory-fs');
const mkdirp = require('mkdirp');

class NotMemoryFileSystem extends MemoryFileSystem {
  constructor(sandboxPath) {
    if (!sandboxPath) throw new Error('sandboxPath is mandatory');
    // Mandatory
    super();
    // This is the only thing we can delete. The rest of the properties assigned
    // to this in MemoryFileSystem's constructor actually become a part of its
    // prototype and are reset below.
    delete this.data;
    this.sandboxPath = path.resolve(sandboxPath);
    this.sandboxPathWithSep = `${this.sandboxPath}${path.sep}`;
  }
}

const fsExtra = {
  mkdirp,
  mkdirpSync: mkdirp.sync
};

function wrap(f) {
  if (!f) return f;
  return function notMemoryFileSystemWrapper(...args) {
    const rawPath = args[0];
    const resolvedPath = path.resolve(rawPath);
    if (
      resolvedPath !== this.sandboxPath &&
      !resolvedPath.startsWith(this.sandboxPathWithSep)
    ) {
      throw new Error(
        `Path "${rawPath}", resolved to "${resolvedPath}", ` +
          `is outside of sandbox "${this.sandboxPath}"`
      );
    }

    return f(...args);
  };
}

for (const x of Object.keys(MemoryFileSystem.prototype)) {
  // If it's undefined, then it's undefined, perfect. It isn't possible to
  // delete inherited prototype properties without modifying the parent.
  NotMemoryFileSystem.prototype[x] = wrap(fs[x] || fsExtra[x] || path[x]);
}

module.exports = NotMemoryFileSystem;
