using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Traffilizer.Core.Models.Dashboard
{
    public class URLModel
    {
        public long Id { get; set; }
        public string URLAddress { get; set; }
        public bool Status { get; set; }
        public int Visits { get; set; }
        public DateTime CreatedOn { get; set; }
        public string UserId { get; set; }
    }
}
