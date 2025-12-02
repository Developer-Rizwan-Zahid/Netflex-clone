using Backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Backend .Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Roles = "Admin")]
    public class HLSController : ControllerBase
    {
        private readonly HLSService _hlsService;

        public HLSController(HLSService hlsService)
        {
            _hlsService = hlsService;
        }
        [HttpPost("generate")]
        public IActionResult GenerateHLS([FromQuery] string filePath, [FromQuery] string videoKey)
        {
            if (string.IsNullOrWhiteSpace(filePath) || string.IsNullOrWhiteSpace(videoKey)) 
            return BadRequest("FilePath and VideoKey are required");
            var folderName = Guid.NewGuid(). ToString();
            var hlsPath = _hlsService.ConvertToHLS(filePath, folderName);

           return Ok(new
           {
               HLSPath = hlsPath,
               Playlist = $"hls/{folderName}/index.m3u8"
           });
        }
    }
}