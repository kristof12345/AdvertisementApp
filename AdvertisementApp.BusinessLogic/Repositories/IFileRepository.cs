using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace AdvertisementApp.BusinessLogic.Repositories
{
    public interface IFileRepository
    {
        Task<string> SaveAsync(IFormFile file, string userName);

        void Delete(string fileName, string userName);

        PhysicalFileResult Load(string fileName, string userName);

        void CreateFolder(string userName);
    }
}