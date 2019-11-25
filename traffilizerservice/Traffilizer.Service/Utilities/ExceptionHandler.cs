using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web;
using System.Web.Http;
using System.Web.Http.ModelBinding;

namespace Traffilizer.Service.Utilities
{
    public class ExceptionHandler
    {
        public static void HandleException(Exception e)
        {
        }

        public static void CheckModel(ModelStateDictionary ms)
        {
            if (!ms.IsValid)
            {
                var resp = new HttpResponseMessage(HttpStatusCode.BadRequest)
                {
                    Content = new StringContent("Reason: " + ms.Values.First().Errors.First().ErrorMessage),
                    ReasonPhrase = "Invalid model provided",
                };
                throw new HttpResponseException(resp);
            }
        }

        /// <summary>
        /// Wraps a call in an exceptionhandler to turn exception messages into HTTP Responses. Also checks the model state ms for validity.
        /// </summary>
        public static TResult CallMethod<TResult>(Func<TResult> func, ModelStateDictionary ms)
        {
            CheckModel(ms);
            try
            {
                return func();
            }
            catch (Exception e)
            {
                HandleException(e);
            }
            return func(); // Unreachable as HandleException always throws an exception. Needed for syntax.
        }

        /// <summary>
        /// Wraps a call in an exceptionhandler to turn exception messages into HTTP Responses.
        /// </summary>
        public static TResult CallMethod<TResult>(Func<TResult> func)
        {
            try
            {
                return func();
            }
            catch (Exception e)
            {
                HandleException(e);
            }
            return func(); // Unreachable as HandleException always throws an exception. Needed for syntax.
        }

        public static async Task<TResult> CallMethodAsync<TResult>(Func<Task<TResult>> func)
        {
            try
            {
                return await func();
            }
            catch (Exception e)
            {
                HandleException(e);
            }
            return await func(); // Unreachable as HandleException always throws an exception. Needed for syntax.
        }

        public static async Task CallMethodAsync(Func<Task> func)
        {
            try
            {
                await func();
            }
            catch (Exception e)
            {
                HandleException(e);
            }
        }

        /// <summary>
        /// Wraps a call in an exceptionhandler to turn exception messages into HTTP Responses. Also checks the model state ms for validity.
        /// </summary>
        public static void CallMethod(Action method, ModelStateDictionary ms)
        {
            CallMethod((() => { method(); return 0; }), ms);
        }

        /// <summary>
        /// Wraps a call in an exceptionhandler to turn exception messages into HTTP Responses.
        /// </summary>
        public static void CallMethod(Action method)
        {
            CallMethod(() => { method(); return 0; });
        }
    }
}