# Product Specifications API

A serverless AWS solution for managing and retrieving product specifications through a REST API. Built with AWS Lambda, DynamoDB, and API Gateway.

## 🏗️ Architecture

This solution implements a serverless architecture using:

- **AWS Lambda**: Serverless compute for API endpoints
- **Amazon DynamoDB**: NoSQL database for product data storage
- **AWS API Gateway**: REST API management and routing
- **AWS IAM**: Security and access management
- **AWS CDK**: Infrastructure as Code

## 📋 Features

- **Flexible Product Storage**: JSON-based product specifications with dynamic schema
- **REST API Endpoints**: 
  - `GET /api/products` - Retrieve all products
  - `GET /api/products/{id}` - Retrieve specific product by ID
- **Sample Data**: Pre-populated with diverse product categories
- **Error Handling**: Comprehensive error responses with appropriate HTTP status codes
- **CORS Support**: Cross-origin resource sharing enabled
- **Scalable**: Auto-scaling DynamoDB with provisioned throughput

## 🚀 Quick Start

### Prerequisites

- AWS CLI configured with appropriate permissions
- Node.js 18+ installed
- AWS CDK CLI installed (`npm install -g aws-cdk`)

### Deployment

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd sp-API-20251115-112943
   ```

2. **Deploy the CDK stack**
   ```bash
   cd cdk
   npm install
   cdk deploy
   ```

3. **Populate sample data**
   ```bash
   # The seeder function will be automatically invoked during deployment
   # Or manually invoke: aws lambda invoke --function-name DataSeeder20251115112943 response.json
   ```

## 📊 Sample Data

The API comes pre-loaded with sample products including:

- **Electronics**: iPhone 15 Pro, MacBook Pro, Samsung Galaxy S24 Ultra, Sony WH-1000XM5
- **Footwear**: Nike Air Max 270

Each product includes:
- Basic information (name, category, brand)
- Flexible specifications (price, features, technical details)
- Timestamps (created_at, updated_at)

## 🔧 API Usage

### Get All Products

```bash
curl -X GET https://your-api-gateway-url/api/products
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "product_id": "prod_001",
      "name": "iPhone 15 Pro",
      "category": "Electronics",
      "brand": "Apple",
      "specifications": {
        "price": 999.99,
        "storage": "256GB",
        "color": "Natural Titanium",
        "display": "6.1-inch Super Retina XDR",
        "camera": "48MP Main camera"
      },
      "created_at": "2025-11-15T16:47:43.979Z",
      "updated_at": "2025-11-15T16:47:43.981Z"
    }
  ],
  "count": 5
}
```

### Get Product by ID

```bash
curl -X GET https://your-api-gateway-url/api/products/prod_001
```

**Response:**
```json
{
  "success": true,
  "data": {
    "product_id": "prod_001",
    "name": "iPhone 15 Pro",
    "category": "Electronics",
    "brand": "Apple",
    "specifications": {
      "price": 999.99,
      "storage": "256GB",
      "color": "Natural Titanium",
      "display": "6.1-inch Super Retina XDR",
      "camera": "48MP Main camera"
    },
    "created_at": "2025-11-15T16:47:43.979Z",
    "updated_at": "2025-11-15T16:47:43.981Z"
  }
}
```

## 📁 Project Structure

```
sp-API-20251115-112943/
├── README.md                           # This file
├── PROJECT_SUMMARY.md                  # Detailed project summary
├── cdk/                               # AWS CDK Infrastructure
│   ├── lib/cdk-stack.ts              # CDK stack definition
│   ├── bin/cdk.ts                    # CDK app entry point
│   ├── package.json                  # CDK dependencies
│   └── test/                         # CDK tests
├── lambda/                           # Lambda function source
│   ├── index.js                      # Main API handler
│   ├── seeder.js                     # Data seeding function
│   └── package.json                  # Lambda dependencies
├── generated-diagrams/               # Architecture diagrams
│   ├── sp-api-architecture.png       # High-level architecture
│   └── sp-api-detailed-architecture.png # Detailed architecture
├── specs/                           # Project specifications
│   ├── requirements.md              # Requirements document
│   ├── design.md                    # Design document
│   └── tasks.md                     # Task breakdown
├── pricing/                         # Cost analysis
│   └── detailed-pricing-analysis.md # AWS cost breakdown
└── cloudformation-template.yaml     # CloudFormation template
```

## 🏛️ Infrastructure

### DynamoDB Table
- **Name**: `ProductSpecifications20251115112943`
- **Partition Key**: `product_id` (String)
- **Billing**: Provisioned (5 RCU/5 WCU with auto-scaling)

### Lambda Functions
- **API Handler**: `ProductsApi20251115112943`
  - Runtime: Node.js 22.x
  - Memory: 128 MB
  - Timeout: 30 seconds

- **Data Seeder**: `DataSeeder20251115112943`
  - Runtime: Node.js 22.x
  - Memory: 128 MB
  - Timeout: 60 seconds

### IAM Role
- **Name**: `ProductsApiRole20251115112943`
- **Policies**: Lambda execution + DynamoDB access

## 💰 Cost Estimation

Based on moderate usage (1000 requests/month):
- **DynamoDB**: ~$1.25/month (provisioned capacity)
- **Lambda**: ~$0.20/month (compute time)
- **API Gateway**: ~$3.50/month (API calls)
- **Total**: ~$5/month

See `pricing/detailed-pricing-analysis.md` for detailed cost breakdown.

## 🧪 Testing

The solution includes comprehensive testing:

1. **Unit Tests**: CDK stack validation
2. **Integration Tests**: Lambda function testing
3. **API Tests**: End-to-end API validation

Run tests:
```bash
cd cdk
npm test
```

## 🔒 Security

- **IAM Least Privilege**: Functions have minimal required permissions
- **VPC**: Can be deployed in VPC for additional security
- **Encryption**: DynamoDB encryption at rest enabled
- **HTTPS**: All API calls encrypted in transit

## 📈 Monitoring

The solution includes:
- **CloudWatch Logs**: Function execution logs
- **CloudWatch Metrics**: Performance and error metrics
- **X-Ray Tracing**: Distributed tracing (optional)

## 🔄 CI/CD

Ready for CI/CD integration with:
- **GitHub Actions**: Workflow templates included
- **AWS CodePipeline**: CDK deployment pipeline
- **Testing**: Automated testing on deployment

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 📞 Support

For questions or issues:
- Create an issue in this repository
- Check the `specs/` directory for detailed documentation
- Review the `PROJECT_SUMMARY.md` for implementation details

## 🎯 Future Enhancements

- [ ] Add authentication/authorization
- [ ] Implement CRUD operations (POST, PUT, DELETE)
- [ ] Add data validation and sanitization
- [ ] Implement pagination
- [ ] Add search and filtering capabilities
- [ ] Performance optimization
- [ ] Enhanced monitoring and alerting
