import fs from "fs";
import path from "path";
import archiver from "archiver";

/**
 * @typedef {object} PackageOptions
 * @property {string} [name="project-package"] - The base name for the output package file.
 * @property {string} inputDir - The path to the directory containing files to be packaged. This is a mandatory option.
 * @property {string} [outputDir="./dist/packages/"] - The path where the package file will be created.
 * @property {boolean} [timestamp=true] - Whether to append a timestamp (YYYYMMDD) to the package filename.
 * @property {boolean} [increment=true] - Whether to append an incrementing number if a file with the same base name and timestamp already exists. This only applies if `overwrite` is `false`.
 * @property {boolean} [overwrite=false] - Whether to overwrite an existing file if `increment` is `false` and a filename clash occurs. If `true`, the existing file will be replaced.
 * @property {string} [format="zip"] - The archive format (e.g., "zip", "tar"). Must be supported by the 'archiver' library.
 * @property {object} [archiverOptions={}] - Additional options passed directly to the 'archiver' library's instance.
 */
const defaults = {
  name: "project-package",
  inputDir: null,
  outputDir: "./dist/packages/",
  timestamp: true,
  increment: true,
  overwrite: false,
  format: "zip",
  archiverOptions: {}
};

/**
 * Creates a project package (e.g., a zip file) based on the provided options.
 * This is the main asynchronous function to initiate the packaging process.
 *
 * @param {object} config - Options for creating the package.
 * @param {string} config.inputDir - The path to the directory containing files to be packaged. This is a mandatory option and must be a valid, existing path.
 * @param {string} [config.name="project-package"] - The base name for the output package file.
 * @param {string} [config.outputDir="./dist/packages/"] - The path where the package file will be created.
 * @param {boolean} [config.timestamp=true] - Whether to append a timestamp (YYYYMMDD) to the package filename.
 * @param {boolean} [config.increment=true] - Whether to append an incrementing number if a file with the same base name and timestamp already exists. This only applies if `config.overwrite` is `false`.
 * @param {boolean} [config.overwrite=false] - Whether to overwrite an existing file if `config.increment` is `false` and a filename clash occurs. If `true`, the existing file will be replaced.
 * @param {string} [config.format="zip"] - The archive format (e.g., "zip", "tar"). Must be supported by the 'archiver' library.
 * @param {object} [config.archiverOptions={}] - Additional options passed directly to the 'archiver' library's instance.
 * @returns {Promise<void>} A Promise that resolves when the package is successfully created.
 * @throws {Error} If `outputDir` or `inputDir` do not exist, or if overwriting is disabled and a filename conflict occurs.
 */
export async function createPackage(config) {
  const options = Object.assign({}, defaults, config);

  if (!fs.existsSync(options.outputDir)) {
    throw new Error("outputDir does not exist");
  } 
  if (!fs.existsSync(options.inputDir)) {
    throw new Error("inputDir does not exist");
  } 

  return await createZip(options, getFilepath(options));
}

/**
 * Internal helper function to create the ZIP archive using the archiver library.
 * It handles the stream piping and promises for completion or error.
 * @private
 * @param {PackageOptions} options - The resolved options for packaging.
 * @param {string} filepath - The full path where the archive file should be written.
 * @returns {Promise<void>} A Promise that resolves when the archive is successfully written to the file system.
 * @throws {Error} If an error occurs during the archiving process (e.g., file system error, archiver error).
 */
function createZip(options, filepath) {
  return new Promise((resolve, reject) => {
    const output = fs.createWriteStream(filepath);
    const archive = archiver(options.format, options.archiverOptions);

    output.on("close", () => {
      console.log(`Package created (${ archive.pointer() } bytes)`);
      resolve();
    });
    archive.on("error", error => {
      reject(error);
    });
    archive.pipe(output);
    archive.directory(options.inputDir, false);
    archive.finalize();
  });
}

/**
 * Generates a unique filepath for the package, incorporating the base name, timestamp,
 * and an incrementing number (if enabled) to prevent overwrites based on options.
 * This function uses recursion to find an available filename if incrementing is active.
 *
 * @param {PackageOptions} options - The resolved options for packaging.
 * @param {number} [count=0] - Internal counter used during recursion to generate incremented filenames. Users should not set this manually.
 * @returns {string} The full, unique path for the new package file, including filename and extension.
 * @throws {Error} If `options.overwrite` is `false`, `options.increment` is `false`, and a file with the exact generated name already exists.
 */
export function getFilepath(options, count = 0) {
  const fileTime = options.timestamp ? `-${ getTimeStamp() }` : "";
  const fileCount = options.increment && count ? `-${ count }` : "";
  const filename = `${ options.name }${ fileTime }${ fileCount }.${ options.format }`;
  const filepath = path.join(options.outputDir, filename);
  if (fs.existsSync(filepath)) {
    if (!options.increment) {
      if (!options.overwrite) {
        throw new Error("Attempting to overwrite file when overwrite is disabled: " + filepath);
      } else {
        return filepath;
      }
    } else {
      return getFilepath(options, ++count);
    }
  } else {
    return filepath;
  }
}

/**
 * Generates a formatted timestamp string for the current date in YYYYMMDD format.
 *
 * @returns {string} The current date as an 8-digit string (e.g., "20250627").
 */
export function getTimeStamp() {
  const now = new Date();
  const pad = (x) => x < 10 ? `0${ x }` : x;
  const month = pad(now.getMonth() + 1);
  const day = pad(now.getDate());
  return `${ now.getFullYear() }${ month }${ day }`;
}

/**
 * Exports the `createPackage` function as the default export of this module.
 * This provides a convenient way to import and use the main packaging functionality.
 *
 * @see {@link createPackage}
 */
export default createPackage;