import inquirer from 'inquirer';
import boxen from 'boxen';

export const inquirerAskForProceed = async (message: string): Promise<boolean> => {
  console.log(boxen(message, {
    padding: 1,
  }));

  const answerNo = 'No';
  const answers = await inquirer.prompt([
    {
      choices: [
        answerNo,
        'Yes',
      ],
      message: 'Are you sure you want to continue?',
      name: 'proceed',
      type: 'list',
    },
  ]);

  return answers.proceed !== answerNo;
};

export const inquirerAskBucketToRestore = async (buckets: (string | undefined)[]): Promise<string> => {

  const answers = await inquirer.prompt([
    {
      choices: buckets.filter((bucket) => (bucket !== undefined)),
      message: 'Select the backup which should be restored.',
      name: 'bucket',
      type: 'list',
    },
  ]);

  return answers.bucket;
};

export const inquirerAskForOption = async (message: string, options: Record<string, string>): Promise<string | undefined> => {
  const choices = Object.keys(options)
    .map((choice: string) => options[choice]);

  const answers = await inquirer.prompt([
    {
      choices,
      message,
      name: 'selectedOption',
      type: 'list',
    },
  ]);

  const selection = Object.keys(options)
    .find((key) => options[key] === answers.selectedOption);

  return selection;
};

export const inquirerAskMultipleChoice = async (message: string, choices: (string | undefined)[]): Promise<(string | undefined)[]> => {

  const nonNullChoices = choices.filter((choice) => choice !== undefined);

  const answers = await inquirer.prompt([
    {
      choices: nonNullChoices,
      message,
      name: 'selectedOption',
      type: 'checkbox',
    },
  ]);

  return answers.selectedOption;
};
