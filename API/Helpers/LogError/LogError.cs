using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc.Filters;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

namespace API.Helpers.LogError
{
    public class LogError : ILogError
    {
        private readonly IWebHostEnvironment webHostEnvironment;

        public LogError(IWebHostEnvironment webHostEnvironment)
        {
            this.webHostEnvironment = webHostEnvironment;
        }
        public static string Error(Exception ex, string MethodName, params (string Name, object Value)[] parameters)
        {
            if (MethodName == null)
            {
                MethodName = new StackTrace(ex).GetFrame(0).GetMethod().Name;
            }
            string message = "";
            if (ex != null)
            {
                message = "------------------Error----------------------";
                message += Environment.NewLine;
                message += string.Format("Time: {0}", DateTime.Now.ToString("dd/MM/yyyy hh:mm:ss tt"));
                message += Environment.NewLine;
                message += "-----------------------------------------------------------";
                message += Environment.NewLine;
                message += string.Format("Message: {0}", ex.Message);
                message += Environment.NewLine;
                if (ex.InnerException != null)
                {
                    message += string.Format("Inner Exception: {0}", ex.InnerException);
                    message += Environment.NewLine;
                }
                // message += string.Format("Location: {0}", HttpContext.Current.Request.Url.LocalPath);
                message += Environment.NewLine;
                message += string.Format("Method: {0}", MethodName);
                message += Environment.NewLine;
                message += string.Format("Source: {0}", ex.Source);
                message += Environment.NewLine;
                message += string.Format("Target Site: {0}", ex.TargetSite);
                message += Environment.NewLine;
                message += "-----------------------------------------------------------";
                message += Environment.NewLine;
            }
            if (parameters.Length > 0)
            {
                message += "---------------Parameters--------------------";
                message += Environment.NewLine;
                for (var i = 0; i < parameters.Length; i++)
                {

                    message += string.Format("{1}: {0}", JsonConvert.SerializeObject(parameters[i].Value), parameters[i].Name);
                    message += Environment.NewLine;

                }
                message += "-----------------------------------------------------------";
                message += Environment.NewLine;
            }
            return message;
            // string webRootPath = webHostEnvironment.WebRootPath + "\\Admin\\";
            // string contentRootPath = webHostEnvironment.ContentRootPath + "\\Logs\\";

            // if (!Directory.Exists(contentRootPath))
            //     Directory.CreateDirectory(contentRootPath);

            // contentRootPath = contentRootPath + "\\ErrorLog.txt";
            // using (StreamWriter writer = new StreamWriter(contentRootPath, true))
            // {
            //     writer.WriteLine(message);
            //     writer.Close();
            // }
        }
        public void Log(Exception ex, string MethodName, ExceptionContext context, params (string Name, object Value)[] parameters)
        {
            // if (MethodName == null)
            //{
            MethodName = context.ActionDescriptor.DisplayName;
            //}
            string message = "";
            if (ex != null)
            {
                message = "------------------Error----------------------";
                message += Environment.NewLine;
                message += string.Format("Time: {0}", DateTime.Now.ToString("dd/MM/yyyy hh:mm:ss tt"));
                message += Environment.NewLine;
                message += "-----------------------------------------------------------";
                message += Environment.NewLine;
                message += string.Format("Message: {0}", ex.Message);
                message += Environment.NewLine;
                if (ex.InnerException != null)
                {
                    message += string.Format("Inner Exception: {0}", ex.InnerException);
                    message += Environment.NewLine;
                }
                message += string.Format("Location: {0}", context.HttpContext.Request.Path.Value);
                message += Environment.NewLine;
                message += string.Format("Method: {0}", MethodName);
                message += Environment.NewLine;
                message += string.Format("Source: {0}", ex.Source);
                message += Environment.NewLine;
                message += string.Format("Target Site: {0}", ex.TargetSite);
                message += Environment.NewLine;
                message += "-----------------------------------------------------------";
                message += Environment.NewLine;
            }
            if (parameters.Length > 0)
            {
                message += "---------------Parameters--------------------";
                message += Environment.NewLine;
                for (var i = 0; i < parameters.Length; i++)
                {

                    message += string.Format("{1}: {0}", JsonConvert.SerializeObject(parameters[i].Value), parameters[i].Name);
                    message += Environment.NewLine;

                }
                message += "-----------------------------------------------------------";
                message += Environment.NewLine;
            }
            string webRootPath = webHostEnvironment.WebRootPath + "\\Admin\\";
            string contentRootPath = webHostEnvironment.ContentRootPath + "\\Logs\\";

            if (!Directory.Exists(contentRootPath))
                Directory.CreateDirectory(contentRootPath);

            contentRootPath = contentRootPath + "\\ErrorLog.txt";
            using (StreamWriter writer = new StreamWriter(contentRootPath, true))
            {
                writer.WriteLine(message);
                writer.Close();
            }
        }

    }

}
