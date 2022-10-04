import {
  App,
  Duration,
  Stack,
  StackProps,
  aws_ec2,
  aws_iam,
} from 'aws-cdk-lib';


export interface IEc2Ssm {
  applicationSuffix: string
  vpcId: `vpc-${string}`
}


export class Ec2SsmStack extends Stack {
  constructor(scope: App, id: string, params: IEc2Ssm, props?: StackProps) {
    super(scope, id, props);

    const vpc = aws_ec2.Vpc.fromLookup(this, "existing-vpc", {
      vpcId: params.vpcId
    })

    const securityGroup = new aws_ec2.SecurityGroup(this, `security-group`, {
      vpc: vpc,
      securityGroupName: `ssm-security-group`,
      allowAllOutbound: true,
    })

    /** instance role  */
    const role = new aws_iam.Role(this, `instance-role`, {
      roleName: `ssm-ec2-instance-role-${params.applicationSuffix}`,
      assumedBy: new aws_iam.ServicePrincipal('ec2.amazonaws.com'),
      managedPolicies: [
        aws_iam.ManagedPolicy.fromManagedPolicyArn(this, "AmazonEC2ContainerServiceforEC2Role", "arn:aws:iam::aws:policy/service-role/AmazonEC2ContainerServiceforEC2Role"),
        /** Add managed policy to use SSM */
        aws_iam.ManagedPolicy.fromManagedPolicyArn(this, "AmazonEC2RoleforSSM", "arn:aws:iam::aws:policy/service-role/AmazonEC2RoleforSSM")
      ]
    })
    new aws_iam.CfnInstanceProfile(this, `instance-profile`, {
      instanceProfileName: `ssm-ec2-instance-profile-${params.applicationSuffix}`,
      roles: [role.roleName]
    })

    /** 実行環境としてのEC2 */
    const machineImage = aws_ec2.MachineImage.latestAmazonLinux({
      generation: aws_ec2.AmazonLinuxGeneration.AMAZON_LINUX_2,
      edition: aws_ec2.AmazonLinuxEdition.STANDARD,
      kernel: aws_ec2.AmazonLinuxKernel.KERNEL5_X,
      virtualization: aws_ec2.AmazonLinuxVirt.HVM,
      storage: aws_ec2.AmazonLinuxStorage.GENERAL_PURPOSE,
      cpuType: aws_ec2.AmazonLinuxCpuType.X86_64,
    });
    new aws_ec2.Instance(this, "ssm-instance", {
      instanceType: new aws_ec2.InstanceType("t3.micro"),
      instanceName: `ssm-example-${params.applicationSuffix}`,
      vpc: vpc,
      machineImage,
      initOptions: {
        configSets: ["default"],
        timeout: Duration.minutes(10)
      },
      init: aws_ec2.CloudFormationInit.fromConfigSets({
        configSets: {
          default: ["yumInstall"]
        },
        configs: {
          yumInstall: new aws_ec2.InitConfig([
            aws_ec2.InitPackage.yum("git"),
            aws_ec2.InitPackage.yum("jq"),
            aws_ec2.InitPackage.yum("docker"),
          ]),
        }
      }),
      role,
      securityGroup,
    })

  }
}
