const fs = require("fs");
const path = require("path");

const sampleDir = path.join(__dirname, "sample-files");
const sampleFile = path.join(sampleDir, "sample.txt");

// Write a sample file for demonstration
if (!fs.existsSync(sampleDir)) {
  fs.mkdirSync(sampleDir);
}

fs.writeFileSync(sampleFile, "Hello, async world!");
// 1. Callback style

fs.readFile(sampleFile, "utf8", (err, data) => {
  if (err) {
    console.error(err);
    return;
  }

  console.log("Callback read:", data);
});
// Callback hell example (test and leave it in comments):

/*fs.readFile("file1.txt", (err, data1) => {
  fs.readFile("file2.txt", (err, data2) => {
    fs.readFile("file3.txt", (err, data3) => {
      console.log("read all files");
    });
  });
});

Callback Hell: Is considered a problem because it makes it hard to read and maintain. In the instance that there was an error, it would be hard to locate due to the layout of it, usually leading to what we call the Pyramid of doom.
*/

// 2. Promise style

fs.promises
  .readFile(sampleFile, "utf-8")
  .then((data) => {
    console.log("Promise read:", data);
  })
  .catch((err) => {
    console.error(err);
  });

// 3. Async/Await style

async function readFileAsync() {
  try {
    const data = await fs.promises.readFile(sampleFile, "utf8");
    console.log("Async/Await read:", data);
  } catch (err) {
    console.error(err);
  }
}

readFileAsync();
