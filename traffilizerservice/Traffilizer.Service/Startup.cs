using System;
using System.Collections.Generic;
using System.Linq;
using AutoMapper;
using Microsoft.Owin;
using Owin;
using Traffilizer.Core.AutoMapper;

[assembly: OwinStartup(typeof(Traffilizer.Service.Startup))]

namespace Traffilizer.Service
{
    public partial class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            ConfigureAuth(app);
            Mapper.Initialize(cfg =>
            {
                cfg.AddCollectionMappers();
            });
        }
    }
}
