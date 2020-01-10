using SixLabors.ImageSharp;
using SixLabors.ImageSharp.Processing;
using SixLabors.Primitives;

namespace AdvertisementApp.Infrastructure.Services
{
    public class ImageEditor
    {
        public static void Crop(string file, int width, int height)
        {
            using (Image image = Image.Load(file))
            {
                image.Mutate(ctx => ctx.Resize(new ResizeOptions
                {
                    Mode = ResizeMode.Crop,
                    Position = AnchorPositionMode.Center,
                    Size = new Size(width, height)
                }));
                image.Save(file);
            }
        }
    }
}
