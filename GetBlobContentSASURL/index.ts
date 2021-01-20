import { AzureFunction, Context, HttpRequest } from "@azure/functions"
import { BlobServiceClient } from "@azure/storage-blob"

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
    context.log('HTTP trigger function processed a request.');
    const name = (req.query.name || (req.body && req.body.name));

    //criate storage account client
    const blobServiceClient = BlobServiceClient.fromConnectionString(process.env["AZURE_STORAGE_CONNECTION_STRING"]);

    //get contaier client
    const containerName = "content";
    const containerClient = blobServiceClient.getContainerClient(containerName);

    // List the blob(s) in the container
    let blobliststring = "";
    for await (const blob of containerClient.listBlobsFlat()) {
        blobliststring += blob.name;
    }

    const temp = blobliststring;
    const responseMessage = name
        ? "Hello, " + name + temp +". This HTTP triggered function executed successfully."
        : "This HTTP triggered function executed successfully. Pass a name in the query string or in the request body for a personalized response.";

    context.res = {
        // status: 200, /* Defaults to 200 */
        body: responseMessage
    };

};

export default httpTrigger;