# Fork maintenance

This is a public, MIT-licensed fork of
[greyaz/ThemeRevision](https://github.com/greyaz/ThemeRevision), archived by
its author on 2026-05-06.

## Remotes

- `origin`: `mrsuner/portfolio-theme-revision`
- `upstream`: `greyaz/ThemeRevision` (archive, retained for provenance)

## Runtime identity

The git repository is named `portfolio-theme-revision`, but the Kanboard plugin
directory and namespace remain `ThemeRevision`. This retains existing Kanboard
settings and compatibility with installed plugins.

## Build contract

Vite compiles the source files below into stable paths consumed by Kanboard:

```text
Asset/dev/main.css + Asset/dev/css/*  -> Asset/main.min.css
Asset/dev/js/main.js                  -> Asset/main.min.js
```

Run `npm run build` before releasing or switching the dashboard runtime symlink.
Generated `main.min.css` and `main.min.js` are committed so the PHP deployment
does not need Node.js or write access to the plugin source.
