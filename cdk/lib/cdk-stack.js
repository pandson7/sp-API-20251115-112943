"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SpApiStack = void 0;
const cdk = __importStar(require("aws-cdk-lib"));
const dynamodb = __importStar(require("aws-cdk-lib/aws-dynamodb"));
const lambda = __importStar(require("aws-cdk-lib/aws-lambda"));
const apigateway = __importStar(require("aws-cdk-lib/aws-apigateway"));
const path = __importStar(require("path"));
class SpApiStack extends cdk.Stack {
    constructor(scope, id, props) {
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
exports.SpApiStack = SpApiStack;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2RrLXN0YWNrLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiY2RrLXN0YWNrLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsaURBQW1DO0FBQ25DLG1FQUFxRDtBQUNyRCwrREFBaUQ7QUFDakQsdUVBQXlEO0FBRXpELDJDQUE2QjtBQUU3QixNQUFhLFVBQVcsU0FBUSxHQUFHLENBQUMsS0FBSztJQUN2QyxZQUFZLEtBQWdCLEVBQUUsRUFBVSxFQUFFLEtBQXNCO1FBQzlELEtBQUssQ0FBQyxLQUFLLEVBQUUsRUFBRSxFQUFFLEtBQUssQ0FBQyxDQUFDO1FBRXhCLE1BQU0sTUFBTSxHQUFHLGdCQUFnQixDQUFDO1FBRWhDLGlCQUFpQjtRQUNqQixNQUFNLGFBQWEsR0FBRyxJQUFJLFFBQVEsQ0FBQyxLQUFLLENBQUMsSUFBSSxFQUFFLHdCQUF3QixNQUFNLEVBQUUsRUFBRTtZQUMvRSxTQUFTLEVBQUUsd0JBQXdCLE1BQU0sRUFBRTtZQUMzQyxZQUFZLEVBQUUsRUFBRSxJQUFJLEVBQUUsWUFBWSxFQUFFLElBQUksRUFBRSxRQUFRLENBQUMsYUFBYSxDQUFDLE1BQU0sRUFBRTtZQUN6RSxXQUFXLEVBQUUsUUFBUSxDQUFDLFdBQVcsQ0FBQyxXQUFXO1lBQzdDLFlBQVksRUFBRSxDQUFDO1lBQ2YsYUFBYSxFQUFFLENBQUM7WUFDaEIsYUFBYSxFQUFFLEdBQUcsQ0FBQyxhQUFhLENBQUMsT0FBTztTQUN6QyxDQUFDLENBQUM7UUFFSCxzQkFBc0I7UUFDdEIsYUFBYSxDQUFDLHFCQUFxQixDQUFDO1lBQ2xDLFdBQVcsRUFBRSxDQUFDO1lBQ2QsV0FBVyxFQUFFLEVBQUU7U0FDaEIsQ0FBQyxDQUFDO1FBRUgsYUFBYSxDQUFDLHNCQUFzQixDQUFDO1lBQ25DLFdBQVcsRUFBRSxDQUFDO1lBQ2QsV0FBVyxFQUFFLEVBQUU7U0FDaEIsQ0FBQyxDQUFDO1FBRUgscUNBQXFDO1FBQ3JDLE1BQU0sV0FBVyxHQUFHLElBQUksTUFBTSxDQUFDLFFBQVEsQ0FBQyxJQUFJLEVBQUUsY0FBYyxNQUFNLEVBQUUsRUFBRTtZQUNwRSxZQUFZLEVBQUUsY0FBYyxNQUFNLEVBQUU7WUFDcEMsT0FBTyxFQUFFLE1BQU0sQ0FBQyxPQUFPLENBQUMsV0FBVztZQUNuQyxPQUFPLEVBQUUsZUFBZTtZQUN4QixJQUFJLEVBQUUsTUFBTSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsY0FBYyxDQUFDLENBQUM7WUFDakUsV0FBVyxFQUFFO2dCQUNYLFVBQVUsRUFBRSxhQUFhLENBQUMsU0FBUzthQUNwQztZQUNELE9BQU8sRUFBRSxHQUFHLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUM7U0FDbEMsQ0FBQyxDQUFDO1FBRUgsNkJBQTZCO1FBQzdCLGFBQWEsQ0FBQyxrQkFBa0IsQ0FBQyxXQUFXLENBQUMsQ0FBQztRQUU5QyxxQkFBcUI7UUFDckIsTUFBTSxjQUFjLEdBQUcsSUFBSSxNQUFNLENBQUMsUUFBUSxDQUFDLElBQUksRUFBRSxhQUFhLE1BQU0sRUFBRSxFQUFFO1lBQ3RFLFlBQVksRUFBRSxhQUFhLE1BQU0sRUFBRTtZQUNuQyxPQUFPLEVBQUUsTUFBTSxDQUFDLE9BQU8sQ0FBQyxXQUFXO1lBQ25DLE9BQU8sRUFBRSxnQkFBZ0I7WUFDekIsSUFBSSxFQUFFLE1BQU0sQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFLGNBQWMsQ0FBQyxDQUFDO1lBQ2pFLFdBQVcsRUFBRTtnQkFDWCxVQUFVLEVBQUUsYUFBYSxDQUFDLFNBQVM7YUFDcEM7WUFDRCxPQUFPLEVBQUUsR0FBRyxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDO1NBQ2xDLENBQUMsQ0FBQztRQUVILGFBQWEsQ0FBQyxjQUFjLENBQUMsY0FBYyxDQUFDLENBQUM7UUFFN0MsY0FBYztRQUNkLE1BQU0sR0FBRyxHQUFHLElBQUksVUFBVSxDQUFDLE9BQU8sQ0FBQyxJQUFJLEVBQUUsa0JBQWtCLE1BQU0sRUFBRSxFQUFFO1lBQ25FLFdBQVcsRUFBRSxjQUFjLE1BQU0sRUFBRTtZQUNuQywyQkFBMkIsRUFBRTtnQkFDM0IsWUFBWSxFQUFFLFVBQVUsQ0FBQyxJQUFJLENBQUMsV0FBVztnQkFDekMsWUFBWSxFQUFFLFVBQVUsQ0FBQyxJQUFJLENBQUMsV0FBVztnQkFDekMsWUFBWSxFQUFFLENBQUMsY0FBYyxFQUFFLFlBQVksRUFBRSxlQUFlLEVBQUUsV0FBVyxDQUFDO2FBQzNFO1NBQ0YsQ0FBQyxDQUFDO1FBRUgsTUFBTSxXQUFXLEdBQUcsR0FBRyxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDaEQsTUFBTSxnQkFBZ0IsR0FBRyxXQUFXLENBQUMsV0FBVyxDQUFDLFVBQVUsQ0FBQyxDQUFDO1FBRTdELG9CQUFvQjtRQUNwQixnQkFBZ0IsQ0FBQyxTQUFTLENBQUMsS0FBSyxFQUFFLElBQUksVUFBVSxDQUFDLGlCQUFpQixDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUM7UUFFakYseUJBQXlCO1FBQ3pCLE1BQU0sZUFBZSxHQUFHLGdCQUFnQixDQUFDLFdBQVcsQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUM3RCxlQUFlLENBQUMsU0FBUyxDQUFDLEtBQUssRUFBRSxJQUFJLFVBQVUsQ0FBQyxpQkFBaUIsQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDO1FBRWhGLGlEQUFpRDtRQUNqRCxJQUFJLEdBQUcsQ0FBQyxTQUFTLENBQUMsSUFBSSxFQUFFLG9CQUFvQixFQUFFO1lBQzVDLEtBQUssRUFBRSxjQUFjLENBQUMsWUFBWTtZQUNsQyxXQUFXLEVBQUUsMkJBQTJCO1NBQ3pDLENBQUMsQ0FBQztRQUVILFVBQVU7UUFDVixJQUFJLEdBQUcsQ0FBQyxTQUFTLENBQUMsSUFBSSxFQUFFLFFBQVEsRUFBRTtZQUNoQyxLQUFLLEVBQUUsR0FBRyxDQUFDLEdBQUc7WUFDZCxXQUFXLEVBQUUsaUJBQWlCO1NBQy9CLENBQUMsQ0FBQztRQUVILElBQUksR0FBRyxDQUFDLFNBQVMsQ0FBQyxJQUFJLEVBQUUsV0FBVyxFQUFFO1lBQ25DLEtBQUssRUFBRSxhQUFhLENBQUMsU0FBUztZQUM5QixXQUFXLEVBQUUscUJBQXFCO1NBQ25DLENBQUMsQ0FBQztJQUNMLENBQUM7Q0FDRjtBQTdGRCxnQ0E2RkMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBjZGsgZnJvbSAnYXdzLWNkay1saWInO1xuaW1wb3J0ICogYXMgZHluYW1vZGIgZnJvbSAnYXdzLWNkay1saWIvYXdzLWR5bmFtb2RiJztcbmltcG9ydCAqIGFzIGxhbWJkYSBmcm9tICdhd3MtY2RrLWxpYi9hd3MtbGFtYmRhJztcbmltcG9ydCAqIGFzIGFwaWdhdGV3YXkgZnJvbSAnYXdzLWNkay1saWIvYXdzLWFwaWdhdGV3YXknO1xuaW1wb3J0IHsgQ29uc3RydWN0IH0gZnJvbSAnY29uc3RydWN0cyc7XG5pbXBvcnQgKiBhcyBwYXRoIGZyb20gJ3BhdGgnO1xuXG5leHBvcnQgY2xhc3MgU3BBcGlTdGFjayBleHRlbmRzIGNkay5TdGFjayB7XG4gIGNvbnN0cnVjdG9yKHNjb3BlOiBDb25zdHJ1Y3QsIGlkOiBzdHJpbmcsIHByb3BzPzogY2RrLlN0YWNrUHJvcHMpIHtcbiAgICBzdXBlcihzY29wZSwgaWQsIHByb3BzKTtcblxuICAgIGNvbnN0IHN1ZmZpeCA9ICcyMDI1MTExNTExMjk0Myc7XG5cbiAgICAvLyBEeW5hbW9EQiBUYWJsZVxuICAgIGNvbnN0IHByb2R1Y3RzVGFibGUgPSBuZXcgZHluYW1vZGIuVGFibGUodGhpcywgYFByb2R1Y3RTcGVjaWZpY2F0aW9ucyR7c3VmZml4fWAsIHtcbiAgICAgIHRhYmxlTmFtZTogYFByb2R1Y3RTcGVjaWZpY2F0aW9ucyR7c3VmZml4fWAsXG4gICAgICBwYXJ0aXRpb25LZXk6IHsgbmFtZTogJ3Byb2R1Y3RfaWQnLCB0eXBlOiBkeW5hbW9kYi5BdHRyaWJ1dGVUeXBlLlNUUklORyB9LFxuICAgICAgYmlsbGluZ01vZGU6IGR5bmFtb2RiLkJpbGxpbmdNb2RlLlBST1ZJU0lPTkVELFxuICAgICAgcmVhZENhcGFjaXR5OiA1LFxuICAgICAgd3JpdGVDYXBhY2l0eTogNSxcbiAgICAgIHJlbW92YWxQb2xpY3k6IGNkay5SZW1vdmFsUG9saWN5LkRFU1RST1lcbiAgICB9KTtcblxuICAgIC8vIEVuYWJsZSBhdXRvIHNjYWxpbmdcbiAgICBwcm9kdWN0c1RhYmxlLmF1dG9TY2FsZVJlYWRDYXBhY2l0eSh7XG4gICAgICBtaW5DYXBhY2l0eTogMSxcbiAgICAgIG1heENhcGFjaXR5OiAxMFxuICAgIH0pO1xuXG4gICAgcHJvZHVjdHNUYWJsZS5hdXRvU2NhbGVXcml0ZUNhcGFjaXR5KHtcbiAgICAgIG1pbkNhcGFjaXR5OiAxLFxuICAgICAgbWF4Q2FwYWNpdHk6IDEwXG4gICAgfSk7XG5cbiAgICAvLyBMYW1iZGEgZnVuY3Rpb24gZm9yIEFQSSBvcGVyYXRpb25zXG4gICAgY29uc3QgYXBpRnVuY3Rpb24gPSBuZXcgbGFtYmRhLkZ1bmN0aW9uKHRoaXMsIGBQcm9kdWN0c0FwaSR7c3VmZml4fWAsIHtcbiAgICAgIGZ1bmN0aW9uTmFtZTogYFByb2R1Y3RzQXBpJHtzdWZmaXh9YCxcbiAgICAgIHJ1bnRpbWU6IGxhbWJkYS5SdW50aW1lLk5PREVKU18yMl9YLFxuICAgICAgaGFuZGxlcjogJ2luZGV4LmhhbmRsZXInLFxuICAgICAgY29kZTogbGFtYmRhLkNvZGUuZnJvbUFzc2V0KHBhdGguam9pbihfX2Rpcm5hbWUsICcuLi8uLi9sYW1iZGEnKSksXG4gICAgICBlbnZpcm9ubWVudDoge1xuICAgICAgICBUQUJMRV9OQU1FOiBwcm9kdWN0c1RhYmxlLnRhYmxlTmFtZVxuICAgICAgfSxcbiAgICAgIHRpbWVvdXQ6IGNkay5EdXJhdGlvbi5zZWNvbmRzKDMwKVxuICAgIH0pO1xuXG4gICAgLy8gR3JhbnQgRHluYW1vREIgcGVybWlzc2lvbnNcbiAgICBwcm9kdWN0c1RhYmxlLmdyYW50UmVhZFdyaXRlRGF0YShhcGlGdW5jdGlvbik7XG5cbiAgICAvLyBEYXRhIHNlZWRlciBMYW1iZGFcbiAgICBjb25zdCBzZWVkZXJGdW5jdGlvbiA9IG5ldyBsYW1iZGEuRnVuY3Rpb24odGhpcywgYERhdGFTZWVkZXIke3N1ZmZpeH1gLCB7XG4gICAgICBmdW5jdGlvbk5hbWU6IGBEYXRhU2VlZGVyJHtzdWZmaXh9YCxcbiAgICAgIHJ1bnRpbWU6IGxhbWJkYS5SdW50aW1lLk5PREVKU18yMl9YLFxuICAgICAgaGFuZGxlcjogJ3NlZWRlci5oYW5kbGVyJyxcbiAgICAgIGNvZGU6IGxhbWJkYS5Db2RlLmZyb21Bc3NldChwYXRoLmpvaW4oX19kaXJuYW1lLCAnLi4vLi4vbGFtYmRhJykpLFxuICAgICAgZW52aXJvbm1lbnQ6IHtcbiAgICAgICAgVEFCTEVfTkFNRTogcHJvZHVjdHNUYWJsZS50YWJsZU5hbWVcbiAgICAgIH0sXG4gICAgICB0aW1lb3V0OiBjZGsuRHVyYXRpb24uc2Vjb25kcyg2MClcbiAgICB9KTtcblxuICAgIHByb2R1Y3RzVGFibGUuZ3JhbnRXcml0ZURhdGEoc2VlZGVyRnVuY3Rpb24pO1xuXG4gICAgLy8gQVBJIEdhdGV3YXlcbiAgICBjb25zdCBhcGkgPSBuZXcgYXBpZ2F0ZXdheS5SZXN0QXBpKHRoaXMsIGBQcm9kdWN0c1Jlc3RBcGkke3N1ZmZpeH1gLCB7XG4gICAgICByZXN0QXBpTmFtZTogYFByb2R1Y3RzQXBpJHtzdWZmaXh9YCxcbiAgICAgIGRlZmF1bHRDb3JzUHJlZmxpZ2h0T3B0aW9uczoge1xuICAgICAgICBhbGxvd09yaWdpbnM6IGFwaWdhdGV3YXkuQ29ycy5BTExfT1JJR0lOUyxcbiAgICAgICAgYWxsb3dNZXRob2RzOiBhcGlnYXRld2F5LkNvcnMuQUxMX01FVEhPRFMsXG4gICAgICAgIGFsbG93SGVhZGVyczogWydDb250ZW50LVR5cGUnLCAnWC1BbXotRGF0ZScsICdBdXRob3JpemF0aW9uJywgJ1gtQXBpLUtleSddXG4gICAgICB9XG4gICAgfSk7XG5cbiAgICBjb25zdCBhcGlSZXNvdXJjZSA9IGFwaS5yb290LmFkZFJlc291cmNlKCdhcGknKTtcbiAgICBjb25zdCBwcm9kdWN0c1Jlc291cmNlID0gYXBpUmVzb3VyY2UuYWRkUmVzb3VyY2UoJ3Byb2R1Y3RzJyk7XG5cbiAgICAvLyBHRVQgL2FwaS9wcm9kdWN0c1xuICAgIHByb2R1Y3RzUmVzb3VyY2UuYWRkTWV0aG9kKCdHRVQnLCBuZXcgYXBpZ2F0ZXdheS5MYW1iZGFJbnRlZ3JhdGlvbihhcGlGdW5jdGlvbikpO1xuXG4gICAgLy8gR0VUIC9hcGkvcHJvZHVjdHMve2lkfVxuICAgIGNvbnN0IHByb2R1Y3RSZXNvdXJjZSA9IHByb2R1Y3RzUmVzb3VyY2UuYWRkUmVzb3VyY2UoJ3tpZH0nKTtcbiAgICBwcm9kdWN0UmVzb3VyY2UuYWRkTWV0aG9kKCdHRVQnLCBuZXcgYXBpZ2F0ZXdheS5MYW1iZGFJbnRlZ3JhdGlvbihhcGlGdW5jdGlvbikpO1xuXG4gICAgLy8gVHJpZ2dlciBkYXRhIHNlZWRpbmcgbWFudWFsbHkgYWZ0ZXIgZGVwbG95bWVudFxuICAgIG5ldyBjZGsuQ2ZuT3V0cHV0KHRoaXMsICdTZWVkZXJGdW5jdGlvbk5hbWUnLCB7XG4gICAgICB2YWx1ZTogc2VlZGVyRnVuY3Rpb24uZnVuY3Rpb25OYW1lLFxuICAgICAgZGVzY3JpcHRpb246ICdEYXRhIFNlZWRlciBGdW5jdGlvbiBOYW1lJ1xuICAgIH0pO1xuXG4gICAgLy8gT3V0cHV0c1xuICAgIG5ldyBjZGsuQ2ZuT3V0cHV0KHRoaXMsICdBcGlVcmwnLCB7XG4gICAgICB2YWx1ZTogYXBpLnVybCxcbiAgICAgIGRlc2NyaXB0aW9uOiAnQVBJIEdhdGV3YXkgVVJMJ1xuICAgIH0pO1xuXG4gICAgbmV3IGNkay5DZm5PdXRwdXQodGhpcywgJ1RhYmxlTmFtZScsIHtcbiAgICAgIHZhbHVlOiBwcm9kdWN0c1RhYmxlLnRhYmxlTmFtZSxcbiAgICAgIGRlc2NyaXB0aW9uOiAnRHluYW1vREIgVGFibGUgTmFtZSdcbiAgICB9KTtcbiAgfVxufVxuIl19