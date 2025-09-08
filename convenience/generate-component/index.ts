import fs from 'fs';
import path from 'path';
import inquirer from 'inquirer';

const config = {
  boilerplateComponentName: 'component',
  boilerplateDirectory: 'convenience/generate-component/boilerplate',
  sourceDirectory: 'src/components',
  subDirectories: {
    base: 'base',
    block: 'block',
    global: 'global',
  },
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

const copyFiles = (foundFiles: string[], componentName: string, targetDirectory: string, componentFolder: string): void => {
  foundFiles.forEach((file) => {
    try {
      const fileData = fs.readFileSync(file, 'utf8');

      const fileDataWithCorrectName = fileData
        .replaceAll(/__name__/gu, componentName)
        .replaceAll(/__nameLowerCase__/gu, componentName.toLocaleLowerCase())
        .replaceAll(/__componentFolder__/gu, componentFolder);

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

type ComponentType = 'base' | 'block' | 'global';

await (async (): Promise<void> => {

  try {

    // ask for component type and name
    const answerBase: ComponentType = 'base';
    const answerBlock: ComponentType = 'block';
    const answerGlobal: ComponentType = 'global';

    const componentAnswer = await inquirer.prompt([
      {
        choices: [
          answerBase,
          answerBlock,
          answerGlobal,
        ],
        message: 'What kind of component do you want to generate?',
        name: 'componentType',
        type: 'list',
      },
      {
        message: 'How should the component be named? (use Pascal Case, e.g.: FooBar)',
        name: 'componentName',
        required: true,
        type: 'input',
      },
    ]);

    const targetDirectory = `${config.sourceDirectory}/${componentAnswer.componentType}/${componentAnswer.componentName}`;

    // check if a component with the passed name does not already exist
    if (fs.existsSync(targetDirectory)) {
      throw new Error(`A component with the name ${componentAnswer.componentName} already exists in the folder ${componentAnswer.componentType}`);
    }

    const foundFiles = await getBoilerplateFiles();

    if (foundFiles.length < 1) {
      throw new Error('Could not find boilerplate files');
    }

    // create directories and copy files
    createDirectories(targetDirectory);
    copyFiles(foundFiles, componentAnswer.componentName, targetDirectory, componentAnswer.componentType);

    console.log(`Successfully created component ${componentAnswer.componentName}`);

  } catch (e) {
    console.log(e);
  }
})();
