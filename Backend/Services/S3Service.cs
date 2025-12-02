using Amazon.S3;
using Amazon.S3.Model;
using Microsoft.Extensions.Configuration;

namespace Backend.Services
{
    public class S3Service
    {
        private readonly IConfiguration _config;
        private readonly IAmazonS3 _client;
        private readonly string _bucketName;

        public S3Service(IConfiguration config)
        {
            _config = config;
            var awsConfig = new AmazonS3Config
            {
                ServiceURL = _config["Aws:ServiceURL"],
                ForcePathStyle = true // required for MinIO
            };
            _client = new AmazonS3Client(
                _config["Aws:AccessKey"],
                _config["Aws:SecretKey"],
                awsConfig
            );
            _bucketName = _config["Aws:BucketName"];
        }

        // Get presigned URL for direct client upload
        public string GetPresignedUploadUrl(string key, int expiryMinutes = 15)
        {
            var request = new GetPreSignedUrlRequest
            {
                BucketName = _bucketName,
                Key = key,
                Expires = DateTime.UtcNow.AddMinutes(expiryMinutes),
                Verb = HttpVerb.PUT
            };

            return _client.GetPreSignedURL(request);
        }

        // ✅ New: Upload a local file to S3
        public void UploadFile(string localFilePath, string key)
        {
            using var fileStream = File.OpenRead(localFilePath);
            var request = new PutObjectRequest
            {
                BucketName = _bucketName,
                Key = key,
                InputStream = fileStream,
                ContentType = "application/octet-stream"
            };

            _client.PutObjectAsync(request).Wait();
        }
    }
}
