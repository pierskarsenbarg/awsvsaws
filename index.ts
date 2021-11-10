import { LocalProgramArgs, LocalWorkspace } from "@pulumi/pulumi/automation";
import * as upath from "upath";
import * as aws from "@pulumi/aws";
import * as awsnative from "@pulumi/aws-native";

const run = async () => {
    const awsProgram = async () => {
        const bucket = new aws.s3.Bucket("awsbucket");
    }

    const awsnativeProgram = async () => {
        const bucket = new awsnative.s3.Bucket("awsnativebucket");
    }

    console.log("Initialising workspaces")
    const awsStack = await LocalWorkspace.createOrSelectStack({
        stackName: "dev",
        projectName: "awsBucket",
        program: awsProgram
    });

    const awsNativeStack = await LocalWorkspace.createOrSelectStack({
        stackName: "dev",
        projectName: "awsNativeBucket",
        program: awsnativeProgram
    })

    console.log("Installing plugins")
    await awsStack.workspace.installPlugin("aws", "v4.27.1");
    await awsNativeStack.workspace.installPlugin("aws-native", "v0.4.0");

    console.log("Setting config");
    await awsStack.setConfig("aws:region", { value: "eu-west-1" });
    await awsNativeStack.setConfig("aws-native:region", { value: "eu-west-1" });

    console.log("Refreshing stacks")
    await awsStack.refresh({ onOutput: console.info });
    await awsNativeStack.refresh({ onOutput: console.info });

    await awsStack.up({ onOutput: console.info });
    await awsNativeStack.up({ onOutput: console.info });

    await awsStack.destroy({ onOutput: console.info });
    await awsNativeStack.destroy({ onOutput: console.info });
}

run().catch(err => console.log(err));