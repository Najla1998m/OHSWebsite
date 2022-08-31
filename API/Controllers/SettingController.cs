using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Data;
using API.DTOs;
using API.Entities;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
namespace API.Controllers
{
    public class SettingController : BaseApiController
    {
        private readonly DataContext _context;
        private readonly IMapper _mapper;
        public SettingController(DataContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }
        [HttpGet("GetAllSetting")]
        public async Task<ActionResult> GetAllSetting()
        {
            var result = await _context.Settings
                                    .Where(s => s.IsDeleted == false&&s.SettingType!= "FormButtonWithChilds" && s.SettingType != "FormButton")
                                    .ToListAsync();

            if (result == null) return NotFound();

            return Ok(result.Select(_mapper.Map<Setting, SettingDto>));
        }

        [HttpGet("GetSettingBySettingType")]
        public async Task<ActionResult> GetAllSetting(string settingType)
        {
            if (settingType == "FormButton")
            {

                var result = await _context.Settings
                                        .Where(s => s.IsDeleted == false && s.SettingType == settingType || s.SettingType == "FormButtonWithChilds")
                                        .ToListAsync();
                if (result == null) return NotFound();

                return Ok(result.Select(_mapper.Map<Setting, SettingDto>));
            }
            else
            {

                var result = await _context.Settings
                                        .Where(s => s.IsDeleted == false && s.SettingType == settingType)
                                        .ToListAsync();
                if (result == null) return NotFound();

                return Ok(result.Select(_mapper.Map<Setting, SettingDto>));
            }




        }

        [HttpPost("GetSettingByListOfKeys")]
        public async Task<ActionResult> GetSettingByListOfKeys(List<string> listOfKeys)
        {
            var result = await _context.Settings
                                    .Where(s => s.IsDeleted == false && listOfKeys.Contains(s.Key)).Distinct()
                                    .ToListAsync();

            if (result == null) return NotFound();

            return Ok(result.Select(_mapper.Map<Setting, SettingDto>));
        }

        [HttpGet("GetSettingInfo")]
        public async Task<ActionResult> GetSettingInfo()
        {

            string[] slidertext = { "First Slider Block Title", "Second Slider Block Title", "Third Slider Block Title" };

            string[] sliderimage = { "First Slider Block Image", "Second Slider Block Image", "Third Slider Block Image" };

            SettingInfoDtos settingInfoDtos = new SettingInfoDtos();


            var result = await _context.Settings
                                    .Distinct()
                                    .ToListAsync();
            settingInfoDtos.SliderImagesList = result.Where(x => sliderimage.Contains(x.Key)).ToList().Select(_mapper.Map<Setting, SettingDto>).Select(x => x.Value).ToList();
            settingInfoDtos.SliderTextList = result.Where(x => slidertext.Contains(x.Key)).ToList().Select(_mapper.Map<Setting, SettingDto>).Select(x => x.Value).ToList();
            settingInfoDtos.CompanyPhone = result.Where(x => x.Key == "Company Phone").FirstOrDefault().Value;
            settingInfoDtos.Email = result.Where(x => x.Key == "Company Mail").FirstOrDefault().Value;
            settingInfoDtos.MapUrl = result.Where(x => x.Key == "Company Map URL").FirstOrDefault().Value;
            settingInfoDtos.VideoURL = result.Where(x => x.Key == "Intro Video URL").FirstOrDefault().Value;
            settingInfoDtos.MainBrief = result.Where(x => x.Key == "Main Brief").FirstOrDefault().Value;
            settingInfoDtos.MainHeadline = result.Where(x => x.Key == "Main Headline").FirstOrDefault().Value;
            settingInfoDtos.ClientsNumLbl = result.Where(x => x.Key == "ClientsNumLbl").FirstOrDefault().Value;
            settingInfoDtos.VendorsNumLbl = result.Where(x => x.Key == "VendorsNumLbl").FirstOrDefault().Value;
            settingInfoDtos.TasksNumLbl = result.Where(x => x.Key == "TasksNumLbl").FirstOrDefault().Value;
            settingInfoDtos.CoursesNumLbl = result.Where(x => x.Key == "CoursesNumLbl").FirstOrDefault().Value;
            settingInfoDtos.MainSliderHeader = result.Where(x => x.Key == "MainSliderHeader").FirstOrDefault().Value;

            




            if (settingInfoDtos == null) return NotFound();

            return Ok(settingInfoDtos);
        }

        [HttpGet("GetSettingById/{id}")]

        public async Task<ActionResult> GetSettingById(int id)
        {
            var settingInDb = await _context.Settings
                                .SingleOrDefaultAsync(s => s.Id == id && s.IsDeleted == false);

            if (settingInDb == null) return NotFound();

            return Ok(_mapper.Map<Setting, SettingDto>(settingInDb));
        }
        [HttpPost("UpdateSetting")]
        public async Task<ActionResult> UpdateSetting(int id, SettingDto settingDto)
        {
            if (!ModelState.IsValid)
                return BadRequest();

            var settingInDb = await _context.Settings
                                    .SingleOrDefaultAsync(s => s.Id == id && s.IsDeleted == false);

            if (settingInDb == null)
                return NotFound();

            settingDto.SettingType = settingInDb.SettingType;
            _mapper.Map(settingDto, settingInDb);

            return Ok(await _context.SaveChangesAsync() > 0);
        }
        [Authorize]
        [HttpPost("CreateSetting")]
        public async Task<ActionResult> CreateSetting(SettingDto settingDto)
        {
            if (!ModelState.IsValid)
                return BadRequest();

            var setting = _mapper.Map<SettingDto, Setting>(settingDto);
            await _context.Settings.AddAsync(setting);
            await _context.SaveChangesAsync();

            settingDto.Id = setting.Id;

            return Ok(settingDto);
        }
        [Authorize]
        [HttpPost("DeleteSetting")]
        public async Task<ActionResult> DeleteSetting(int id)
        {
            var settingInDb = await _context.Settings
                                  .SingleOrDefaultAsync(s => s.Id == id
                                                            && s.IsDeleted == false);

            if (settingInDb == null) return NotFound();

            settingInDb.IsDeleted = true;
            return Ok(await _context.SaveChangesAsync() > 0);
        }
    }
}