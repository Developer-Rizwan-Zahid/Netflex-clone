using Backend.Data;
using Backend.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class WatchController : ControllerBase
    {
        private readonly AppDbContext _db;

        public WatchController(AppDbContext db)
        {
            _db = db;
        }

        [HttpPost("{profileId:guid}/{contentId:guid}")]
        public IActionResult Add(Guid profileId, Guid contentId)
        {
            // Validate profile exists
            var profileExists = _db.Profiles.Any(p => p.Id == profileId);
            if (!profileExists) return NotFound("Profile not found");

            // Validate content exists
            var contentExists = _db.Contents.Any(c => c.Id == contentId);
            if (!contentExists) return NotFound("Content not found");

            var entry = new WatchHistory
            {
                ProfileId = profileId,
                ContentId = contentId,
                WatchedAt = DateTime.UtcNow
            };

            _db.WatchHistory.Add(entry);
            _db.SaveChanges();

            return Ok(new { message = "Watch history added." });
        }

        [HttpGet("{profileId:guid}")]
        public IActionResult Get(Guid profileId)
        {
            var history = _db.WatchHistory
                .Where(h => h.ProfileId == profileId)
                .OrderByDescending(h => h.WatchedAt)
                .ToList();

            return Ok(history);
        }
    }
}
