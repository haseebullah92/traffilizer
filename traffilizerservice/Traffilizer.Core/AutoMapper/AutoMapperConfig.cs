using AutoMapper;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Traffilizer.Core.Models.Dashboard;
using Traffilizer.Data.ORM;

namespace Traffilizer.Core.AutoMapper
{
    public static class AutoMapperConfig
    {
        public static void AddCollectionMappers(this IMapperConfigurationExpression cfg)
        {
            // URL -> URLModel
            cfg.CreateMap<URL, URLModel>();
        }
    }
}
