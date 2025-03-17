using System.Net;
using System.Text.Json;
using Api.Models;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;
using Microsoft.Azure.WebJobs.Extensions.OpenApi.Core.Attributes;
using Microsoft.OpenApi.Models;

namespace Api.Functions;

public class TransactionsFunction
{
    private static readonly List<Transaction> _transactions = new();

    [Function("GetTransactions")]
    [OpenApiOperation(operationId: "GetTransactions", tags: new[] { "Transactions" })]
    [OpenApiResponseWithBody(statusCode: HttpStatusCode.OK, contentType: "application/json", bodyType: typeof(List<Transaction>), Description = "Returns all transactions")]
    public async Task<HttpResponseData> GetTransactions(
        [HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "transactions")] HttpRequestData req)
    {
        var response = req.CreateResponse(HttpStatusCode.OK);
        await response.WriteAsJsonAsync(_transactions);
        return response;
    }

    [Function("AddTransaction")]
    [OpenApiOperation(operationId: "AddTransaction", tags: new[] { "Transactions" })]
    [OpenApiRequestBody("application/json", typeof(Transaction))]
    [OpenApiResponseWithBody(statusCode: HttpStatusCode.Created, contentType: "application/json", bodyType: typeof(Transaction), Description = "The created transaction")]
    public async Task<HttpResponseData> AddTransaction(
        [HttpTrigger(AuthorizationLevel.Anonymous, "post", Route = "transactions")] HttpRequestData req)
    {
        var transaction = await JsonSerializer.DeserializeAsync<Transaction>(req.Body);
        if (transaction == null)
        {
            var badResponse = req.CreateResponse(HttpStatusCode.BadRequest);
            await badResponse.WriteStringAsync("Invalid transaction data");
            return badResponse;
        }

        transaction.Id = Guid.NewGuid().ToString();
        _transactions.Add(transaction);

        var response = req.CreateResponse(HttpStatusCode.Created);
        await response.WriteAsJsonAsync(transaction);
        return response;
    }

    [Function("DeleteTransaction")]
    [OpenApiOperation(operationId: "DeleteTransaction", tags: new[] { "Transactions" })]
    [OpenApiParameter("id", In = ParameterLocation.Path, Required = true, Type = typeof(string))]
    [OpenApiResponseWithBody(statusCode: HttpStatusCode.OK, contentType: "application/json", bodyType: typeof(Transaction), Description = "The deleted transaction")]
    public async Task<HttpResponseData> DeleteTransaction(
        [HttpTrigger(AuthorizationLevel.Anonymous, "delete", Route = "transactions/{id}")] HttpRequestData req,
        string id)
    {
        var transaction = _transactions.FirstOrDefault(t => t.Id == id);
        if (transaction == null)
        {
            var notFoundResponse = req.CreateResponse(HttpStatusCode.NotFound);
            await notFoundResponse.WriteStringAsync($"Transaction with ID {id} not found");
            return notFoundResponse;
        }

        _transactions.Remove(transaction);
        var response = req.CreateResponse(HttpStatusCode.OK);
        await response.WriteAsJsonAsync(transaction);
        return response;
    }
}