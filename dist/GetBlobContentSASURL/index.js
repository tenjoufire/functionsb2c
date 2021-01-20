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
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
Object.defineProperty(exports, "__esModule", { value: true });
const storage_blob_1 = require("@azure/storage-blob");
const httpTrigger = function (context, req) {
    var e_1, _a;
    return __awaiter(this, void 0, void 0, function* () {
        context.log('HTTP trigger function processed a request.');
        const name = (req.query.name || (req.body && req.body.name));
        //criate storage account client
        const blobServiceClient = storage_blob_1.BlobServiceClient.fromConnectionString(process.env["AZURE_STORAGE_CONNECTION_STRING"]);
        //get contaier client
        const containerName = "content";
        const containerClient = blobServiceClient.getContainerClient(containerName);
        // List the blob(s) in the container
        let blobliststring = "";
        try {
            for (var _b = __asyncValues(containerClient.listBlobsFlat()), _c; _c = yield _b.next(), !_c.done;) {
                const blob = _c.value;
                blobliststring += blob.name;
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) yield _a.call(_b);
            }
            finally { if (e_1) throw e_1.error; }
        }
        const temp = blobliststring;
        const responseMessage = name
            ? "Hello, " + name + temp + ". This HTTP triggered function executed successfully."
            : "This HTTP triggered function executed successfully. Pass a name in the query string or in the request body for a personalized response.";
        context.res = {
            // status: 200, /* Defaults to 200 */
            body: responseMessage
        };
    });
};
exports.default = httpTrigger;
//# sourceMappingURL=index.js.map