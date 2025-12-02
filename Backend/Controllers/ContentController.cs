using Backend.Data;
using Backend.Models;
using Backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Roles = "AppDomain")] // Only admin can upload
    public class ContentController : ControllerBase
    {
        private readonly AppDbContext _db;
        private readonly S3Service _s3;
        private readonly HLSService _hls;

        public ContentController(AppDbContext db, S3Service s3, HLSService hls)
        {
            _db = db;
            _s3 = s3;
            _hls = hls;
        }

        // GET all content
        [HttpGet]
        [AllowAnonymous]
        public IActionResult GetAll()
        {
            var contents = _db.Contents.OrderByDescending(c => c.ReleaseDate).ToList();
            return Ok(contents);
        }

        // POST: Upload video file and create content
        [HttpPost("upload")]
        public async Task<IActionResult> Upload([FromForm] ContentUploadRequest request)
        {
            if (request.File == null || request.File.Length == 0)
                return BadRequest("File is required.");

            // 1️⃣ Generate unique filename
            var fileName = $"{Guid.NewGuid()}_{request.File.FileName}";
            var tempPath = Path.Combine(Path.GetTempPath(), fileName);

            // 2️⃣ Save locally temporarily
            using (var stream = new FileStream(tempPath, FileMode.Create))
            {
                await request.File.CopyToAsync(stream);
            }

            try
            {
                // 3️⃣ Upload original file to S3
                var s3Key = $"videos/{fileName}";
                _s3.UploadFile(tempPath, s3Key);

                // 4️⃣ Convert to HLS
                var hlsFolder = _hls.ConvertToHLS(tempPath, Path.GetFileNameWithoutExtension(fileName));

                // 5️⃣ Save content metadata
                var content = new Content
                {
                    Id = Guid.NewGuid(),
                    Title = request.Title,
                    Genre = request.Genre,
                    Type = request.Type,
                    ReleaseDate = DateTime.UtcNow,
                    Rating = request.Rating ?? 0,
                    VideoKey = s3Key,
                    HLSPlaylist = $"{hlsFolder}/index.m3u8",
                    ThumbnailUrl = request.ThumbnailUrl ?? ""
                };

                _db.Contents.Add(content);
                _db.SaveChanges();

                return Ok(content);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Upload failed: {ex.Message}");
            }
            finally
            {
                // Clean up temp file
                if (System.IO.File.Exists(tempPath))
                    System.IO.File.Delete(tempPath);
            }
        }
    }

    // DTO for upload
    public class ContentUploadRequest
    {
        public string Title { get; set; }
        public string Genre { get; set; }
        public string Type { get; set; } = "Movie"; // default
        public double? Rating { get; set; }
        public string? ThumbnailUrl { get; set; }
        public IFormFile File { get; set; }
    }
}
