import {IEc2Ssm} from './Ec2SsmStack';
import {
  Environment
} from 'aws-cdk-lib';

export const env: Environment = {
  account: "000011112222",
  region: "ap-northeast-1"
}

export const paramsEc2Ssm: IEc2Ssm = {
  applicationSuffix: "zenn-example",
  vpcId: "vpc-{your-vpc-id}",
}
