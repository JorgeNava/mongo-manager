const MongoClient = require('mongodb').MongoClient;
let cachedClient = null;

console.log('Loading function');

async function connectToDatabase(uri) {
  if (cachedClient && cachedClient.isConnected()) {
    return cachedClient;
  }
  cachedClient = await MongoClient.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
  return cachedClient;
}
class DatabaseQuery {
  static async handle(queryDefinition) {
    DatabaseQuery.validateQueryDefinition(queryDefinition);

    const url = process.env.MONGO_ASSISTANTE_DATABASE_URI;
    const dbName = process.env.MONGO_ASSISSTANT_DATABASE_NAME;
    let client;

    try {
      client = await connectToDatabase(url);
      const db = client.db(dbName);
      const collection = db.collection(queryDefinition.meta.collection);

      const operationResult = await collection[queryDefinition.meta.type](queryDefinition.query);
      const records = operationResult.toArray ? await operationResult.toArray() : operationResult;

      return records;
    } catch (error) {
      console.error('Error during database operation', error);
      throw error;
    } finally {
      if (client) {
        await client.close();
      }
    }
  }

  static validateQueryDefinition(queryDefinition) {
    if (!queryDefinition || typeof queryDefinition !== 'object') {
      throw new Error('queryDefinition must be an object');
    }
    if (!queryDefinition.query || !Array.isArray(queryDefinition.query)) {
      throw new Error('queryDefinition.query must be an array');
    }
    if (!queryDefinition.meta || typeof queryDefinition.meta !== 'object') {
      throw new Error('queryDefinition.meta must be an object');
    }
    if (!queryDefinition.meta.type || typeof queryDefinition.meta.type !== 'string') {
      throw new Error('queryDefinition.meta.type must be a string');
    }
    const validTypes = ["insert", "findOne", "find", "updateOne", "updateMany", "deleteOne", "deleteMany", "aggregate"];
    if (!validTypes.includes(queryDefinition.meta.type)) {
      throw new Error(`queryDefinition.meta.type must be one of the following values: ${validTypes.join(', ')}`);
    }
    if (!queryDefinition.meta.collection || typeof queryDefinition.meta.collection !== 'string') {
      throw new Error('queryDefinition.meta.collection must be a string');
    }
  }
}

exports.handler = async (event) => {
  console.log('Received event:', JSON.stringify(event, null, 2));
  const records = await DatabaseQuery.handle(event);
  return records;
};
