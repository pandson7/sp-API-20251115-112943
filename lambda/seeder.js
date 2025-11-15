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
  },
  {
    product_id: 'prod_006',
    name: 'Levi\'s 501 Original Jeans',
    category: 'Clothing',
    brand: 'Levi\'s',
    specifications: {
      price: 89.99,
      size: '32x32',
      color: 'Dark Blue',
      material: '100% Cotton',
      fit: 'Straight'
    },
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    product_id: 'prod_007',
    name: 'KitchenAid Stand Mixer',
    category: 'Home & Kitchen',
    brand: 'KitchenAid',
    specifications: {
      price: 379.99,
      model: 'Artisan Series',
      color: 'Empire Red',
      capacity: '5 Quart',
      power: '325 Watts'
    },
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    product_id: 'prod_008',
    name: 'Adidas Ultraboost 22',
    category: 'Footwear',
    brand: 'Adidas',
    specifications: {
      price: 190.00,
      size: 'US 9.5',
      color: 'Core Black',
      material: 'Primeknit upper',
      type: 'Running shoes'
    },
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    product_id: 'prod_009',
    name: 'Dell XPS 13',
    category: 'Electronics',
    brand: 'Dell',
    specifications: {
      price: 1299.99,
      processor: 'Intel Core i7-1360P',
      memory: '16GB LPDDR5',
      storage: '512GB SSD',
      display: '13.4-inch FHD+'
    },
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    product_id: 'prod_010',
    name: 'Patagonia Better Sweater Jacket',
    category: 'Clothing',
    brand: 'Patagonia',
    specifications: {
      price: 139.00,
      size: 'Medium',
      color: 'Navy Blue',
      material: '100% Recycled Polyester Fleece',
      type: 'Fleece Jacket'
    },
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    product_id: 'prod_011',
    name: 'Yeti Rambler Tumbler',
    category: 'Home & Kitchen',
    brand: 'Yeti',
    specifications: {
      price: 35.00,
      size: '20 oz',
      color: 'Stainless Steel',
      material: 'Double-wall vacuum insulation',
      type: 'Travel mug'
    },
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    product_id: 'prod_012',
    name: 'Wilson Pro Staff Tennis Racket',
    category: 'Sports & Outdoors',
    brand: 'Wilson',
    specifications: {
      price: 249.99,
      weight: '315g',
      head_size: '97 sq in',
      string_pattern: '16x19',
      grip_size: '4 3/8'
    },
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];

exports.handler = async (event) => {
  console.log('Seeder event:', JSON.stringify(event, null, 2));
  
  try {
    // Check if this is a CloudFormation custom resource event
    if (event.RequestType) {
      await seedData();
      
      // Send response back to CloudFormation
      const response = {
        Status: 'SUCCESS',
        PhysicalResourceId: 'data-seeder-' + Date.now(),
        Data: {
          Message: 'Sample data seeded successfully'
        }
      };
      
      if (event.ResponseURL) {
        await sendResponse(event, response);
      }
      
      return response;
    }
    
    // Direct invocation
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
    
    if (event.RequestType && event.ResponseURL) {
      await sendResponse(event, {
        Status: 'FAILED',
        PhysicalResourceId: 'data-seeder-' + Date.now(),
        Reason: error.message
      });
    }
    
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

async function sendResponse(event, response) {
  const https = require('https');
  const url = require('url');
  
  const responseBody = JSON.stringify(response);
  const parsedUrl = url.parse(event.ResponseURL);
  
  const options = {
    hostname: parsedUrl.hostname,
    port: 443,
    path: parsedUrl.path,
    method: 'PUT',
    headers: {
      'Content-Type': '',
      'Content-Length': responseBody.length
    }
  };
  
  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      console.log('Response status:', res.statusCode);
      resolve();
    });
    
    req.on('error', (err) => {
      console.error('Error sending response:', err);
      reject(err);
    });
    
    req.write(responseBody);
    req.end();
  });
}
