const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, PutCommand } = require('@aws-sdk/lib-dynamodb');

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

const TABLE_NAME = process.env.TABLE_NAME;

const sampleProducts = [
  {
    product_id: 'prod_001',
    name: 'iPhone 15 Pro',
    category: 'Electronics',
    brand: 'Apple',
    specifications: {
      price: 999.99,
      storage: '256GB',
      color: 'Natural Titanium',
      display: '6.1-inch Super Retina XDR',
      camera: '48MP Main camera'
    },
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    product_id: 'prod_002',
    name: 'MacBook Pro 14-inch',
    category: 'Electronics',
    brand: 'Apple',
    specifications: {
      price: 1999.99,
      processor: 'M3 Pro chip',
      memory: '16GB',
      storage: '512GB SSD',
      display: '14.2-inch Liquid Retina XDR'
    },
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    product_id: 'prod_003',
    name: 'Samsung Galaxy S24 Ultra',
    category: 'Electronics',
    brand: 'Samsung',
    specifications: {
      price: 1199.99,
      storage: '256GB',
      color: 'Titanium Black',
      display: '6.8-inch Dynamic AMOLED 2X',
      camera: '200MP Main camera'
    },
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    product_id: 'prod_004',
    name: 'Nike Air Max 270',
    category: 'Footwear',
    brand: 'Nike',
    specifications: {
      price: 150.00,
      size: 'US 10',
      color: 'Black/White',
      material: 'Mesh and synthetic leather',
      type: 'Running shoes'
    },
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    product_id: 'prod_005',
    name: 'Sony WH-1000XM5',
    category: 'Electronics',
    brand: 'Sony',
    specifications: {
      price: 399.99,
      type: 'Wireless Noise Canceling Headphones',
      color: 'Black',
      battery_life: '30 hours',
      connectivity: 'Bluetooth 5.2'
    },
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];

exports.handler = async (event) => {
  console.log('Seeder event:', JSON.stringify(event, null, 2));
  
  try {
    await seedData();
    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        message: 'Sample data seeded successfully',
        count: sampleProducts.length
      })
    };
  } catch (error) {
    console.error('Error seeding data:', error);
    throw error;
  }
};

async function seedData() {
  console.log(`Seeding ${sampleProducts.length} products to table: ${TABLE_NAME}`);
  
  for (const product of sampleProducts) {
    const command = new PutCommand({
      TableName: TABLE_NAME,
      Item: product
    });
    
    await docClient.send(command);
    console.log(`Seeded product: ${product.product_id}`);
  }
  
  console.log('Data seeding completed successfully');
}
