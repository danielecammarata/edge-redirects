import { expect, test, mock } from "bun:test";
import { redirects } from './generate';
import { Module } from 'module';

const callbackGenerator = (toPath: string) => (_: null, redirectResponse: any) => {
  expect(redirectResponse.status).toEqual('301');
  expect(redirectResponse.statusDescription).toEqual('Moved Permanently');
  expect(redirectResponse.headers.location[0].value).toEqual(toPath); 
}

const eventGenerator = (fromPath: string) => ({
  Records: [
    {
      cf: {
        request: {
          uri: fromPath
        }
      }
    }
  ]
});

let lambdaCode = '';
const mockFileWrite = mock((fileName, content): Promise<number> => {
  return new Promise((resolve) => {
    lambdaCode = content;
    return resolve(5)
  });
})
global.Bun.write = mockFileWrite;

test('Generated file content', async () => {
  await redirects([{
    from: '/old-url',
    to: '/new-url',
  }])
  expect(lambdaCode).toEqual(`
exports.handler = async (event, context, callback) => {
  let request = event.Records[0].cf.request;

  const uri = request.uri;

  switch(true) {
    case uri === "/old-url": {
      const redirectResponse = {
        status: '301',
        statusDescription: 'Moved Permanently',
        headers: {
          'location': [{
            key: 'Location',
            value: "/new-url",
          }],
          'cache-control': [{
            key: 'Cache-Control',
            value: "max-age=3600"
          }],
        },
      };
      callback(null, redirectResponse);
      break;
    }
    default: {    
      callback(null, request);
    }
  }
};
`)
});
