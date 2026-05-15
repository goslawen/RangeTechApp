namespace RangeTech.ServiceApp.Api.Features.Common;

public interface ICrudService<TDto, TCreateDto, TUpdateDto>
{
    Task<IReadOnlyList<TDto>> GetAllAsync(CancellationToken cancellationToken);
    Task<TDto?> GetByIdAsync(Guid id, CancellationToken cancellationToken);
    Task<TDto> CreateAsync(TCreateDto dto, CancellationToken cancellationToken);
    Task<TDto?> UpdateAsync(Guid id, TUpdateDto dto, CancellationToken cancellationToken);
    Task<bool> DeleteAsync(Guid id, CancellationToken cancellationToken);
}
