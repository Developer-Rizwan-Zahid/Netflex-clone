using Backend.Data;
using Backend.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class ProfileController : ControllerBase
    {
        private readonly AppDbContext _db;

        public ProfileController(AppDbContext db)
        {
            _db = db;
        }

        [HttpPost]
        public IActionResult Create([FromBody] string name)
        {
            var userIdClaim = User.FindFirst("userId")?.Value;
            if (userIdClaim == null) return Unauthorized();

            var userId = Guid.Parse(userIdClaim);

            var profile = new UserProfile
            {
                Name = name,
                UserId = userId
            };

            _db.Profiles.Add(profile);
            _db.SaveChanges();

            return Ok(profile);
        }

        [HttpGet]
        public IActionResult GetAll()
        {
            var userIdClaim = User.FindFirst("userId")?.Value;
            if (userIdClaim == null) return Unauthorized();

            var userId = Guid.Parse(userIdClaim);
            var profiles = _db.Profiles.Where(p => p.UserId == userId).ToList();

            return Ok(profiles);
        }
    }
}
