using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web.Http;
using Traffilizer.Service.Utilities;
using Traffilizer.Core.Dashboard.DataAccess;
using Microsoft.AspNet.Identity;
using Traffilizer.Service.Models;
using Traffilizer.Core.Models.Dashboard;
using System.Security.Claims;
using Newtonsoft.Json;

namespace Traffilizer.Service.Controllers
{
    [Authorize]
    [RoutePrefix("api/dashboard")]
    public class DashboardController : ApiController
    {
        // POST api/dashboard/addurl
        [Route("addurl")]
        [HttpPost]
        public IHttpActionResult AddUrl(UrlViewModel Url)
        {
            return ExceptionHandler.CallMethod(() =>
            {
                var DashboardService = new DashboardService();
                var role = ((ClaimsIdentity)User.Identity).Claims
                .Where(c => c.Type == ClaimTypes.Role)
                .Select(c => c.Value)
                .FirstOrDefault();
                var result = 0;

                if (role == "Admin")
                    result = DashboardService.AddAdminUrl(Url.Url, Url.Duration, User.Identity.GetUserId());
                else
                    result = DashboardService.AddUrl(Url.Url, Url.Duration, User.Identity.GetUserId());                

                if(result == 0)
                {
                    return Json(new { success = true, message = "URL added successfully!" });
                }
                else if (result == 1)
                {
                    return Json(new { success = false, message = "Duplicate URL!" });
                }
                else if (result == 2)
                {
                    return Json(new { success = false, message = "URLs limit succeeded!" });
                }
                else
                {
                    return Json(new { success = false, message = "URL not added!" });
                }
                
            }, ModelState);
        }

        // GET api/dashboard/getallurls
        [Route("getallurls/{Duration}")]
        public async Task<List<URLModel>> GetAllURLs(int Duration)
        {
            return await ExceptionHandler.CallMethod(async () =>
             {
                 var DashboardService = new DashboardService();
                 var result = await DashboardService.GetAllURLs(User.Identity.GetUserId(), Duration);
                 return result;
             });
        }

        // Post api/dashboard/getallurls
        [Route("GetURLForVisit")]
        [HttpPost]
        public async Task<UrlForVisitModel> GetURLForVisit(UrlForVisitModel Model)
        {
            return await ExceptionHandler.CallMethod(async () =>
            {
                var DashboardService = new DashboardService();
                UrlForVisitModel result = null;
                if (DashboardService.CheckUrlVisit(Model, User.Identity.GetUserId()))
                {
                    if (Model.URLAddress != null)
                    {
                        DashboardService.AddUrlVisit(Model, User.Identity.GetUserId());
                    }

                    var role = ((ClaimsIdentity)User.Identity).Claims
                    .Where(c => c.Type == ClaimTypes.Role)
                    .Select(c => c.Value)
                    .FirstOrDefault();                    

                    if (role == "Admin")
                        result = DashboardService.GetAdminURLForVisit(User.Identity.GetUserId(), Model.Duration, Model.Count, Model.Mobile);
                    else
                        result = DashboardService.GetURLForVisit(User.Identity.GetUserId(), Model.Duration, Model.Count, Model.Mobile);
                    
                }
                return result;
            });
        }

        // GET api/dashboard/dailystats
        [Route("dailystats/{Duration}")]
        [HttpGet]
        public async Task<DailyStatsModel> DailyStats(int Duration)
        {
            return await ExceptionHandler.CallMethod(async () =>
            {
                var DashboardService = new DashboardService();
                var result = await DashboardService.GetDailyStats(User.Identity.GetUserId(), Duration);
                return result;
            });
        }

        // Post api/dashboard/DisableURL
        [Route("disableurl")]
        [HttpPost]
        public IHttpActionResult DisableURL([FromBody]int Id)
        {
            return ExceptionHandler.CallMethod(() =>
            {
                var DashboardService = new DashboardService();
                DashboardService.DisableUrl(Id);
                return Ok();
            });
        }

        // Post api/dashboard/enableURL
        [Route("enableurl")]
        [HttpPost]
        public IHttpActionResult EnableURL([FromBody]int Id)
        {
            return ExceptionHandler.CallMethod(() =>
            {
                var DashboardService = new DashboardService();
                DashboardService.EnableUrl(Id);
                return Ok();
            });
        }

        // Post api/dashboard/deleteURL
        [Route("deleteurl")]
        [HttpPost]
        public IHttpActionResult DeleteURL([FromBody]int Id)
        {
            return ExceptionHandler.CallMethod(() =>
            {
                var DashboardService = new DashboardService();
                DashboardService.DeleteUrl(Id);
                return Ok();
            });
        }

        // Post api/dashboard/reportURL
        [Route("reporturl")]
        [HttpPost]
        public IHttpActionResult ReportURL([FromBody]UrlReportViewModel Model)
        {
            return ExceptionHandler.CallMethod(() =>
            {
                var DashboardService = new DashboardService();
                DashboardService.ReportUrl(User.Identity.GetUserId(), Model.Id, Model.Message);
                return Ok();
            });
        }

    }
}
