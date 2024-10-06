const { CosmosClient } = require('@azure/cosmos');

const endpoint = process.env.COSMOS_DB_ENDPOINT;
const key = process.env.COSMOS_DB_KEY;
const databaseId = process.env.COSMOS_DB_DATABASE_ID;
const containerId = process.env.COSMOS_DB_CONTAINER_ID;

const client = new CosmosClient({ endpoint, key });

module.exports = async function (context, req) {
  const query = req.query.query || 'SELECT * FROM c';

  try {
    const { container } = client.database(databaseId).container(containerId);
    const { resources: items } = await container.items.query(query).fetchAll();

    context.res = {
      status: 200,
      body: items,
    };
  } catch (error) {
    context.log.error('Error querying items:', error);
    context.res = {
      status: 500,
      body: error.message,
    };
  }
};
