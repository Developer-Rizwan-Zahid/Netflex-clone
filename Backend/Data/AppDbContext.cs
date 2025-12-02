using Backend.Models;
using Microsoft.EntityFrameworkCore;

namespace Backend.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) {}

        public DbSet<User> Users { get; set; }
        public DbSet<UserProfile> Profiles { get; set; }
        public DbSet<WatchHistory> WatchHistory { get; set; }
        public DbSet<Content> Contents { get; set; }
        public DbSet<Favorite> Favorites { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // Indexes for faster queries
            modelBuilder.Entity<WatchHistory>()
                .HasIndex(w => new { w.ProfileId, w.ContentId });

            modelBuilder.Entity<Favorite>()
                .HasIndex(f => new { f.UserId, f.ContentId });

            modelBuilder.Entity<User>()
                .HasIndex(u => u.Email)
                .IsUnique();
        }
    }
}
