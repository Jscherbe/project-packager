# @ulu/project-packager

A lightweight Node.js module designed to automate the process of packaging your project's distribution files into unique, timestamped, and versioned ZIP archives. It's ideal for preparing builds for deployment, client delivery, or simply archiving specific versions of your project.

- Automated Zipping: Compresses specified input directories into ZIP files.
- Unique Filenames: Generates filenames with optional timestamps (YYYYMMDD) and auto-incrementing numbers to prevent overwrites.
- Customizable Naming: Control the base name, timestamp inclusion, and incrementing behavior.
- Overwrite Control: Option to allow or disallow overwriting of existing files.
- Simple API: Easy to integrate into build scripts or CI/CD pipelines.

**Related Links:**

- [API Documentation](https://jscherbe.github.io/project-packager/)
- [Change Log](CHANGELOG.md)

## Example Usage

```js
import { createPackage } from '@ulu/project-packager';

async function packageMyProject() {
  // Create the ZIP/TAR
  await createPackage({
    name: "my-web-app",                  // Base name for the zip file
    inputDir: "./dist/website/",          // Directory to zip (e.g., your build output)
    outputDir: "./release-packages/",     // Where to save the zip file
    timestamp: true,                      // Add date to filename (e.g., my-web-app-20250627.zip)
    increment: true,                      // Add incrementing number if file exists (e.g., my-web-app-20250627-1.zip)
    overwrite: false,                     // Prevent overwriting if increment is false and file exists
    format: "zip",                        // Archive format (currently only 'zip' is robustly tested with archiver)
    archiverOptions: {                    // Options passed directly to 'archiver'
      zlib: { level: 9 }                  // Example: Set compression level
    }
  });
}

```


