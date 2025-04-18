import fs from 'fs';
import path from 'path';

const config = {
  boilerplateComponentName: 'component',
  boilerplateDirectory: 'convenience/generate-component/boilerplate',
  sourceDirectory: 'src/components',
};

const getBoilerplateFiles = async (_sourceFiles?: string, _foundFiles?: string[]): Promise<string[]> => {
  try {
    const readInDir = _sourceFiles || config.boilerplateDirectory;
    const sourceFiles = await fs.promises.readdir(readInDir);
    const foundFiles = _foundFiles || [];

    for await (const file of sourceFiles) {

      const fromPath = path.join(_sourceFiles || config.boilerplateDirectory, file);
      const stat = await fs.promises.stat(fromPath);

      if (stat.isFile()) {
        foundFiles.push(fromPath);
      } else if (stat.isDirectory()) {
        await getBoilerplateFiles(fromPath, foundFiles);
      }

    }

    return foundFiles;
  } catch (e) {
    // Catch anything bad that happens
    console.error('There was an error iterating over the boilerplate files... ', e);

    return [];
  }
};

const createDirectories = (targetDirectory: string): void => {
  fs.mkdirSync(targetDirectory);
};

const copyFiles = (foundFiles: string[], componentName: string, targetDirectory: string): void => {
  foundFiles.forEach((file) => {
    try {
      const fileData = fs.readFileSync(file, 'utf8');

      const fileDataWithCorrectName = fileData
        .replace(/__name__/gu, componentName)
        .replace(/__nameLowerCase__/gu, componentName.toLocaleLowerCase());

      try {
        const relativePath = path.relative(config.boilerplateDirectory, file);
        const fileName = relativePath.replace(`${config.boilerplateComponentName}.`, `${componentName}.`);
        const targetPath = `${targetDirectory}/${fileName}`;

        fs.writeFileSync(targetPath, fileDataWithCorrectName);

      } catch (err) {
        console.error(err);
      }

    } catch (err) {
      console.log(`error processing boilerplate file ${file}: ${err}`);
    }
  });
};

(async (): Promise<void> => {

  // make sure we get a component name passed as an argument
  const args = process.argv.slice(2);

  if (args.length !== 1) {
    console.log(`
Please pass a component name like so:
npm run generate ComponentName
    `);

    return;
  }

  const [componentName] = args;
  const targetDirectory = `${config.sourceDirectory}/${componentName}`;

  // check if a component with the passed name does not already exist
  if (fs.existsSync(targetDirectory)) {
    console.log(`A component with the name ${componentName} already exists`);

    return;
  }

  const foundFiles = await getBoilerplateFiles();

  if (foundFiles.length < 1) {
    console.log('Could not find boilerplate files');

    return;
  }

  createDirectories(targetDirectory);
  copyFiles(foundFiles, componentName, targetDirectory);

})();
