namespace RangeTech.ServiceApp.Api.Features.Clients.Messages.DTOs;

public sealed record ClientDto(Guid Id, string Name, string Email, string Phone, string Address);

public sealed record CreateClientDto(string Name, string Email, string Phone, string Address);

public sealed record UpdateClientDto(string Name, string Email, string Phone, string Address);
