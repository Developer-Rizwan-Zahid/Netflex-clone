using System.Diagnostics;

namespace Backend.Services
{
    public class HLSService
    {
        private readonly string _hlsFolder = "wwwroot/hls";

        public HLSService()
        {
            if (!Directory.Exists(_hlsFolder))
                Directory.CreateDirectory(_hlsFolder);
        }

        public string ConvertToHLS(string inputFilePath, string outputFileName)
        {
            var outputPath = Path.Combine(_hlsFolder, outputFileName);

            if (!Directory.Exists(outputPath))
                Directory.CreateDirectory(outputPath);

            var ffmpegArgs = $"-i \"{inputFilePath}\" -profile:v baseline -level 3.0 -start_number 0 -hls_time 10 -hls_list_size 0 -f hls \"{outputPath}/index.m3u8\"";

            try
            {
                var process = new Process
                {
                    StartInfo = new ProcessStartInfo
                    {
                        FileName = "ffmpeg",
                        Arguments = ffmpegArgs,
                        RedirectStandardOutput = true,
                        RedirectStandardError = true,
                        UseShellExecute = false,
                        CreateNoWindow = true
                    }
                };

                process.Start();
                process.WaitForExit();

                if (process.ExitCode != 0)
                {
                    var error = process.StandardError.ReadToEnd();
                    throw new Exception($"FFmpeg failed: {error}");
                }

                return outputPath;
            }
            catch (Exception ex)
            {
                throw new Exception($"HLS conversion failed: {ex.Message}");
            }
        }
    }
}
