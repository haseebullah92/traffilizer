using System;
using System.Collections.Generic;
using System.Data.Entity.Validation;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web.Configuration;
using Traffilizer.Data.ORM;

namespace Traffilizer.Data.Repository
{
    public class DB<T> : IDisposable where T : class
    {
        private readonly TraffilizerEntities _context = new TraffilizerEntities();

        private bool _disposed;

        private Repository<T> _repository;

        public Repository<T> Repository
        {
            get { return _repository ?? (_repository = new Repository<T>(_context)); }
        }

        public TraffilizerEntities Context { get { return _context; } }

        public void Dispose()
        {
            Dispose(true);
            GC.SuppressFinalize(this);
        }

        public void Save()
        {
            try
            {
                _context.SaveChanges();
            }
            catch (DbEntityValidationException dbEx)
            {
                string message =
                    dbEx.EntityValidationErrors.Aggregate("", (current1, validationErrors) => validationErrors.ValidationErrors.Aggregate(current1, (current, validationError) => current + string.Format(" Property: {0} Error: {1} ", validationError.PropertyName, validationError.ErrorMessage)));
                throw new Exception(message);
            }
        }

        protected virtual void Dispose(bool disposing)
        {
            if (!_disposed)
            {
                if (disposing)
                {
                    _context.Dispose();
                }
            }
            _disposed = true;
        }
    }
}
