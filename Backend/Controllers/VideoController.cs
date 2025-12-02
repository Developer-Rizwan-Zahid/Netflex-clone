using Backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;


namespace Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Roles = "AppDomain")]
    public class VideoController : ControllerBase
    {
        private readonly S3Service _s3;
        public VideoController(S3Service s3)
        {
            _s3 = s3;
        }
        [HttpGet("upload-url")]
        public IActionResult GetPresignedUrl([FromQuery] string filename)
        {
            if (string.IsNullOrWhiteSpace(filename))
            return BadRequest("Filename is Required");
            
            var key = $"videos/{Guid.NewGuid()}_{filename}";
            var url = _s3.GetPresignedUploadUrl(key);

            return Ok(new {url, key});
        }
    }
}