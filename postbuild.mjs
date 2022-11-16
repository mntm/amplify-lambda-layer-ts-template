import fs from "fs";
import { exit } from "process";
import shell from "shelljs";
import path from "path";

const O_CWD = process.cwd();
const libdir = path.join(O_CWD, "lib", "nodejs");

try {
  shell.cd(libdir);

  let result = shell.rm(path.join("node_modules", ".package-lock.json"));
  if (result.code !== 0) {
    shell.echo("Error: rm .package-lock.json failed");
    shell.echo(result.stderr);
  }

  result = shell.mv(
    "package.json",
    path.join("node_modules", "__PKG_NAME", "package.json")
  );
  if (result.code !== 0) {
    shell.echo("Error: mv package.json to __PKG_NAME failed");
    shell.echo(result.stderr);
  }

  shell.cd(O_CWD);
} catch (error) {
  console.error(error);
  exit(1);
}
