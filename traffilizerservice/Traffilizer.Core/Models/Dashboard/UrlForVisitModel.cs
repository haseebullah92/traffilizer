using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Traffilizer.Core.Models.Dashboard
{
    public class UrlForVisitModel
    {
        public long id { get; set; }
        public string URLAddress { get; set; }
        public int Duration { get; set; }
        public int Count { get; set; }
        public bool Mobile { get; set; }

    }
}
