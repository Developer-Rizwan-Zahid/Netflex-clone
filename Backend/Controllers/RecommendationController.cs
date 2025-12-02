using Backend.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class RecommendationController : ControllerBase
    {
        private readonly AppDbContext _db;

        public RecommendationController(AppDbContext db)
        {
            _db = db;
        }

        [HttpGet("{profileId:guid}")]
        public IActionResult GetRecommendations(Guid profileId)
        {
            //Check if profile exists
            var profile = _db.Profiles.FirstOrDefault(p => p.Id == profileId);
            if (profile == null) return NotFound("Profile not found");

            //Get genres watched by the user
            var watchedGenreIds = _db.WatchHistory
                .Include(w => w.Content)
                .Where(w => w.ProfileId == profileId)
                .GroupBy(w => w.Content.Genre)
                .Select(g => new { Genre = g.Key, Count = g.Count() })
                .OrderByDescending(g => g.Count)
                .Take(3) // top 3 genres
                .Select(g => g.Genre)
                .ToList();

            if (!watchedGenreIds.Any())
                watchedGenreIds.Add("Action"); // default fallback

            // Recommend contents based on most watched genres
            var recommendations = _db.Contents
                .Where(c => watchedGenreIds.Contains(c.Genre))
                .OrderByDescending(c => c.ReleaseDate)
                .Take(10)
                .ToList();

            return Ok(recommendations);
        }
    }
}
