using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LandProperty.Contract.DTO
{
    public class LoggerDto
    {
        public int LogId { get; set; }
        public string? Action { get; set; }
        public string? EntityType { get; set; }
        public int? EntityId { get; set; }
        public string? Description { get; set; }
        public DateTime ActionDate { get; set; }
        public string? UserName { get; set; }
    }
}
