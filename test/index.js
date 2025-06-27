import { createPackage } from "../index.js";

(async () => {

  await createPackage({
    inputDir: "./test/src/",
    outputDir: "./test/dist/test-default/"
  });

  console.log("package (default) done");

  await createPackage({
    name: "test-tar",
    inputDir: "./test/src/",
    outputDir: "./test/dist/test-tar/",
    format: "tar"
  });
  
  console.log("package (tar) done");

  await createPackage({
    name: "test-zip-no-increment",
    inputDir: "./test/src/",
    outputDir: "./test/dist/test-zip-no-increment/",
    increment: false,
    overwrite: true
  });

  console.log("package (zip-no-increment) done");

  await createPackage({
    name: "test-zip-no-overwrite",
    inputDir: "./test/src/",
    outputDir: "./test/dist/test-zip-no-overwrite/",
    overwrite: false,
    timestamp: false,
    increment: false
  });

  console.log("package (zip-no-overwrite) done");

  await createPackage({
    name: "test-zip-no-timestamp",
    inputDir: "./test/src/",
    outputDir: "./test/dist/test-zip-no-timestamp/",
    timestamp: false
  });

  console.log("package (zip-no-timestamp) done");
})();