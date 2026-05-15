using Microsoft.EntityFrameworkCore;
using RangeTech.ServiceApp.Api.Domain.Entities;

namespace RangeTech.ServiceApp.Api.Infrastructure.Persistence;

public sealed class AppDbContext(DbContextOptions<AppDbContext> options) : DbContext(options)
{
    public DbSet<Employee> Employees => Set<Employee>();
    public DbSet<Client> Clients => Set<Client>();
    public DbSet<Device> Devices => Set<Device>();
    public DbSet<TaskType> TaskTypes => Set<TaskType>();
    public DbSet<WorkTask> WorkTasks => Set<WorkTask>();
    public DbSet<ServiceTicket> ServiceTickets => Set<ServiceTicket>();
    public DbSet<ServiceReport> ServiceReports => Set<ServiceReport>();
    public DbSet<ServicePart> ServiceParts => Set<ServicePart>();
    public DbSet<ServiceReportPart> ServiceReportParts => Set<ServiceReportPart>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Employee>(entity =>
        {
            entity.HasKey(employee => employee.Id);
            entity.Property(employee => employee.FirstName).HasMaxLength(100).IsRequired();
            entity.Property(employee => employee.LastName).HasMaxLength(100).IsRequired();
            entity.Property(employee => employee.Email).HasMaxLength(180).IsRequired();
            entity.Property(employee => employee.Role).HasMaxLength(80).IsRequired();
        });

        modelBuilder.Entity<Client>(entity =>
        {
            entity.HasKey(client => client.Id);
            entity.Property(client => client.Name).HasMaxLength(180).IsRequired();
            entity.Property(client => client.Email).HasMaxLength(180);
            entity.Property(client => client.Phone).HasMaxLength(40);
            entity.Property(client => client.Address).HasMaxLength(250);
        });

        modelBuilder.Entity<Device>(entity =>
        {
            entity.HasKey(device => device.Id);
            entity.HasIndex(device => device.SerialNumber).IsUnique();
            entity.Property(device => device.SerialNumber).HasMaxLength(120).IsRequired();
            entity.Property(device => device.Manufacturer).HasMaxLength(120).IsRequired();
            entity.Property(device => device.Model).HasMaxLength(120).IsRequired();
            entity.Property(device => device.Status).HasMaxLength(40).IsRequired();
            entity.HasOne(device => device.Client)
                .WithMany(client => client.Devices)
                .HasForeignKey(device => device.ClientId)
                .OnDelete(DeleteBehavior.Restrict);
        });

        modelBuilder.Entity<TaskType>(entity =>
        {
            entity.HasKey(taskType => taskType.Id);
            entity.Property(taskType => taskType.Name).HasMaxLength(120).IsRequired();
            entity.Property(taskType => taskType.Description).HasMaxLength(500);
        });

        modelBuilder.Entity<WorkTask>(entity =>
        {
            entity.HasKey(workTask => workTask.Id);
            entity.Property(workTask => workTask.Title).HasMaxLength(160).IsRequired();
            entity.Property(workTask => workTask.Description).HasMaxLength(1000);
            entity.Property(workTask => workTask.Status).HasMaxLength(40).IsRequired();
            entity.HasOne(workTask => workTask.Employee)
                .WithMany(employee => employee.WorkTasks)
                .HasForeignKey(workTask => workTask.EmployeeId)
                .OnDelete(DeleteBehavior.Restrict);
            entity.HasOne(workTask => workTask.Device)
                .WithMany(device => device.WorkTasks)
                .HasForeignKey(workTask => workTask.DeviceId)
                .OnDelete(DeleteBehavior.Restrict);
            entity.HasOne(workTask => workTask.TaskType)
                .WithMany(taskType => taskType.WorkTasks)
                .HasForeignKey(workTask => workTask.TaskTypeId)
                .OnDelete(DeleteBehavior.Restrict);
        });

        modelBuilder.Entity<ServiceTicket>(entity =>
        {
            entity.HasKey(ticket => ticket.Id);
            entity.Property(ticket => ticket.Title).HasMaxLength(160).IsRequired();
            entity.Property(ticket => ticket.Description).HasMaxLength(1000);
            entity.Property(ticket => ticket.Status).HasMaxLength(40).IsRequired();
            entity.HasOne(ticket => ticket.Client)
                .WithMany(client => client.ServiceTickets)
                .HasForeignKey(ticket => ticket.ClientId)
                .OnDelete(DeleteBehavior.Restrict);
            entity.HasOne(ticket => ticket.Device)
                .WithMany(device => device.ServiceTickets)
                .HasForeignKey(ticket => ticket.DeviceId)
                .OnDelete(DeleteBehavior.Restrict);
        });

        modelBuilder.Entity<ServiceReport>(entity =>
        {
            entity.HasKey(report => report.Id);
            entity.Property(report => report.Summary).HasMaxLength(1000).IsRequired();
            entity.HasOne(report => report.ServiceTicket)
                .WithMany(ticket => ticket.ServiceReports)
                .HasForeignKey(report => report.ServiceTicketId)
                .OnDelete(DeleteBehavior.Restrict);
            entity.HasOne(report => report.Employee)
                .WithMany(employee => employee.ServiceReports)
                .HasForeignKey(report => report.EmployeeId)
                .OnDelete(DeleteBehavior.Restrict);
        });

        modelBuilder.Entity<ServicePart>(entity =>
        {
            entity.HasKey(part => part.Id);
            entity.Property(part => part.Name).HasMaxLength(160).IsRequired();
            entity.Property(part => part.Sku).HasMaxLength(80).IsRequired();
            entity.Property(part => part.UnitPrice).HasPrecision(18, 2);
        });

        modelBuilder.Entity<ServiceReportPart>(entity =>
        {
            entity.HasKey(reportPart => reportPart.Id);
            entity.Property(reportPart => reportPart.Note).HasMaxLength(500);
            entity.HasIndex(reportPart => new { reportPart.ServiceReportId, reportPart.ServicePartId });
            entity.HasOne(reportPart => reportPart.ServiceReport)
                .WithMany(report => report.ServiceReportParts)
                .HasForeignKey(reportPart => reportPart.ServiceReportId)
                .OnDelete(DeleteBehavior.Cascade);
            entity.HasOne(reportPart => reportPart.ServicePart)
                .WithMany(part => part.ServiceReportParts)
                .HasForeignKey(reportPart => reportPart.ServicePartId)
                .OnDelete(DeleteBehavior.Restrict);
        });
    }
}
