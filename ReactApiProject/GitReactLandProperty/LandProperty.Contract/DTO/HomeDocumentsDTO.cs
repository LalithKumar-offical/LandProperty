using LandProperty.Data.Models.Roles;
using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LandProperty.Contract.DTO
{
    public class HomeDocumentsDTO
    {
        public class HomeDocumentsDto
        {
            public int HomeDocumnetsId { get; set; }
            public string? DocumentType { get; set; }
            public string? DocumentPath { get; set; }
            public string? DocumentDetailsExtracted { get; set; }
            public int? HomeId { get; set; }
        }

        public class CreateHomeDocumentDto
        {
            public int HomeId { get; set; }
            public string DocumentType { get; set; } = string.Empty;
            public IFormFile File { get; set; } = null!;
        }
        public class UploadHomeDocumentRequest
        {
            public int HomeId { get; set; }
            public IFormFile File { get; set; } = default!;
            public DocumentType Type { get; set; }
        }
    }
}
