using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Traffilizer.Core.Models.Admin
{
    public class UserModel
    {
        public string Id { get; set; }
        public string UserName { get; set; }
        public bool Status { get; set; }
        public DateTime CreatedOn { get; set; }
    }
}
