import * as cdk from 'aws-cdk-lib';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import { Construct } from 'constructs';
import * as path from 'path';

export class SpApiStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const suffix = '20251115112943';

    // DynamoDB Table
    const productsTable = new dynamodb.Table(this, `ProductSpecifications${suffix}`, {
      tableName: `ProductSpecifications${suffix}`,
      partitionKey: { name: 'product_id', type: dynamodb.AttributeType.STRING },
      billingMode: dynamodb.BillingMode.PROVISIONED,
      readCapacity: 5,
      writeCapacity: 5,
      removalPolicy: cdk.RemovalPolicy.DESTROY
    });

    // Enable auto scaling
    productsTable.autoScaleReadCapacity({
      minCapacity: 1,
      maxCapacity: 10
    });

    productsTable.autoScaleWriteCapacity({
      minCapacity: 1,
      maxCapacity: 10
    });

    // Lambda function for API operations
    const apiFunction = new lambda.Function(this, `ProductsApi${suffix}`, {
      functionName: `ProductsApi${suffix}`,
      runtime: lambda.Runtime.NODEJS_22_X,
      handler: 'index.handler',
      code: lambda.Code.fromAsset(path.join(__dirname, '../../lambda')),
      environment: {
        TABLE_NAME: productsTable.tableName
      },
      timeout: cdk.Duration.seconds(30)
    });

    // Grant DynamoDB permissions
    productsTable.grantReadWriteData(apiFunction);

    // Data seeder Lambda
    const seederFunction = new lambda.Function(this, `DataSeeder${suffix}`, {
      functionName: `DataSeeder${suffix}`,
      runtime: lambda.Runtime.NODEJS_22_X,
      handler: 'seeder.handler',
      code: lambda.Code.fromAsset(path.join(__dirname, '../../lambda')),
      environment: {
        TABLE_NAME: productsTable.tableName
      },
      timeout: cdk.Duration.seconds(60)
    });

    productsTable.grantWriteData(seederFunction);

    // API Gateway
    const api = new apigateway.RestApi(this, `ProductsRestApi${suffix}`, {
      restApiName: `ProductsApi${suffix}`,
      defaultCorsPreflightOptions: {
        allowOrigins: apigateway.Cors.ALL_ORIGINS,
        allowMethods: apigateway.Cors.ALL_METHODS,
        allowHeaders: ['Content-Type', 'X-Amz-Date', 'Authorization', 'X-Api-Key']
      }
    });

    const apiResource = api.root.addResource('api');
    const productsResource = apiResource.addResource('products');

    // GET /api/products
    productsResource.addMethod('GET', new apigateway.LambdaIntegration(apiFunction));

    // GET /api/products/{id}
    const productResource = productsResource.addResource('{id}');
    productResource.addMethod('GET', new apigateway.LambdaIntegration(apiFunction));

    // Trigger data seeding manually after deployment
    new cdk.CfnOutput(this, 'SeederFunctionName', {
      value: seederFunction.functionName,
      description: 'Data Seeder Function Name'
    });

    // Outputs
    new cdk.CfnOutput(this, 'ApiUrl', {
      value: api.url,
      description: 'API Gateway URL'
    });

    new cdk.CfnOutput(this, 'TableName', {
      value: productsTable.tableName,
      description: 'DynamoDB Table Name'
    });
  }
}
