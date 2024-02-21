const NL2Mongo = require('nl2mongo');
console.log('Loading function');

exports.handler = async (event) => {
  console.log('Received event:', JSON.stringify(event, null, 2));
  const NL_QUERY = event?.query;
  NL2Mongo.setSecretKeys(process.env);
  const MONGO_QUERY = await NL2Mongo.getQuery(NL_QUERY);
  console.log('[NAVA] MONGO_QUERY', MONGO_QUERY);
  return MONGO_QUERY;
};
