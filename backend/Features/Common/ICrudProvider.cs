using RangeTech.ServiceApp.Api.Domain.Common;

namespace RangeTech.ServiceApp.Api.Features.Common;

public interface ICrudProvider<TEntity>
    where TEntity : class, IEntity
{
    Task<IReadOnlyList<TEntity>> GetAllAsync(CancellationToken cancellationToken);
    Task<TEntity?> GetByIdAsync(Guid id, CancellationToken cancellationToken);
    Task<TEntity> CreateAsync(TEntity entity, CancellationToken cancellationToken);
    Task<TEntity?> UpdateAsync(Guid id, TEntity entity, CancellationToken cancellationToken);
    Task<bool> DeleteAsync(Guid id, CancellationToken cancellationToken);
    Task<bool> ExistsAsync(Guid id, CancellationToken cancellationToken);
}
