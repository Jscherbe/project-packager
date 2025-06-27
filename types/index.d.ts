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
export function createPackage(config: {
    inputDir: string;
    name?: string;
    outputDir?: string;
    timestamp?: boolean;
    increment?: boolean;
    overwrite?: boolean;
    format?: string;
    archiverOptions?: object;
}): Promise<void>;
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
export function getFilepath(options: PackageOptions, count?: number): string;
/**
 * Generates a formatted timestamp string for the current date in YYYYMMDD format.
 *
 * @returns {string} The current date as an 8-digit string (e.g., "20250627").
 */
export function getTimeStamp(): string;
export default createPackage;
export type PackageOptions = {
    /**
     * - The base name for the output package file.
     */
    name?: string;
    /**
     * - The path to the directory containing files to be packaged. This is a mandatory option.
     */
    inputDir: string;
    /**
     * - The path where the package file will be created.
     */
    outputDir?: string;
    /**
     * - Whether to append a timestamp (YYYYMMDD) to the package filename.
     */
    timestamp?: boolean;
    /**
     * - Whether to append an incrementing number if a file with the same base name and timestamp already exists. This only applies if `overwrite` is `false`.
     */
    increment?: boolean;
    /**
     * - Whether to overwrite an existing file if `increment` is `false` and a filename clash occurs. If `true`, the existing file will be replaced.
     */
    overwrite?: boolean;
    /**
     * - The archive format (e.g., "zip", "tar"). Must be supported by the 'archiver' library.
     */
    format?: string;
    /**
     * - Additional options passed directly to the 'archiver' library's instance.
     */
    archiverOptions?: object;
};
//# sourceMappingURL=index.d.ts.map