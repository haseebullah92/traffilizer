using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Traffilizer.Core.Models.Admin
{
    public class AdminURLModel
    {
        public long Id { get; set; }
        public string URLAddress { get; set; }
        public bool Status { get; set; }
        public string UserName { get; set; }
        public DateTime CreatedOn { get; set; }
    }
}
