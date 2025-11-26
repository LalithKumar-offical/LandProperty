using LandProperty.Data.Models.Roles;
using Microsoft.AspNetCore.Http;

namespace LandProperty.Contract.DTO
{
    public class LandDocumentsDTO
    {
        public class LandDocumentsDto
        {
            public int LandDocumentId { get; set; }
            public string? DocumentType { get; set; }
            public string? DocumentPath { get; set; }
            public string? DocumentDetailsExtracted { get; set; }
            public int? LandId { get; set; }
        }

        public class CreateLandDocumentDto
        {
            public int LandId { get; set; }
            public string DocumentType { get; set; } = string.Empty;
            public IFormFile File { get; set; } = null!;
        }

        public class UploadLandDocumentRequest
        {
            public int LandId { get; set; }
            public IFormFile File { get; set; } = default!;
            public DocumentType Type { get; set; }
        }
    }
}