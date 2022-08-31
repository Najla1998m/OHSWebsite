namespace API.Interfaces
{
    public interface IImageConversion
    {
        void ConvertImageToBase64StringAndSaveToPath(string image, string imagePath);
        bool CheckIfImageBase64String(string image);
        string SaveImageToPath(string image, string imagePath, string imageName);
        string SetImageName(string image);
        string GetImagePath(string imageFolder, string imageName);
    }
}