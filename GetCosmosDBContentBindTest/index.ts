import { AzureFunction, Context, HttpRequest } from "@azure/functions"

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
    context.log('HTTP trigger function processed a request.');
    const userId = (req.query.userid || (req.body && req.body.userid));

    //バインドされたCosmosDBのドキュメントをすべて取得
    const cosmosdbDocuments = context.bindings.documents;
    var resultDocuments: Object[]=[];

    //ユーザIDが含まれているものだけを抽出
    for(var i = 0; i<cosmosdbDocuments.length;i++){
        var document = cosmosdbDocuments[i];
        if(document.readbleUsers.indexOf(userId)>=0){
            resultDocuments.push(document);
        }
    }
    const responseMessage = userId
        ? resultDocuments
        : "please provide userid as query";

    context.res = {
        // status: 200, /* Defaults to 200 */
        body: responseMessage
    };

};

export default httpTrigger;