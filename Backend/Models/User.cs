using System.ComponentModel.DataAnnotations;

namespace Backend.Models
{
    public class User
    {
        public Guid Id { get; set; }

        [Required]
        public string Email { get; set; }

        [Required]
        public string PasswordHash { get; set; }

        public string Role { get; set; } = "User";

        public List<UserProfile> Profiles { get; set; }
        public List<Favorite> Favorites { get; set; }
    }
}
