namespace RangeTech.ServiceApp.Api.Features.ServiceParts.Messages.DTOs;

public sealed record ServicePartDto(Guid Id, string Name, string Sku, decimal UnitPrice, int StockQuantity);

public sealed record CreateServicePartDto(string Name, string Sku, decimal UnitPrice, int StockQuantity);

public sealed record UpdateServicePartDto(string Name, string Sku, decimal UnitPrice, int StockQuantity);
