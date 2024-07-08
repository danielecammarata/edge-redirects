import { parseArgs } from "util";
import { fileValidation } from "./validation";
import { redirects } from "./generate";

const { values, positionals } = parseArgs({
  args: Bun.argv,
  options: {
    from: {
      type: 'string',
    },
    to: {
      type: 'string',
    },
    file: {
      type: 'string',
    },
  },
  strict: true,
  allowPositionals: true,
});

if (values.file) {
  const isValid = await fileValidation(`./${values.file}`)
  
  if (!isValid) {
    console.log(`File is not valid: ${values.file}`)
    process.exit(1);
  }
  const file = Bun.file(values.file);
  const text = await file.text();
  const list = JSON.parse(text);
  redirects(list);
} else {
  const hasValidArguments = Boolean(values.from && values.to);
  if (!hasValidArguments) {
    console.log(`Missing argument between from: ${values.from} and to: ${values.to}`)
    process.exit(1);
  }
  redirects([{
    from: values.from!,
    to: values.to!,
  }]);
}



