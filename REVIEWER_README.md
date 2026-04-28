## Reviewer Notes

### Required Software

- Node v14.17.1
- yarn v4.14.1

## Setup

- At root of source code provided, run:

```shell
yarn yarnAndBuildDeps
```

After command complete, run

```shell
yarn build:source
```

Upon completion, all contents of the `./dist/` directory contains the contents of the submitted add-on.

# Notes

**Permission Usage**:

**User Data Permissions**

The following requested permissions:

- `tabs`
- `activeTab`
- `<all_urls>`

Are only utilized by the source code in the `styleInjection` directory.
See [content injection](https://github.com/doki-theme/doki-theme-firefox#content-injection) for context.

**Browser Settings**

The `browserSettings` is used only in the `./src/background/deviceThemeManager.ts`, to set the `overrideContentColorScheme` to `system`.
See [Device Match mode](https://github.com/doki-theme/doki-theme-firefox#device-match) for context.
