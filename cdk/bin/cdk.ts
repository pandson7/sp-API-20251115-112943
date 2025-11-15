#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { SpApiStack } from '../lib/cdk-stack';

const app = new cdk.App();
new SpApiStack(app, 'SpApiStack20251115112943', {
  env: { 
    account: process.env.CDK_DEFAULT_ACCOUNT, 
    region: process.env.CDK_DEFAULT_REGION || 'us-east-1' 
  }
});
