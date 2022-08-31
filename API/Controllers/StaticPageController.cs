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

namespace API.Controllers
{
   
    public class StaticPageController : BaseApiController
    {
        private readonly DataContext _context;
        private readonly IMapper _mapper;
        private readonly IWebHostEnvironment _appEnvironment;
        private readonly IImageConversion _imageConversion;
        public StaticPageController(DataContext context,
                                    IMapper mapper,
                                    IWebHostEnvironment hostingEnvironment,
                                    IImageConversion imageConversion)
        {
            _appEnvironment = hostingEnvironment;
            _context = context;
            _mapper = mapper;
            _imageConversion = imageConversion;
        }
        [HttpGet("GetAllStaticPage")]
        public async Task<ActionResult> GetAllStaticPage()
        {
            var staticPages = await _context.StaticPages
                                    .Where(s => s.IsDeleted == false)
                                    .OrderBy(s => s.Order)
                                    .ToListAsync();

            if (staticPages == null) return NotFound();

            var result = staticPages.Select(_mapper.Map<StaticPage, StaticPageDto>)
                                    .ToList();

            result.ForEach(s =>
           {
               s.Image = s.Image != null
                           ? _imageConversion.GetImagePath(ImagesPath.StaticPages, s.Image) 
                           : null;
           });

            return Ok(result);
        }
        [HttpGet("GetStaticPageById/{id}")]

        public async Task<ActionResult> GetStaticPageById(int id)
        {
            var staticPagesInDb = await _context.StaticPages
                                .SingleOrDefaultAsync(s => s.Id == id && s.IsDeleted == false);

            if (staticPagesInDb == null) return NotFound();

            var staticPageDto = _mapper.Map<StaticPage, StaticPageDto>(staticPagesInDb);

            staticPageDto.Image = staticPageDto.Image != null
                           ? _imageConversion.GetImagePath(ImagesPath.StaticPages, staticPageDto.Image)
                           : null;

            return Ok(staticPageDto);
        }
        [Authorize]
        [HttpPost("UpdateStaticPage")]
        public async Task<ActionResult> UpdateStaticPage(int id, StaticPageDto staticPageDto)
        {
            if (!ModelState.IsValid)
                return BadRequest();

            var staticPageInDb = await _context.StaticPages
                                    .SingleOrDefaultAsync(s => s.Id == id && s.IsDeleted == false);

            if (staticPageInDb == null)
                return NotFound();

            var staticPageInDbByOrder = await _context.StaticPages
                                     .SingleOrDefaultAsync(s => s.Order == staticPageDto.Order
                                                             && s.Order != staticPageInDb.Order
                                                             && s.IsDeleted == false);

            if (staticPageInDbByOrder != null)
                return BadRequest("Enter another order");

            staticPageDto.Image = _imageConversion.SaveImageToPath(staticPageDto.Image, ImagesPath.StaticPages, staticPageDto.ImageName);

            // var path = Path.Combine(_appEnvironment.ContentRootPath, "Images", ImagesPath.Clients);

            // if (!Directory.Exists(path)) Directory.CreateDirectory(path);



            // if (_imageConversion.CheckIfImageBase64String(staticPageDto.Image.Trim()))
            // {
            //     var imageName = _imageConversion.SetImageName(staticPageDto.ImageName);
            //     _imageConversion.ConvertImageToBase64StringAndSaveToPath(staticPageDto.Image, Path.Combine(path, imageName));
            //     staticPageDto.Image = imageName;
            // }

            // staticPageDto.Image = Path.GetFileName(staticPageDto.Image);
            staticPageDto.Id = id;

            var staticPage = _mapper.Map(staticPageDto, staticPageInDb);

            var result = await _context.SaveChangesAsync() > 0 ? staticPageDto : null;

            result.Image = _imageConversion.GetImagePath(ImagesPath.StaticPages, staticPageDto.Image);

            return Ok(result);
        }
        [Authorize]

        [HttpPost("CreateStaticPage")]
        public async Task<ActionResult> CreateStaticPage(StaticPageDto staticPageDto)
        {
            if (!ModelState.IsValid)
                return BadRequest();

            var staticPageInDb = await _context.StaticPages
                                     .SingleOrDefaultAsync(s => s.Order == staticPageDto.Order
                                                             && s.IsDeleted == false);

            if (staticPageInDb != null)
                return BadRequest("Enter another order");

            // var path = Path.Combine(_appEnvironment.ContentRootPath, "Images", ImagesPath.StaticPages);
            // if (!Directory.Exists(path))
            // {
            //     Directory.CreateDirectory(path);
            // }

            // var imageBytes = Convert.FromBase64String(staticPageDto.Image);
            // // var imagePath = ;
            // var imageName = String.Format("{0}_{1}.{2}",
            //                                 staticPageDto.ImageName.Split('.')[0],
            //                                 DateTime.Now.Ticks,
            //                                 staticPageDto.ImageName.Split('.')[1]);

            // var imgPath = Path.Combine(path, imageName);

            // System.IO.File.WriteAllBytes(imgPath, imageBytes);
            staticPageDto.Image = _imageConversion.SaveImageToPath(staticPageDto.Image, ImagesPath.StaticPages, staticPageDto.ImageName);

            var staticPage = _mapper.Map<StaticPageDto, StaticPage>(staticPageDto);

            // staticPage.Image = staticPageDto.Image;
            // staticPageDto.Image = imgPath;

            await _context.StaticPages.AddAsync(staticPage);
            await _context.SaveChangesAsync();

            staticPageDto.Image = _imageConversion.GetImagePath(ImagesPath.StaticPages, staticPageDto.Image);
            staticPageDto.Id = staticPage.Id;

            return Ok(staticPageDto);
        }
        [Authorize]
        [HttpPost("DeleteStaticPage")]
        public async Task<ActionResult> DeleteStaticPage(int id)
        {
            var staticPageInDb = await _context.StaticPages
                                  .SingleOrDefaultAsync(s => s.Id == id
                                                        && s.IsDeleted == false);

            if (staticPageInDb == null) return NotFound();

            staticPageInDb.IsDeleted = true;
            return Ok(await _context.SaveChangesAsync() > 0);
        }
    }

}