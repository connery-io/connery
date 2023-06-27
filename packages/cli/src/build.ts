import { webpack } from "webpack";
import { existsSync } from "fs";

const sourceFilePath = "./index.js";

export default async function (): Promise<void> {
  try {
    await build();
    console.log("Build is completed");
  } catch (error: any) {
    console.log("Build is failed");
    console.log(error.message);
    return;
  }
}

function build(): Promise<void> {
  if (!existsSync(sourceFilePath)) {
    throw new Error(`The source file '${sourceFilePath}' is not found`);
  }

  const compiler = webpack({
    entry: sourceFilePath,
    mode: "production",
    target: "node",
    optimization: {
      minimize: true,
    },
    output: {
      library: {
        type: "commonjs2",
      },
      filename: "connector.js",
    },
  });

  return new Promise((resolve, reject) => {
    compiler.run((err) => {
      if (err) {
        reject(err);
      }

      compiler.close((err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  });
}