import fs from "fs";
import { exit } from "process";
import shell from "shelljs";
import path from "path";

const O_CWD = process.cwd();
const libdir = path.join(O_CWD, "lib", "nodejs");

/**
 *
 * @param {string} src
 * @param {string} dest
 * @param {(data: Buffer)=>Buffer} [action]
 */
function copyFileSync(src, dest, action) {
  const data = fs.readFileSync(src);
  const processed = action?.(data);
  const toWrite = processed ?? data;
  fs.writeFileSync(dest, toWrite.toString());
}

try {
  copyFileSync("./package.json", path.join(libdir, "package.json"), (data) => {
    const packages = JSON.parse(data.toString());
    delete packages.devDependencies;
    delete packages.scripts;
    return Buffer.from(JSON.stringify(packages, null, 2));
  });

  shell.cd(libdir);
  let result = shell.exec("npm install --no-package-lock --omit dev");
  if (result.code !== 0) {
    shell.echo("Error: npm install --no-package-lock --omit dev failed");
    shell.echo(result.stderr);
    exit(2);
  }

  shell.cd(O_CWD);
} catch (error) {
  console.error(error);
  exit(1);
}
