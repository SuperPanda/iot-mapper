'use strict';

// Your first function handler
module.exports.helloFunc = (event, context, cb) => {
  cb(null, { message: 'Go Serverless v1.0! Your function executed successfully!', event });
};

// You can add more handlers here, and reference them in serverless.yml
modules.exports.getLocation = (event, context,cb) => {
 cb(null, { deviceId: 'test', payload: { lat: 1.0, lng: 0.5 }, event});
};
