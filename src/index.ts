import * as apigateway from '@aws-cdk/aws-apigateway';
import * as cloudfront from '@aws-cdk/aws-cloudfront';
import * as origins from '@aws-cdk/aws-cloudfront-origins';
import * as s3 from '@aws-cdk/aws-s3';
import * as s3deploy from '@aws-cdk/aws-s3-deployment';
import * as cdk from '@aws-cdk/core';

export interface Props {
  readonly pathToS3Content: string;
}

export class WebpageWithAPI extends cdk.Construct {

  public readonly api: apigateway.RestApi;
  public readonly distribution: cloudfront.Distribution;

  constructor(scope: cdk.Construct, id: string, props: Props) {
    super(scope, id);

    const websiteBucket = new s3.Bucket(this, 'WebsiteBucket', {
      websiteIndexDocument: 'index.html',
    });

    new s3deploy.BucketDeployment(this, 'DeployWebsite', {
      sources: [s3deploy.Source.asset(props.pathToS3Content)],
      destinationBucket: websiteBucket,
      destinationKeyPrefix: 'web/static', // optional prefix in destination bucket
    });

    this.distribution = new cloudfront.Distribution(this, 'myDist', {
      defaultBehavior: { origin: new origins.HttpOrigin('https://c2a-study.henriquelima.codes') },
    });

    this.api = new apigateway.RestApi(this, 'api');
  }
}
