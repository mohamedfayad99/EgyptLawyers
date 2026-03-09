using EgyptLawyers.Data.Entities;
using Microsoft.EntityFrameworkCore;

namespace EgyptLawyers.Data;

public sealed class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<Lawyer> Lawyers => Set<Lawyer>();
    public DbSet<AdminUser> AdminUsers => Set<AdminUser>();
    public DbSet<City> Cities => Set<City>();
    public DbSet<Court> Courts => Set<Court>();
    public DbSet<LawyerCity> LawyerCities => Set<LawyerCity>();
    public DbSet<HelpPost> HelpPosts => Set<HelpPost>();
    public DbSet<HelpPostAttachment> HelpPostAttachments => Set<HelpPostAttachment>();
    public DbSet<HelpPostReply> HelpPostReplies => Set<HelpPostReply>();
    public DbSet<HelpPostReplyAttachment> HelpPostReplyAttachments => Set<HelpPostReplyAttachment>();
    public DbSet<DeviceRegistration> DeviceRegistrations => Set<DeviceRegistration>();
    public DbSet<Notification> Notifications => Set<Notification>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Lawyer>()
            .HasIndex(x => x.SyndicateCardNumber)
            .IsUnique();

        modelBuilder.Entity<Lawyer>()
            .HasIndex(x => x.WhatsappNumber)
            .IsUnique();

        modelBuilder.Entity<AdminUser>()
            .HasIndex(x => x.Email)
            .IsUnique();

        modelBuilder.Entity<City>()
            .HasIndex(x => x.Name)
            .IsUnique();

        modelBuilder.Entity<Court>()
            .HasIndex(x => x.Name)
            .IsUnique();

        modelBuilder.Entity<LawyerCity>()
            .HasKey(x => new { x.LawyerId, x.CityId });

        modelBuilder.Entity<LawyerCity>()
            .HasOne(x => x.Lawyer)
            .WithMany(x => x.ActiveCities)
            .HasForeignKey(x => x.LawyerId);

        modelBuilder.Entity<LawyerCity>()
            .HasOne(x => x.City)
            .WithMany(x => x.Lawyers)
            .HasForeignKey(x => x.CityId);

        modelBuilder.Entity<HelpPost>()
            .HasOne(x => x.City)
            .WithMany()
            .HasForeignKey(x => x.CityId)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<HelpPost>()
            .HasOne(x => x.Court)
            .WithMany()
            .HasForeignKey(x => x.CourtId)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<HelpPost>()
            .HasOne(x => x.Lawyer)
            .WithMany(x => x.Posts)
            .HasForeignKey(x => x.LawyerId)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<HelpPostReply>()
            .HasOne(x => x.HelpPost)
            .WithMany(x => x.Replies)
            .HasForeignKey(x => x.HelpPostId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<HelpPostReply>()
            .HasOne(x => x.Lawyer)
            .WithMany(x => x.Replies)
            .HasForeignKey(x => x.LawyerId)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<DeviceRegistration>()
            .HasIndex(x => x.DeviceToken)
            .IsUnique();
    }
}

