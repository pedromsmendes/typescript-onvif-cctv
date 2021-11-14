import fsAsync from 'fs/promises';

const createDirAsync = async (folderPath: string, recursive = false) => {
  try {
    await fsAsync.stat(folderPath);
  } catch {
    try {
      await fsAsync.mkdir(folderPath, { recursive });
    } catch (ex) {
      throw Error(`Problem creating directory: ${ex}`);
    }
  }

  return folderPath;
};

export default createDirAsync;
