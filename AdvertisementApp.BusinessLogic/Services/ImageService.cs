using AdvertisementApp.BusinessLogic.Repositories;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace AdvertisementApp.BusinessLogic.Services
{
    public class ImageService
    {
        private readonly IFileRepository FileRepository = null;

        public ImageService(IFileRepository fileRepository)
        {
            FileRepository = fileRepository;
        }

        public PhysicalFileResult Load(string fileName, string userName)
        {
            return FileRepository.Load(fileName, userName);
        }

        public async Task<string> Save(IFormFile file, string userName)
        {
            return await FileRepository.SaveAsync(file, userName);
        }

        public void Delete(string fileName, string userName)
        {
            FileRepository.Delete(fileName, userName);
        }
    }
}
