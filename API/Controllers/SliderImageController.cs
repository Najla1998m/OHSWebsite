using System;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using API.Data;
using API.DTOs;
using API.Entities;
using API.Helpers;
using API.Interfaces;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;

namespace API.Controllers
{
    
    public class SliderImageController : BaseApiController
    {
        private readonly DataContext _context;
        private readonly IMapper _mapper;
        private readonly IConfiguration _config;
        private readonly IWebHostEnvironment _appEnvironment;
        private readonly IImageConversion _imageConversion;
        public SliderImageController(DataContext context,
                                    IMapper mapper,
                                    IConfiguration config,
                                    IWebHostEnvironment hostingEnvironment,
                                    IImageConversion imageConversion)
        {
            _config = config;
            _context = context;
            _mapper = mapper;
            _appEnvironment = hostingEnvironment;
            _imageConversion = imageConversion;
        }
        [HttpGet("GetAllSliderImage")]
        public async Task<ActionResult> GetAllSliderImage()
        {
            var sliderImages = await _context.SliderImages
                                    .Where(s => s.IsDeleted == false)
                                    .ToListAsync();

            if (sliderImages == null) return NotFound();

            var result = sliderImages
                            .Select(_mapper.Map<SliderImage, SliderImageDto>)
                            .ToList();

            result.ForEach(s =>
            {
                s.Image = s.Image != null
                                    ? _imageConversion.GetImagePath(ImagesPath.SliderImages, s.Image)
                                    : null;
            });

            return Ok(result);
        }
        [HttpGet("GetSliderImageById/{id}")]

        public async Task<ActionResult> GetSliderImageById(int id)
        {
            var sliderImageInDb = await _context.SliderImages
                                .SingleOrDefaultAsync(s => s.Id == id && s.IsDeleted == false);

            if (sliderImageInDb == null) return NotFound();

            var sliderImageDto = _mapper.Map<SliderImage, SliderImageDto>(sliderImageInDb);

            sliderImageDto.Image = sliderImageDto.Image != null
                                    ? _imageConversion.GetImagePath(ImagesPath.SliderImages, sliderImageDto.Image)
                                    : null;

            return Ok(sliderImageDto);
        }
        [Authorize]
        [HttpPost("UpdateSliderImage")]
        public async Task<ActionResult> UpdateSliderImage(int id, SliderImageDto sliderImageDto)
        {
            if (!ModelState.IsValid)
                return BadRequest();

            var sliderImageInDb = await _context.SliderImages
                                    .SingleOrDefaultAsync(s => s.Id == id && s.IsDeleted == false);

            if (sliderImageInDb == null)
                return NotFound();

            sliderImageDto.Image = _imageConversion.SaveImageToPath(sliderImageDto.Image, ImagesPath.SliderImages, sliderImageDto.ImageName);
            sliderImageDto.Id = id;

            var sliderImage = _mapper.Map(sliderImageDto, sliderImageInDb);

            var result = await _context.SaveChangesAsync() > 0 ? sliderImageDto : null;

            result.Image = _imageConversion.GetImagePath(ImagesPath.SliderImages, sliderImageDto.Image);

            return Ok(result);
        }
        [Authorize]
        [HttpPost("CreateSliderImage")]
        public async Task<ActionResult> CreateSliderImage(SliderImageDto sliderImageDto)
        {
            if (!ModelState.IsValid)
                return BadRequest();

            // var path = _config.GetValue<string>("UploadPath");
            // var path = @"C:\Files\CRM";
            // var path = Path.Combine(_appEnvironment.ContentRootPath, "Images", "SliderImages");
            // if (!Directory.Exists(path))
            // {
            //     Directory.CreateDirectory(path);
            // }

            // var imageBytes = Convert.FromBase64String(sliderImageDto.Image);
            // // var imagePath = ;
            // var imageName = String.Format("{0}_{1}.{2}",
            //                                 sliderImageDto.ImageName.Split('.')[0],
            //                                 DateTime.Now.Ticks,
            //                                 sliderImageDto.ImageName.Split('.')[1]);

            // var imgPath = Path.Combine(path, imageName);

            // System.IO.File.WriteAllBytes(imgPath, imageBytes);

            sliderImageDto.Image = _imageConversion.SaveImageToPath(sliderImageDto.Image, ImagesPath.SliderImages, sliderImageDto.ImageName);

            var sliderImage = _mapper.Map<SliderImageDto, SliderImage>(sliderImageDto);
            // sliderImage.Image = imageName;
            // sliderImageDto.Image = imgPath;

            await _context.SliderImages.AddAsync(sliderImage);
            await _context.SaveChangesAsync();

            sliderImageDto.Id = sliderImage.Id;
            sliderImageDto.Image = _imageConversion.GetImagePath(ImagesPath.SliderImages, sliderImageDto.Image);

            return Ok(sliderImageDto);
        }
        [Authorize]
        [HttpPost("DeleteSliderImage")]
        public async Task<ActionResult> DeleteSliderImage(int id)
        {
            var sliderImageInDb = await _context.SliderImages
                                  .SingleOrDefaultAsync(s => s.Id == id
                                                            && s.IsDeleted == false);

            if (sliderImageInDb == null) return NotFound();

            sliderImageInDb.IsDeleted = true;
            return Ok(await _context.SaveChangesAsync() > 0);
        }
    }
}