using Backend.Data;
using Backend.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class SearchController : ControllerBase
    {
        private readonly AppDbContext _db;

        public SearchController(AppDbContext db)
        {
            _db = db;
        }

        [HttpPost]
        public IActionResult Search([FromBody] SearchRequest request)
        {
            var query = _db.Contents.AsQueryable();

            if (!string.IsNullOrWhiteSpace(request.Query))
                query = query.Where(c => EF.Functions.ILike(c.Title, $"%{request.Query}%"));

            if (!string.IsNullOrWhiteSpace(request.Genre))
                query = query.Where(c => c.Genre == request.Genre);

            if (!string.IsNullOrWhiteSpace(request.Type))
                query = query.Where(c => c.Type == request.Type); // Make sure Content has Type property

            if (request.Year.HasValue)
                query = query.Where(c => c.ReleaseDate.Year == request.Year.Value);

            if (request.MinRating.HasValue)
                query = query.Where(c => c.Rating >= request.MinRating.Value); // Make sure Content has Rating property

            var results = query.OrderByDescending(c => c.ReleaseDate).ToList();

            return Ok(results);
        }
    }
}
