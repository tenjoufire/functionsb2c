import { AzureFunction, Context, HttpRequest } from "@azure/functions"
import { BlobServiceClient, ContainerClient, StorageSharedKeyCredential, BlobSASSignatureValues, BlobSASPermissions, generateBlobSASQueryParameters } from "@azure/storage-blob"

//function generateBlobSASQueryParameters(blobSASSignatureValues: BlobSASSignatureValues, sharedKeyCredential: StorageSharedKeyCredential)

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
    context.log('HTTP trigger function processed a request.');
    const blobName = (req.query.blobname || (req.body && req.body.blobname));

    //criate storage account client
    const blobServiceClient = BlobServiceClient.fromConnectionString(process.env["AZURE_STORAGE_CONNECTION_STRING"]);

    //create shared key credential
    const sharedKeyCredential = new StorageSharedKeyCredential(process.env["STORAGE_ACCOUNT_NAME"],process.env["STORAGE_ACCOUNT_KEY"]);

    //get contaier client
    const containerName = "content";
    const containerClient = blobServiceClient.getContainerClient(containerName);

    //get blob client
    const blockBlobClient = containerClient.getBlockBlobClient(blobName);
    const blobURL = blockBlobClient.url;

    /*
    // List the blob(s) in the container
    let blobliststring = "";
    for await (const blob of containerClient.listBlobsFlat()) {
        blobliststring += blob.name;
    }
    */

    // Generate service level SAS for a blob
    const blobSAS = generateBlobSASQueryParameters({
        containerName: containerName, // Required
        blobName: blobName, // Required
        permissions: BlobSASPermissions.parse("r"), // Required
        expiresOn: new Date(new Date().valueOf() + 86400), // Required. Date type
    },
        sharedKeyCredential // StorageSharedKeyCredential - `new StorageSharedKeyCredential(account, accountKey)`
    ).toString();

    const responseMessage = blobName
        ? blobURL + "?" + blobSAS
        : "please add blob name to query as blobname";

    context.res = {
        // status: 200, /* Defaults to 200 */
        body: responseMessage
    };

};




export default httpTrigger;