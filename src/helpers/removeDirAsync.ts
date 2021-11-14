import fsAsync from 'fs/promises';

const removeDirAsync = async (removePath: string, recursive = false) => {
  try {
    const fileStats = await fsAsync.stat(removePath);

    if (fileStats) {
      try {
        await fsAsync.rm(removePath, { recursive });

        return true;
      } catch (ex) {
        throw Error(`Problem removing: ${ex}`);
      }
    }
  } catch { }

  return false;
};

export default removeDirAsync;
