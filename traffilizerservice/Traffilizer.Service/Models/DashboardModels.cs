using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace Traffilizer.Service.Models
{
    public class UrlViewModel
    {
        [Required]
        public string Url { get; set; }
        [Required]
        public int Duration { get; set; }
    }

    public class UrlReportViewModel
    {
        [Required]
        public int Id { get; set; }
        [Required]
        public string Message { get; set; }
        
    }
}