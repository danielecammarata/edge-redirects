# Lambda Edge Redirect Generator

This project generates an AWS Lambda function that handles URL redirects. The Lambda function redirects requests based on the request path to different predefined URLs.

## Prerequisites

- [Bun](https://bun.sh) - Make sure you have Bun installed on your system.

## Usage

To generate the AWS Lambda function code, run the Bun program:

```sh
bun run exec --file a-valid-json.json
```

This will generate a `lambda_function.js` file in your project directory containing the AWS Lambda function code for all the redirects.


The possible parameters are:

### --file
expects a valid JSON file containing an array of objects with the keys, `from`, and `to`, for example:

```json
[{
  "from": "/old",
  "to": "/new"
}, {
  "from": "/another-old",
  "to": "/another-new"
}]
```

### --from --to
both parameters to generate a single redirect rule. for example:

```sh
bun run exec --from /old --to /new 
```

## Generated Lambda Function

The generated `lambda_function.js` will look like this:

```js
exports.handler = async (event, context, callback) => {
  let request = event.Records[0].cf.request;
  const uri = request.uri;
  console.log(uri);

  switch (true) {
    case uri === "/some-url": {
      const redirectResponse = {
        status: '301',
        statusDescription: 'Moved Permanently',
        headers: {
          'location': [{ key: 'Location', value: "/the-new-url/" }],
          'cache-control': [{ key: 'Cache-Control', value: "max-age=3600" }],
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
```

In this setup, accessing `/some-url` will redirect to `/the-new-url/`.
