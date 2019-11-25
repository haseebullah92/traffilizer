using AutoMapper;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Data.Entity.Core.Objects;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Traffilizer.Core.Models.Dashboard;
using Traffilizer.Data.ORM;
using Traffilizer.Data.Repository;

namespace Traffilizer.Core.Dashboard.DataAccess
{
    public class DashboardService
    {
        private readonly DB<URL> _dbUrl;
        private readonly DB<URLVisit> _dbUrlVisit;
        private readonly DB<ReportURL> _dbReportUrl;
        public DashboardService()
        {
            _dbUrl = new DB<URL>();
            _dbUrlVisit = new DB<URLVisit>();
            _dbReportUrl = new DB<ReportURL>();
        }

        public int AddUrl(string UrlString, int Duration, string UserId)
        {
            var CheckUrl = _dbUrl.Repository.GetAsQuerable().Count(x => x.URLAddress == UrlString && !x.Deleted);
            if(CheckUrl > 0)
            {
                return 1;
            }

            var URLsCount = _dbUrl.Repository.GetAsQuerable().Count(x => x.UserId == UserId && x.Duration == Duration && !x.Deleted);
            if(URLsCount <= 10)
            {
                var Url = new URL
                {
                    URLAddress = UrlString,
                    CreatedOn = DateTime.Now,
                    Status = true,
                    UserId = UserId,
                    Duration = Duration,
                    AdminUrl = false
                };

                _dbUrl.Repository.Insert(Url);
                _dbUrl.Save();
                return 0;
            }
            else
            {
                return 2;
            }
            
        }

        public int AddAdminUrl(string UrlString, int Duration, string UserId)
        {
            var CheckUrl = _dbUrl.Repository.GetAsQuerable().Count(x => x.URLAddress == UrlString && !x.Deleted);
            if (CheckUrl > 0)
            {
                return 1;
            }

            var Url = new URL
            {
                URLAddress = UrlString,
                CreatedOn = DateTime.Now,
                Status = true,
                UserId = UserId,
                Duration = Duration,
                AdminUrl = true
            };

            _dbUrl.Repository.Insert(Url);
            _dbUrl.Save();
            return 0;
        }

        public bool CheckUrlVisit(UrlForVisitModel Url, string UserId)
        {
            var UrlVisit = _dbUrlVisit.Repository.GetAsQuerable().Where(x => x.URLId == Url.id && x.VisitedBy == UserId
            && DbFunctions.TruncateTime(x.VisitedOn) == DbFunctions.TruncateTime(DateTime.Now)).FirstOrDefault();
            if (UrlVisit == null)
                return true;
            return false;
        }

        public void AddUrlVisit(UrlForVisitModel Url, string UserId)
        {
            var UrlVisit = new URLVisit
            {
                URLId = Url.id,
                VisitedBy = UserId,
                VisitedOn = DateTime.Now
            };

            _dbUrlVisit.Repository.Insert(UrlVisit);
            _dbUrlVisit.Save();
        }

        public async Task<List<URLModel>> GetAllURLs(string UserId, int Duration)
        {
            var result = await _dbUrl.Repository.GetAsQuerable().Include("URLVisit").Where(x => x.UserId == UserId && x.Duration == Duration && !x.Deleted)
                .Select(x => new URLModel
                {
                    Id = x.Id,
                    URLAddress = x.URLAddress,
                    Status = x.Status,
                    CreatedOn = x.CreatedOn,
                    UserId = x.UserId,
                    Visits = x.URLVisits.Count()
                })
                .ToListAsync();
            return result;
        }

        public UrlForVisitModel GetAdminURLForVisit(string UserId, int Duration, int Count, bool Mobile)
        {
            TraffilizerEntities _context = new TraffilizerEntities();
            return _context.GetUrlForVisit(UserId, Count, Duration, Mobile).Select(x => new UrlForVisitModel
            {
                id = x.id,
                URLAddress = x.URLAddress,
                Duration = x.Duration
            }).FirstOrDefault();
        }


        public UrlForVisitModel GetURLForVisit(string UserId, int Duration, int Count, bool Mobile)
        {
            var Given = _dbUrlVisit.Repository.GetAsQuerable().Count(x => x.VisitedBy == UserId
            && DbFunctions.TruncateTime(x.VisitedOn) == DbFunctions.TruncateTime(DateTime.Now));

            if (Duration == 1 || Duration == 2)
            {
                if(Given < 100)
                {
                    TraffilizerEntities _context = new TraffilizerEntities();
                    return _context.GetUrlForVisit(UserId, Count, Duration, Mobile).Select(x => new UrlForVisitModel
                    {
                        id = x.id,
                        URLAddress = x.URLAddress,
                        Duration = x.Duration
                    }).FirstOrDefault();
                }
                else
                {
                    throw new Exception("Your daily hits limit of 100 is exceeded.");
                }
            }
            else
            {
                if (Given < 50)
                {
                    TraffilizerEntities _context = new TraffilizerEntities();
                    return _context.GetUrlForVisit(UserId, Count, Duration, Mobile).Select(x => new UrlForVisitModel
                    {
                        id = x.id,
                        URLAddress = x.URLAddress,
                        Duration = x.Duration
                    }).FirstOrDefault();
                }
                else
                {
                    throw new Exception("Your daily hits limit of 50 is exceeded.");
                }
            }    
        }

        public async Task<DailyStatsModel> GetDailyStats(string UserId, int Duration)
        {
            return new DailyStatsModel
            {
                TrafficGiven = await _dbUrlVisit.Repository.GetAsQuerable().Where(x => !x.Deleted && x.URL.Duration == Duration && x.VisitedBy == UserId && EntityFunctions.TruncateTime(x.VisitedOn) == EntityFunctions.TruncateTime(DateTime.Today)).CountAsync(),
                TrafficReceived = await _dbUrlVisit.Repository.GetAsQuerable().Where(x => x.URL.UserId == UserId && x.URL.Duration == Duration && EntityFunctions.TruncateTime(x.VisitedOn) == EntityFunctions.TruncateTime(DateTime.Today)).CountAsync()
            };
        }

        public void DisableUrl(int Id)
        {
            var Url = _dbUrl.Repository.GetById(Id);
            Url.Status = false;
            _dbUrl.Repository.Update(Url);
            _dbUrl.Save();
        }

        public void EnableUrl(int Id)
        {
            var Url = _dbUrl.Repository.GetById(Id);
            Url.Status = true;
            _dbUrl.Repository.Update(Url);
            _dbUrl.Save();
        }

        public void DeleteUrl(int Id)
        {
            var Url = _dbUrl.Repository.GetById(Id);
            Url.Deleted = true;
            _dbUrl.Repository.Update(Url);
            _dbUrl.Save();
        }

        public void ReportUrl(string UserId, int Id, string Message)
        {
            var UrlReport = new ReportURL
            {
                URLId = Id,
                Message = Message,
                ReportedDate = DateTime.Now,
                ReportedBy = UserId
            };
            _dbReportUrl.Repository.Insert(UrlReport);
            _dbReportUrl.Save();
        }
    }
}