using MapsterMapper;
using RangeTech.ServiceApp.Api.Domain.Common;

namespace RangeTech.ServiceApp.Api.Features.Common;

public abstract class CrudService<TEntity, TDto, TCreateDto, TUpdateDto>(
    ICrudProvider<TEntity> provider,
    IMapper mapper) : ICrudService<TDto, TCreateDto, TUpdateDto>
    where TEntity : class, IEntity
    where TCreateDto : notnull
    where TUpdateDto : notnull
{
    protected ICrudProvider<TEntity> Provider { get; } = provider;
    protected IMapper Mapper { get; } = mapper;

    public virtual async Task<IReadOnlyList<TDto>> GetAllAsync(CancellationToken cancellationToken)
    {
        var entities = await Provider.GetAllAsync(cancellationToken);
        return Mapper.Map<List<TDto>>(entities);
    }

    public virtual async Task<TDto?> GetByIdAsync(Guid id, CancellationToken cancellationToken)
    {
        var entity = await Provider.GetByIdAsync(id, cancellationToken);
        return entity is null ? default : Mapper.Map<TDto>(entity);
    }

    public virtual async Task<TDto> CreateAsync(TCreateDto dto, CancellationToken cancellationToken)
    {
        ValidateCreate(dto);
        var entity = Mapper.Map<TEntity>(dto);
        var created = await Provider.CreateAsync(entity, cancellationToken);
        return Mapper.Map<TDto>(created);
    }

    public virtual async Task<TDto?> UpdateAsync(Guid id, TUpdateDto dto, CancellationToken cancellationToken)
    {
        ValidateUpdate(dto);
        var entity = Mapper.Map<TEntity>(dto);
        var updated = await Provider.UpdateAsync(id, entity, cancellationToken);
        return updated is null ? default : Mapper.Map<TDto>(updated);
    }

    public Task<bool> DeleteAsync(Guid id, CancellationToken cancellationToken)
    {
        return Provider.DeleteAsync(id, cancellationToken);
    }

    protected virtual void ValidateCreate(TCreateDto dto)
    {
        ArgumentNullException.ThrowIfNull(dto);
    }

    protected virtual void ValidateUpdate(TUpdateDto dto)
    {
        ArgumentNullException.ThrowIfNull(dto);
    }

    protected static void RequireText(string value, string fieldName)
    {
        if (string.IsNullOrWhiteSpace(value))
        {
            throw new ApiValidationException($"{fieldName} is required.");
        }
    }
}
