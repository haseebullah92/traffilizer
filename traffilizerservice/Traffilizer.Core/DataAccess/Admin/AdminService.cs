using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Traffilizer.Core.Models.Admin;
using Traffilizer.Core.Models.Dashboard;
using Traffilizer.Data.ORM;
using Traffilizer.Data.Repository;

namespace Traffilizer.Core.DataAccess.Admin
{
    public class AdminService
    {
        private readonly DB<AspNetUser> _dbUser;
        private readonly DB<URL> _dbUrl;
        private readonly DB<ReportURL> _dbReportUrl;

        public AdminService()
        {
            _dbUser = new DB<AspNetUser>();
            _dbUrl = new DB<URL>();
            _dbReportUrl = new DB<ReportURL>();
        }

        public async Task<List<UserModel>> GetAllUsers(string UserId)
        {
            var result = await _dbUser.Repository.GetAsQuerable().Where(x => !x.Deleted && x.Id != UserId)
                .Select(x => new UserModel
                {
                    Id = x.Id,
                    UserName = x.UserName,
                    Status = x.Active,
                    CreatedOn = x.CreatedOn
                })
                .ToListAsync();
            return result;
        }

        public void DeactivateUser(string Id)
        {
            var User = _dbUser.Repository.GetById(Id);
            User.Active = false;
            _dbUser.Repository.Update(User);
            _dbUser.Save();
        }

        public void ActivateUser(string Id)
        {
            var User = _dbUser.Repository.GetById(Id);
            User.Active = true;
            _dbUser.Repository.Update(User);
            _dbUser.Save();
        }

        public void DeleteUser(string Id)
        {
            var User = _dbUser.Repository.GetById(Id);
            User.Deleted = true;
            _dbUser.Repository.Update(User);
            _dbUser.Save();

            var Urls = _dbUrl.Repository.GetAsQuerable().Where(x => x.UserId == User.Id && !x.Deleted).ToList();
            for (int i = 0; i < Urls.Count; i++)
            {
                Urls[i].Deleted = true;
                _dbUrl.Repository.Update(Urls[i]);
                _dbUrl.Save();
            }         

            var Reports = _dbReportUrl.Repository.GetAsQuerable().Where(x => x.ReportedBy == User.Id && !x.Deleted).ToList();
            for (int i = 0; i < Reports.Count; i++)
            {
                Reports[i].Deleted = true;
                _dbReportUrl.Repository.Update(Reports[i]);
                _dbReportUrl.Save();
            }                      
        }

        public async Task<List<AdminURLModel>> GetAllWebsites()
        {
            var result = await _dbUrl.Repository.GetAsQuerable().Where(x => !x.Deleted)
                .Select(x => new AdminURLModel
                {
                    Id = x.Id,
                    URLAddress = x.URLAddress,
                    Status = x.Status,
                    CreatedOn = x.CreatedOn,
                    UserName = x.AspNetUser.UserName
                })
                .ToListAsync();
            return result;
        }

        public async Task<List<ReportModel>> GetAllReports()
        {
            var result = await _dbReportUrl.Repository.GetAsQuerable().Where(x => !x.Resolved && !x.Deleted)
                .Select(x => new ReportModel
                {
                    Id = x.Id,
                    URLAddress = x.URL.URLAddress,
                    Message = x.Message,
                    ReportedDate = x.ReportedDate,
                    ReportedBy = x.AspNetUser.UserName
                })
                .ToListAsync();
            return result;
        }

        public void DeleteReportUrl(int id)
        {
            var report = _dbReportUrl.Repository.GetById(id);
            report.Resolved = true;
            _dbReportUrl.Repository.Update(report);
            _dbReportUrl.Save();

            var url = _dbUrl.Repository.GetById(report.URLId);
            url.Deleted = true;
            _dbUrl.Repository.Update(url);
            _dbUrl.Save();
        }

        public void ResolveReport(int id)
        {
            var report = _dbReportUrl.Repository.GetById(id);
            report.Resolved = true;
            _dbReportUrl.Repository.Update(report);
            _dbReportUrl.Save();
        }

    }
}
