### not-memory-fs

A descendant of [MemoryFileSystem](https://github.com/webpack/memory-fs) that
persists to disk instead of memory, created to address [this
issue](https://github.com/webpack/webpack-dev-middleware/issues/239).

This business is somewhat risky, because it's possible for some module which
expects this to be a vanilla MemoryFileSystem to wreak havoc on the system,
doing an `rm -rf` on the root directory or some such. Hence the need for a
sandbox, to limit the possible damage (best-effort).

Why not persist to disk asynchronously, while forwarding requests to
MemoryFileSystem synchronously, that way preserving the original performance
boost? Because this keeps the code simple, and allows one to edit the files and
have those changes noticed by the consumer of the file system. And the boost is
becoming negligible on NVMe SSDs (though the writes do, unfortunately, damage
the drive unnecessarily).

`memory-fs` is just a development dependency. Why? It's important for this
module and the code running `instanceof MemoryFileSystem` to require the same
copy of `memory-fs`, otherwise it may resolve to `false`, negating the main
purpose of this wrapper, like in `webpack-dev-middleware`'s case.

`mkdirp` brings an unnecessary dependency with it, `minimist`, unfortunately,
but it's tiny, so that's tolerable.
