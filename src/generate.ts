export type Redirect = {
  from: string,
  to: string,
}

// Generate AWS Lambda function code for redirects
const generateLambdaCode = (redirects: Array<Redirect>) => `
exports.handler = async (event, context, callback) => {
  let request = event.Records[0].cf.request;

  const uri = request.uri;

  switch(true) {
    ${redirects.map(({ from, to }) => `case uri === "${from}": {
      const redirectResponse = {
        status: '301',
        statusDescription: 'Moved Permanently',
        headers: {
          'location': [{
            key: 'Location',
            value: "${to}",
          }],
          'cache-control': [{
            key: 'Cache-Control',
            value: "max-age=3600"
          }],
        },
      };
      callback(null, redirectResponse);
      break;
    }`).join('\n    ')}
    default: {    
      callback(null, request);
    }
  }
};
`;

export const redirects = (list: Array<Redirect>) => {
  const lambdaCode = generateLambdaCode(list);
  Bun.write('lambda_function.js', lambdaCode)
    .then(() => console.log('Generated lambda_function.js'))
    .catch((err) => console.error(`Failed to write file: ${err}`));
}