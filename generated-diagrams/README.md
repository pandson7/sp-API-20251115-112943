# Product Specifications API - Architecture Diagrams

## Generated Diagrams

### 1. Basic Architecture (sp-api-architecture.png)
- **Purpose**: High-level overview of the serverless architecture
- **Components**:
  - Client (User)
  - API Gateway (REST API)
  - Lambda Functions (getProducts, dataSeeder)
  - DynamoDB (ProductSpecifications Table)

### 2. Detailed Architecture (sp-api-detailed-architecture.png)
- **Purpose**: Comprehensive view including security, monitoring, and operational aspects
- **Components**:
  - API Layer: API Gateway with throttling
  - Compute Layer: Lambda functions with IAM roles
  - Data Layer: DynamoDB with on-demand billing
  - Monitoring: CloudWatch for logs and metrics

## Architecture Highlights

### API Endpoints
- `GET /api/products` - Retrieve all products
- `GET /api/products/{id}` - Retrieve specific product by ID

### Lambda Configuration
- **Runtime**: Node.js 18.x
- **Memory**: 256 MB
- **Timeout**: 30 seconds
- **IAM**: Minimal permissions for DynamoDB access

### DynamoDB Configuration
- **Table Name**: ProductSpecifications
- **Partition Key**: product_id (String)
- **Billing Mode**: On-demand
- **Access Pattern**: Direct Lambda access only

### Security Features
- API Gateway throttling enabled
- IAM roles with minimal permissions
- Input validation on all endpoints
- DynamoDB access restricted to Lambda functions

### Monitoring & Observability
- CloudWatch Logs for all Lambda functions
- API Gateway access logging
- DynamoDB metrics monitoring
- Error tracking and alerting

## Data Model
The API handles product specifications with flexible schema including:
- Basic product information (name, category, brand)
- Dynamic specifications (price, dimensions, materials, etc.)
- Timestamps for creation and updates

## Deployment
- **Infrastructure**: AWS CDK
- **Region**: us-east-1
- **Environment**: Development/prototype
