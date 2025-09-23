export const subscribe = async (): Promise<boolean> => {

  // TEMP: until we do async work (send mail), we silence the warning
  // with some kind of await
  await new Promise((resolve) => setTimeout(resolve, 0));

  // TODO: implement newsletter subscription API
  return true;
};
