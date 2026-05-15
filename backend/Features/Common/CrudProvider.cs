using Microsoft.EntityFrameworkCore;
using RangeTech.ServiceApp.Api.Domain.Common;
using RangeTech.ServiceApp.Api.Infrastructure.Persistence;

namespace RangeTech.ServiceApp.Api.Features.Common;

public class CrudProvider<TEntity>(AppDbContext dbContext) : ICrudProvider<TEntity>
    where TEntity : class, IEntity
{
    protected AppDbContext DbContext { get; } = dbContext;

    protected DbSet<TEntity> Set => DbContext.Set<TEntity>();

    public virtual async Task<IReadOnlyList<TEntity>> GetAllAsync(CancellationToken cancellationToken)
    {
        return await Set.AsNoTracking().ToListAsync(cancellationToken);
    }

    public virtual async Task<TEntity?> GetByIdAsync(Guid id, CancellationToken cancellationToken)
    {
        return await Set.AsNoTracking().FirstOrDefaultAsync(entity => entity.Id == id, cancellationToken);
    }

    public virtual async Task<TEntity> CreateAsync(TEntity entity, CancellationToken cancellationToken)
    {
        entity.Id = entity.Id == Guid.Empty ? Guid.NewGuid() : entity.Id;
        Set.Add(entity);
        await DbContext.SaveChangesAsync(cancellationToken);
        return entity;
    }

    public virtual async Task<TEntity?> UpdateAsync(Guid id, TEntity entity, CancellationToken cancellationToken)
    {
        var existing = await Set.FirstOrDefaultAsync(item => item.Id == id, cancellationToken);

        if (existing is null)
        {
            return null;
        }

        entity.Id = id;
        DbContext.Entry(existing).CurrentValues.SetValues(entity);
        await DbContext.SaveChangesAsync(cancellationToken);
        return existing;
    }

    public virtual async Task<bool> DeleteAsync(Guid id, CancellationToken cancellationToken)
    {
        var entity = await Set.FirstOrDefaultAsync(item => item.Id == id, cancellationToken);

        if (entity is null)
        {
            return false;
        }

        Set.Remove(entity);
        await DbContext.SaveChangesAsync(cancellationToken);
        return true;
    }

    public virtual Task<bool> ExistsAsync(Guid id, CancellationToken cancellationToken)
    {
        return Set.AsNoTracking().AnyAsync(entity => entity.Id == id, cancellationToken);
    }
}
