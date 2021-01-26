import { AzureFunction, Context, HttpRequest } from "@azure/functions"
import {CosmosClient }from "@azure/cosmos"

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
    context.log('HTTP trigger function processed a request.');
    const userId = (req.query.userid || (req.body && req.body.userid));

    //create cosmos client
    const client = new CosmosClient(process.env["COSMOSDB_CONECTION_STRING"]);

    //create database client
    const database = await client.databases.createIfNotExists({id:"content_metadata"});

    //create container client
    const container = await database.database.containers.createIfNotExists({id:"metadata"});

    //get file list using userid
    const queryString = "SELECT c.fileName, c.blobContainerName, c.blobAccountName FROM c JOIN t IN c.readbleUsers WHERE t =\"" + userId + "\"";
    const filenames = await container.container.items.query(queryString).fetchAll();

    const responseMessage = userId
        ? filenames
        : "please enter userid as query";

    context.res = {
        // status: 200, /* Defaults to 200 */
        body: responseMessage
    };

};

export default httpTrigger;