using AdvertisementApp.BusinessLogic.Repositories;
using AdvertisementApp.Infrastructure.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Diagnostics;
using System.IO;
using System.Threading.Tasks;

namespace AdvertisementApp.DataBase.Repositories
{
    public class FileRepository : IFileRepository
    {
        private readonly string path = @"C:\img\";

        public PhysicalFileResult Load(string fileName, string userName)
        {
            try
            {
                return new PhysicalFileResult(path + userName + "/" + fileName, "image/jpeg");
            }
            catch (Exception e) { Debug.WriteLine("A fájl megnyitása sikertelen: " + e.StackTrace); }
            return null;
        }

        public void Delete(string fileName, string userName)
        {
            File.Delete(path + userName + "/" + fileName);
        }

        public async Task<string> SaveAsync(IFormFile file, string userName)
        {
            string fileName = Path.GetFileNameWithoutExtension(file.FileName);
            string extension = Path.GetExtension(file.FileName);

            var fullPath = path + userName + "/" + fileName + extension;

            try
            {
                int i = 0;
                while (File.Exists(fullPath))
                {
                    i++;
                    fileName += i;
                    fullPath = path + userName + "/" + fileName + extension;
                }

                using (var stream = new FileStream(fullPath, FileMode.Create))
                {
                    await file.CopyToAsync(stream);
                }
                ImageEditor.Crop(fullPath, 1420, 800);
            }
            catch (Exception e) { Debug.WriteLine("A fájl fogadása sikertelen: " + e.StackTrace); }

            return fileName + extension;
        }

        public void CreateFolder(string userName)
        {
            try
            {
                Directory.CreateDirectory(path + userName);
            }
            catch (Exception e) { Debug.WriteLine("A mappa létrehozása sikertelen: " + e.StackTrace); }
        }
    }
}
