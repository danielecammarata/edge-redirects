export const fileValidation = async (filename: string) => {
  try {
    const file = Bun.file(filename);
    const fileExists = await file.exists();

    if (fileExists) {
      const text = await file.text();
      const redirects = JSON.parse(text);
      return true;
    }
  } catch(err) {
    console.error(err);
  }

  return false;
};
