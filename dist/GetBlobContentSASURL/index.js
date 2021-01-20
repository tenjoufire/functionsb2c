"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const storage_blob_1 = require("@azure/storage-blob");
//function generateBlobSASQueryParameters(blobSASSignatureValues: BlobSASSignatureValues, sharedKeyCredential: StorageSharedKeyCredential)
const httpTrigger = function (context, req) {
    return __awaiter(this, void 0, void 0, function* () {
        context.log('HTTP trigger function processed a request.');
        const blobName = (req.query.name || (req.body && req.body.name));
        //criate storage account client
        const blobServiceClient = storage_blob_1.BlobServiceClient.fromConnectionString(process.env["AZURE_STORAGE_CONNECTION_STRING"]);
        //create shared key credential
        const sharedKeyCredential = new storage_blob_1.StorageSharedKeyCredential(process.env["STORAGE_ACCOUNT_NAME"], process.env["STORAGE_ACCOUNT_KEY"]);
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
        const blobSAS = storage_blob_1.generateBlobSASQueryParameters({
            containerName: containerName,
            blobName: blobName,
            permissions: storage_blob_1.BlobSASPermissions.parse("r"),
            expiresOn: new Date(new Date().valueOf() + 86400),
        }, sharedKeyCredential // StorageSharedKeyCredential - `new StorageSharedKeyCredential(account, accountKey)`
        ).toString();
        const responseMessage = blobName
            ? blobURL + "?" + blobSAS
            : "please add blob name to query as name";
        context.res = {
            // status: 200, /* Defaults to 200 */
            body: responseMessage
        };
    });
};
exports.default = httpTrigger;
//# sourceMappingURL=index.js.map