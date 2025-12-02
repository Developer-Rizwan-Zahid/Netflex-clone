using Backend.Data;
using Backend.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class FavoriteController : ControllerBase
    {
        private readonly AppDbContext _db;

        public FavoriteController(AppDbContext db)
        {
            _db = db;
        }

        [HttpPost("{contentId:guid}")]
        public IActionResult Add(Guid contentId)
        {
            var userIdClaim = User.FindFirst("userId")?.Value;
            if (userIdClaim == null) return Unauthorized();
            var userId = Guid.Parse(userIdClaim);

            // Validate content exists
            if (!_db.Contents.Any(c => c.Id == contentId))
                return NotFound("Content not found");

            if (_db.Favorites.Any(f => f.UserId == userId && f.ContentId == contentId))
                return BadRequest("Already favorited.");

            var fav = new Favorite
            {
                UserId = userId,
                ContentId = contentId
            };

            _db.Favorites.Add(fav);
            _db.SaveChanges();

            return Ok(new { message = "Added to favorites." });
        }

        [HttpDelete("{contentId:guid}")]
        public IActionResult Remove(Guid contentId)
        {
            var userIdClaim = User.FindFirst("userId")?.Value;
            if (userIdClaim == null) return Unauthorized();
            var userId = Guid.Parse(userIdClaim);

            var fav = _db.Favorites.FirstOrDefault(f => f.UserId == userId && f.ContentId == contentId);
            if (fav == null) return NotFound();

            _db.Favorites.Remove(fav);
            _db.SaveChanges();

            return Ok(new { message = "Removed from favorites." });
        }

        [HttpGet]
        public IActionResult Get()
        {
            var userIdClaim = User.FindFirst("userId")?.Value;
            if (userIdClaim == null) return Unauthorized();
            var userId = Guid.Parse(userIdClaim);

            var favorites = _db.Favorites.Where(f => f.UserId == userId).ToList();
            return Ok(favorites);
        }
    }
}
