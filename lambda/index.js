const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, ScanCommand, GetCommand } = require('@aws-sdk/lib-dynamodb');

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

const TABLE_NAME = process.env.TABLE_NAME;

exports.handler = async (event) => {
  console.log('Event:', JSON.stringify(event, null, 2));
  
  try {
    const { httpMethod, pathParameters } = event;
    
    if (httpMethod === 'GET') {
      if (pathParameters && pathParameters.id) {
        // Get single product
        return await getProductById(pathParameters.id);
      } else {
        // Get all products
        return await getAllProducts();
      }
    }
    
    return {
      statusCode: 405,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        success: false,
        error: 'Method not allowed'
      })
    };
  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        success: false,
        error: 'Internal server error'
      })
    };
  }
};

async function getAllProducts() {
  const command = new ScanCommand({
    TableName: TABLE_NAME
  });
  
  const result = await docClient.send(command);
  
  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify({
      success: true,
      data: result.Items || [],
      count: result.Items ? result.Items.length : 0
    })
  };
}

async function getProductById(productId) {
  const command = new GetCommand({
    TableName: TABLE_NAME,
    Key: {
      product_id: productId
    }
  });
  
  const result = await docClient.send(command);
  
  if (!result.Item) {
    return {
      statusCode: 404,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        success: false,
        error: 'Product not found',
        code: 'PRODUCT_NOT_FOUND'
      })
    };
  }
  
  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify({
      success: true,
      data: result.Item
    })
  };
}
