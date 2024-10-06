const { CosmosClient } = require('@azure/cosmos');

const endpoint = process.env.COSMOS_DB_ENDPOINT;
const key = process.env.COSMOS_DB_KEY;
const databaseId = process.env.COSMOS_DB_DATABASE_ID;
const containerId = process.env.COSMOS_DB_CONTAINER_ID;

const client = new CosmosClient({ endpoint, key });

module.exports = async function (context, req) {
  const itemBody = req.body;

  try {
    const { container } = client.database(databaseId).container(containerId);
    const { resource: createdItem } = await container.items.upsert(itemBody);

    context.res = {
      status: 200,
      body: createdItem,
    };
  } catch (error) {
    context.log.error('Error creating item:', error);
    context.res = {
      status: 500,
      body: error.message,
    };
  }
};
