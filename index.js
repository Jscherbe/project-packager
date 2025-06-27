import fs from "fs";
import path from "path";
import archiver from "archiver";

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

export async function createPackage(userOptions) {
  const options = Object.assign({}, defaults, userOptions);

  if (!fs.existsSync(options.outputDir)) {
    throw new Error("outputDir does not exist");
  } 
  if (!fs.existsSync(options.inputDir)) {
    throw new Error("inputDir does not exist");
  } 

  try  {
    return await createZip(options, getFilepath(options));
  } catch (error) {
    throw error;
  }
}

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
 * Recursive function for not overwriting files
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

export function getTimeStamp() {
  const now = new Date();
  const pad = (x) => x < 10 ? `0${ x }` : x;
  const month = pad(now.getMonth() + 1);
  const day = pad(now.getDate());
  return `${ now.getFullYear() }${ month }${ day }`;
}


export default createPackage;