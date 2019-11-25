using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Traffilizer.Core.Models.Admin
{
    public class ReportModel
    {
        public long Id { get; set; }
        public string Message { get; set; }
        public string URLAddress { get; set; }
        public System.DateTime ReportedDate { get; set; }
        public string ReportedBy { get; set; }
    }
}
