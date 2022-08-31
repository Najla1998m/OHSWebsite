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
    public class PackageController : BaseApiController
    {
        private readonly DataContext _context;
        private readonly IMapper _mapper;
        public PackageController(DataContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }
        [HttpGet("GetAllPackage")]
        public async Task<ActionResult> GetAllPackage()
        {
            var result = await _context.Packages
                                    .Include(s => s.PackageDetails)
                                    .Where(s => s.IsDeleted == false)
                                    .ToListAsync();

            if (result == null) return NotFound();

            return Ok(result.Select(_mapper.Map<Package, PackageDto>));
        }
        [HttpGet("GetPackageById/{id}")]

        public async Task<ActionResult> GetPackageById(int id)
        {
            var packageInDb = await _context.Packages
                                .SingleOrDefaultAsync(s => s.Id == id && s.IsDeleted == false);

            if (packageInDb == null) return NotFound();

            return Ok(_mapper.Map<Package, PackageDto>(packageInDb));
        }

        [HttpGet("GetPackageDetailsByPackageId/{id}")]
        public async Task<ActionResult> GetPackageDetailsByPackageId(int id)
        {
            var packageDetailsInDb = await _context.PackageDetails
                                .Where(s => s.PackageId == id && s.IsDeleted == false)
                                .ToListAsync();

            if (packageDetailsInDb.Count == 0) return NotFound();

            return Ok(packageDetailsInDb.Select(_mapper.Map<PackageDetails, PackageDetailsDto>));
        }
        [HttpPost("UpdatePackage")]
        public async Task<ActionResult> UpdatePackage(int id, PackageDto packageDto)
        {
            if (!ModelState.IsValid)
                return BadRequest();

            var packageInDb = await _context.Packages
                                    .SingleOrDefaultAsync(s => s.Id == id && s.IsDeleted == false);

            if (packageInDb == null)
                return NotFound();

            _mapper.Map(packageDto, packageInDb);

            return Ok(await _context.SaveChangesAsync() > 0);
        }

        [HttpPost("CreatePackage")]
        public async Task<ActionResult> CreatePackage(PackageDto packageDto)
        {
            if (!ModelState.IsValid)
                return BadRequest();

            var package = _mapper.Map<PackageDto, Package>(packageDto);
            await _context.Packages.AddAsync(package);
            await _context.SaveChangesAsync();

            packageDto.Id = package.Id;

            return Ok(packageDto);
        }
        [HttpPost("CreatePackageDetails")]
        public async Task<ActionResult> CreatePackageDetails(PackageDetailsDto packageDetailsDto)
        {
            if (!ModelState.IsValid)
                return BadRequest();

            var packageDetails = _mapper.Map<PackageDetailsDto, PackageDetails>(packageDetailsDto);
            await _context.PackageDetails.AddAsync(packageDetails);
            await _context.SaveChangesAsync();

            packageDetailsDto.Id = packageDetails.Id;

            return Ok(packageDetailsDto);
        }

        [HttpPost("UpdatePackageDetails")]
        public async Task<ActionResult> UpdatePackageDetails(PackageDetailsDto packageDetailsDto)
        {
            if (!ModelState.IsValid)
                return BadRequest();

            var packageDetailsInDb = await _context.PackageDetails
                                    .SingleOrDefaultAsync(s => s.Id == packageDetailsDto.Id && s.IsDeleted == false);

            if (packageDetailsInDb == null)
                return NotFound();

            _mapper.Map(packageDetailsDto, packageDetailsInDb);

            return Ok(await _context.SaveChangesAsync() > 0);
        }
        [HttpPost("DeletePackageDetails")]
        public async Task<ActionResult> DeletePackageDetails(int id)
        {
            var packageDetailsInDb = await _context.PackageDetails
                                  .SingleOrDefaultAsync(s => s.Id == id
                                                            && s.IsDeleted == false);

            if (packageDetailsInDb == null) return NotFound();

            packageDetailsInDb.IsDeleted = true;
            return Ok(await _context.SaveChangesAsync() > 0);
        }
        [HttpPost("DeletePackage")]
        public async Task<ActionResult> DeletePackage(int id)
        {
            var packageInDb = await _context.Packages
                                  .SingleOrDefaultAsync(s => s.Id == id
                                                            && s.IsDeleted == false);

            if (packageInDb == null) return NotFound();

            packageInDb.IsDeleted = true;
            return Ok(await _context.SaveChangesAsync() > 0);
        }
    }
}