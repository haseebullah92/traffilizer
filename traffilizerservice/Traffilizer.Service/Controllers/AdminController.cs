using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web.Http;
using Traffilizer.Core.Models.Admin;
using Traffilizer.Service.Utilities;
using Traffilizer.Core.DataAccess.Admin;
using Microsoft.AspNet.Identity;
using Traffilizer.Core.Models.Dashboard;
using Traffilizer.Service.Models;

namespace Traffilizer.Service.Controllers
{
    [Authorize(Roles = "Admin")]
    [RoutePrefix("api/admin")]
    public class AdminController : ApiController
    {
        // GET api/admin/getalluser
        [Route("getalluser")]
        public async Task<List<UserModel>> GetAllUsers()
        {
            return await ExceptionHandler.CallMethod(async () =>
            {
                var AdminService = new AdminService();
                var result = await AdminService.GetAllUsers(User.Identity.GetUserId());
                return result;
            });
        }

        // Post api/admin/DeactivateUser
        [Route("deactivateuser")]
        [HttpPost]
        public IHttpActionResult DeactivateUser([FromBody]Request Model)
        {
            return ExceptionHandler.CallMethod(() =>
            {
                var AdminService = new AdminService();
                AdminService.DeactivateUser(Model.Id);
                return Ok();
            });
        }

        // Post api/admin/ActivateUser
        [Route("activateuser")]
        [HttpPost]
        public IHttpActionResult ActivateUser([FromBody]Request Model)
        {
            return ExceptionHandler.CallMethod(() =>
            {
                var AdminService = new AdminService();
                AdminService.ActivateUser(Model.Id);
                return Ok();
            });
        }

        // Post api/admin/DeleteUser
        [Route("deleteuser")]
        [HttpPost]
        public IHttpActionResult DeleteUser([FromBody]Request Model)
        {
            return ExceptionHandler.CallMethod(() =>
            {
                var AdminService = new AdminService();
                AdminService.DeleteUser(Model.Id);
                return Ok();
            });
        }

        // GET api/admin/getallwebsites
        [Route("getallwebsites")]
        public async Task<List<AdminURLModel>> GetAllWebsites()
        {
            return await ExceptionHandler.CallMethod(async () =>
            {
                var AdminService = new AdminService();
                var result = await AdminService.GetAllWebsites();
                return result;
            });
        }

        // GET api/admin/getallreports
        [Route("getallreports")]
        public async Task<List<ReportModel>> GetAllReports()
        {
            return await ExceptionHandler.CallMethod(async () =>
            {
                var AdminService = new AdminService();
                var result = await AdminService.GetAllReports();
                return result;
            });
        }

        // Post api/admin/deletereporturl
        [Route("deletereporturl")]
        [HttpPost]
        public IHttpActionResult DeleteReportURL([FromBody]int Id)
        {
            return ExceptionHandler.CallMethod(() =>
            {
                var AdminService = new AdminService();
                AdminService.DeleteReportUrl(Id);
                return Ok();
            });
        }

        // Post api/admin/resolvereport
        [Route("resolvereport")]
        [HttpPost]
        public IHttpActionResult ResolveReport([FromBody]int Id)
        {
            return ExceptionHandler.CallMethod(() =>
            {
                var AdminService = new AdminService();
                AdminService.ResolveReport(Id);
                return Ok();
            });
        }

    }
}
