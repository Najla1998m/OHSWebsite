using System;
using System.IO;
using System.Net;
using System.Text.RegularExpressions;
using API.Helpers;
using API.Interfaces;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;

namespace API.Services
{
    public class ImageConversion : IImageConversion
    {
        private readonly IConfiguration _config;
        private readonly IWebHostEnvironment _hostingEnvironment;
        public ImageConversion(IWebHostEnvironment hostingEnvironment, IConfiguration config)
        {
            _config = config;
            _hostingEnvironment = hostingEnvironment;
        }
        public bool CheckIfImageBase64String(string image)
        {
            return (image.Length % 4 == 0) && Regex.IsMatch(image, @"^[a-zA-Z0-9\+/]*={0,3}$", RegexOptions.None);
        }

        public void ConvertImageToBase64StringAndSaveToPath(string image, string imagePath)
        {
            var imageBytes = Convert.FromBase64String(image);

            System.IO.File.WriteAllBytes(imagePath, imageBytes);
            // try
            // {
            //     WebClient client = new WebClient();
            //      client.Credentials = new NetworkCredential("ph18240127662", "OHSAdmin_P@ss_12345");
            //     client.UploadFile(imagePath, "POST", imageBytes);
            //     client.Dispose();
            // }
            // catch (Exception err)
            // {

            // }
        }

        public string SetImageName(string image)
        {
            return String.Format("{0}_{1}.{2}",
                                            image.Split('.')[0],
                                            CustomDateTimeConverter.Timezone().Ticks,
                                            image.Split('.')[image.Split('.').Length - 1]);
        }

        public string SaveImageToPath(string image, string imagePath, string imageName)
        {
            // var path = Path.Combine(_config["UploadPath"], imagePath);
            var path = @"G:\PleskVhosts\ohsjoeq.com\Admin\Images\" + imagePath;
            string webRootPath = _hostingEnvironment.WebRootPath;
            string contentRootPath = _hostingEnvironment.ContentRootPath;
            // var path = @"http:\\ohsjoeq.com\\Images\\" + imagePath;
            // var path = HttpContext.Current.Server.MapPath();
            // if (!Directory.Exists(path)) Directory.CreateDirectory(path);

            var isImageBase64String = CheckIfImageBase64String(image.Trim());

            if (!isImageBase64String)
                return Path.GetFileName(image);



            var imgName = SetImageName(imageName);

            var imgPath = Path.Combine(path, imgName);
            ConvertImageToBase64StringAndSaveToPath(image, imgPath);
            return imgName;
        }

        public string GetImagePath(string imageFolder, string imageName)
        {
            //return Path.Combine(@"ohsjoeq.com", "Images", imageFolder, imageName);
            //return @"/Images/" + imageFolder + "/" + imageName;
            //var absolutePath = Path.Combine(_config["ImagePath"], imageFolder,imageName);
            //int relativePathStartIndex = absolutePath.IndexOf("ohsjoeq.com");
            //var relativePath = absolutePath.Substring(relativePathStartIndex);
            //return "http://"+relativePath;

            // return Path.Combine(_config["ImagePath"], imageFolder, imageName);
            var path = _config["ImagePath"] + imageFolder + "/" + imageName;
            return path.Replace(@"\\", @"/");
        }
    }
}