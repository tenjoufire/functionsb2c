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
const cosmos_1 = require("@azure/cosmos");
const httpTrigger = function (context, req) {
    return __awaiter(this, void 0, void 0, function* () {
        context.log('HTTP trigger function processed a request.');
        const userId = (req.query.userid || (req.body && req.body.userid));
        //create cosmos client
        const client = new cosmos_1.CosmosClient(process.env["COSMOSDB_CONECTION_STRING"]);
        //create database client
        const database = yield client.databases.createIfNotExists({ id: "content_metadata" });
        //create container client
        const container = yield database.database.containers.createIfNotExists({ id: "metadata" });
        //get file list using userid
        const queryString = "SELECT c.fileName, c.blobContainerName, c.blobAccountName FROM c JOIN t IN c.readbleUsers WHERE t =\"" + userId + "\"";
        const filenames = yield container.container.items.query(queryString).fetchAll();
        const responseMessage = userId
            ? filenames
            : "please enter userid as query";
        context.res = {
            // status: 200, /* Defaults to 200 */
            body: responseMessage
        };
    });
};
exports.default = httpTrigger;
//# sourceMappingURL=index.js.map