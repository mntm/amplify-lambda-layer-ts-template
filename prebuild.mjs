import fs from "fs";
import glob from "glob";
import path from "path";
import { exit } from "process";
import shell from "shelljs";

const O_CWD = process.cwd();
const builddir = path.join(O_CWD, "build");

function generateExportInIndex() {
  const files = glob.sync("src/**/*.ts");
  const filtered = files
    .filter((path) => !/(__tests__|__mocks__|index\.ts|\.d\.ts$)/g.test(path))
    .map(
      (file) =>
        `export * from "${file.replace("src", ".").replace(/\.ts$/, ".js")}"\n`
    );
  console.table(filtered);
  if (filtered.length) {
    fs.writeFileSync("src/index.ts", filtered.shift(), {
      mode: fs.constants.O_TRUNC,
    });
    filtered.forEach((i) => {
      fs.appendFileSync("src/index.ts", i);
    });
  }
}

try {
  generateExportInIndex();
  
  shell.mkdir("-p", builddir);
  shell.cd(builddir);
  shell.exec("sha256sum .tsbuildinfo").to(".buildhash");
  shell.cd(O_CWD);
} catch (error) {
  console.error(error);
  exit(1);
}
