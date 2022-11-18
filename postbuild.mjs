import fs from "fs";
import path from "path";
import { exit } from "process";
import shell from "shelljs";

const O_CWD = process.cwd();
const libdir = path.join(O_CWD, "lib", "nodejs");
const builddir = path.join(O_CWD, "build");

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
  shell.cd(builddir);
  const o_buildhash = fs.readFileSync(".buildhash").toString();
  shell.exec("sha256sum .tsbuildinfo").to(".buildhash");
  const n_buildhash = fs.readFileSync(".buildhash").toString();
  shell.cd(O_CWD);

  if (n_buildhash !== o_buildhash) {
    /**
     * @type {{version: string}}
     */
    const packages = JSON.parse(fs.readFileSync("package.json"));
    const verComponents = packages.version.split(".");
    let buildNum = Number(verComponents[2]) || 0;
    verComponents[2] = "" + ++buildNum;
    packages.version = verComponents.join(".");
    fs.writeFileSync(
      "package.json",
      Buffer.from(JSON.stringify(packages, null, 2))
    );
  }

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

  result = shell.rm(path.join("node_modules", ".package-lock.json"));
  if (result.code !== 0) {
    shell.echo("Error: rm .package-lock.json failed");
    shell.echo(result.stderr);
  }

  result = shell.cp("-ru", builddir, path.join("node_modules", "__PKG_NAME"));
  if (result.code !== 0) {
    shell.echo(`Error: cp ${builddir} to __PKG_NAME failed`);
    shell.echo(result.stderr);
  }

  shell.cd(O_CWD);
} catch (error) {
  console.error(error);
  exit(1);
}
