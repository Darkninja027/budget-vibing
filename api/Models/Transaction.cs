namespace Api.Models;

public enum TransactionType
{
    Income,
    Expense
}

public class Transaction
{
    public string Id { get; set; } = string.Empty;
    public decimal Amount { get; set; }
    public string Description { get; set; } = string.Empty;
    public TransactionType Type { get; set; }
    public DateTime Date { get; set; }
}