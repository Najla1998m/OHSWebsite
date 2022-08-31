using System.Linq;
using System.Threading.Tasks;
using API.Data;
using API.DTOs;
using API.Entities;
using API.Helpers;
using API.Interfaces;
using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    public class QuotationController : BaseApiController
    {
        private readonly DataContext _context;
        private readonly IMapper _mapper;
        private readonly IImageConversion _imageConversion;
        public QuotationController(DataContext context, IMapper mapper, IImageConversion imageConversion)
        {
            _context = context;
            _mapper = mapper;
            _imageConversion = imageConversion;
        }
        [HttpGet("GetAllQuotations")]
        public async Task<ActionResult> GetAllQuotations()
        {
            var quotationsInDb = await _context.Quotations
                                .Include(s => s.Vendor)
                                .Include(s => s.Order)
                                .Include(s => s.QuotationStatus)
                                .Where(s => s.IsDeleted == false)
                                .ToListAsync();

            if (quotationsInDb == null) return NotFound();

            var quotationsDto = quotationsInDb.Select(_mapper.Map<Quotation, QuotationDto>);

            return Ok(quotationsDto);
        }
        [HttpGet("GetAllQuotationStatus")]
        public async Task<ActionResult> GetAllQuotationStatus()
        {
            var quotationStatusInDb = await _context.QuotationStatuses
                                .Where(s => s.IsDeleted == false)
                                .ToListAsync();

            if (quotationStatusInDb == null) return NotFound();

             var quotationsDto = quotationStatusInDb.Select(_mapper.Map<QuotationStatus, QuotationStatusDto>);

            return Ok(quotationStatusInDb);
        }
        [HttpGet("GetAllQuotationsForVendor")]
        public async Task<ActionResult> GetAllQuotationsForVendor()
        {
            var quotationsForVendor = await _context.Quotations
                                    .Include(s => s.Vendor)
                                    .Where(s => s.IsDeleted == false && s.Vendor.UserRoles.Any(urm => urm.Role.Name == "Company Admin"))
                                    .ToListAsync();

            if (quotationsForVendor == null) return NotFound();

            return Ok(quotationsForVendor.Select(_mapper.Map<Quotation, QuotationDto>));

        }
        [HttpGet("GetQuotationsForVendor")]
        public async Task<ActionResult> GetQuotationsForVendor(string vendorId)
        {
            var quotations = await _context.Quotations
                                    .Where(s => s.IsDeleted == false && s.VendorId == vendorId)
                                    .ToListAsync();

            if (quotations == null || quotations.Count == 0) return NotFound();

            return Ok(quotations.Select(_mapper.Map<Quotation, QuotationDto>));

        }
        [HttpGet("GetQuotationsByOrder/{id}")]
        public async Task<ActionResult> GetQuotationsByOrder(int orderId)
        {
            var orderInDb = await _context.Quotations
                                .Include(s => s.Vendor)
                                .Include(s => s.Order)
                                .Include(s => s.QuotationStatus)
                                .SingleOrDefaultAsync(s => s.OrderId == orderId && s.IsDeleted == false);


            if (orderInDb == null) return NotFound();

            var orderDto = _mapper.Map<Quotation, QuotationDto>(orderInDb);


            return Ok(orderDto);
        }
        [HttpGet("GetQuotationsServedOrders")]
        public async Task<ActionResult> GetQuotationsServedOrders()
        {
            var orderInDb = await _context.Quotations
                                .Include(s => s.Vendor)
                                .Include(s => s.Order)
                                .Include(s => s.QuotationStatus)
                                .SingleOrDefaultAsync(s => s.IsDeleted == false
                                                        && s.QuotationStatus.Name == QuotationStatusName.Finsished);


            if (orderInDb == null) return NotFound();

            var orderDto = _mapper.Map<Quotation, QuotationDto>(orderInDb);


            return Ok(orderDto);
        }
        [HttpGet("GetAllQuotationsInCompany ")]
        public async Task<ActionResult> GetAllQuotationsInCompany(int companyId)
        {
            var orderInDb = await _context.Quotations
                                .Include(s => s.Vendor)
                                .Include(s => s.QuotationStatus)
                                .Include(s => s.Order)
                                .ThenInclude(s => s.Owner)
                                .ThenInclude(s => s.Company)
                                .SingleOrDefaultAsync(s => s.IsDeleted == false
                                                        && s.Order.Owner.CompanyId == companyId);


            if (orderInDb == null) return NotFound();

            var orderDto = _mapper.Map<Quotation, QuotationDto>(orderInDb);


            return Ok(orderDto);
        }
        [HttpGet("GetQuotationsByStatus/{id}")]
        public async Task<ActionResult> GetQuotationsByStatus(int quotationStatusId)
        {
            var orderInDb = await _context.Quotations
                                .Include(s => s.Vendor)
                                .Include(s => s.QuotationStatus)
                                .Include(s => s.Order)
                                .SingleOrDefaultAsync(s => s.QuotationStatusId == quotationStatusId && s.IsDeleted == false);


            if (orderInDb == null) return NotFound();

            var orderDto = _mapper.Map<Quotation, QuotationDto>(orderInDb);


            return Ok(orderDto);
        }

        [HttpGet("GetQuotationById/{id}")]
        public async Task<ActionResult> GetQuotationById(int id)
        {
            var orderInDb = await _context.Quotations
                                .Include(s => s.Order)
                                .Include(s => s.QuotationStatus)
                                .Include(s => s.Vendor)
                                .SingleOrDefaultAsync(s => s.Id == id && s.IsDeleted == false);


            if (orderInDb == null) return NotFound();

            var orderDto = _mapper.Map<Quotation, QuotationDto>(orderInDb);


            return Ok(orderDto);
        }
        [HttpGet("GetQuotationStatusById/{id}")]
        public async Task<ActionResult> GetQuotationStatusById(int id)
        {
            var quotationStatusInDb = await _context.QuotationStatuses
                                .SingleOrDefaultAsync(s => s.Id == id && s.IsDeleted == false);


            if (quotationStatusInDb == null) return NotFound();

            var quotationStatusDto = _mapper.Map<QuotationStatus, QuotationStatusDto>(quotationStatusInDb);


            return Ok(quotationStatusDto);
        }
        [HttpPost("CreateQuotation")]
        public async Task<ActionResult> CreateQuotation(QuotationDto quotationDto)
        {
            if (!ModelState.IsValid)
                return BadRequest();

            var quotation = _mapper.Map<QuotationDto, Quotation>(quotationDto);

            await _context.Quotations.AddAsync(quotation);
            await _context.SaveChangesAsync();

            quotationDto.Id = quotation.Id;

            return Ok(quotationDto);

        }

        [HttpPost("CreateQuotationStatus")]
        public async Task<ActionResult> CreateQuotationStatus(QuotationStatusDto quotationStatusDto)
        {
            if (!ModelState.IsValid)
                return BadRequest();

          var quotationStatus = _mapper.Map<QuotationStatusDto, QuotationStatus>(quotationStatusDto);

            await _context.QuotationStatuses.AddAsync(quotationStatus);
            await _context.SaveChangesAsync();

            return Ok(quotationStatusDto);

        }
        [HttpPost("UpdateQuotation")]
        public async Task<ActionResult> UpdateQuotation( QuotationDto quotationDto)
        {
            if (!ModelState.IsValid)
                return BadRequest();

            var quotationInDb = await _context.Quotations
                                    .SingleOrDefaultAsync(s => s.Id == quotationDto.Id && s.IsDeleted == false);

            if (quotationInDb == null)
                return NotFound();

            //quotationDto.Id = id;

            _mapper.Map(quotationDto, quotationInDb);

            return Ok(await _context.SaveChangesAsync() > 0 ? quotationDto : null);

        }
        [HttpPost("UpdateQuotationStatus")]
        public async Task<ActionResult> UpdateQuotationStatus(int id, QuotationStatusDto quotationStatusDto)
        {
            if (!ModelState.IsValid)
                return BadRequest();

            var quotationStatusInDb = await _context.QuotationStatuses
                                    .SingleOrDefaultAsync(s => s.Id == id);

            if (quotationStatusInDb == null)
                return NotFound();

            quotationStatusDto.Id = id;

            _mapper.Map(quotationStatusDto, quotationStatusInDb);

            return Ok(await _context.SaveChangesAsync() > 0 ? quotationStatusDto : null);

        }
        // [HttpPost("UpdateProductQuantityInStock")]
        // public async Task<ActionResult> UpdateProductQuantityInStock(int orderId)
        // {
        //     if (!ModelState.IsValid)
        //         return BadRequest();

        //     var quotationInDb = await _context.Quotations
        //                             .Include(s => s.Order)
        //                             .SingleOrDefaultAsync(s => s.OrderId == orderId);

        //     if (quotationInDb == null)
        //         return NotFound();


        //     var quotationStatusInDb = await _context.QuotationStatuses
        //                                     .SingleOrDefaultAsync(s => s.Name == QuotationStatusName.Approved);

        //     quotationInDb.QuotationStatusId = quotationStatusInDb.Id;



        //     return Ok(await _context.SaveChangesAsync() > 0 ? quotationStatusDto : null);

        // }

        [HttpPost("DeleteQuotation")]
        public async Task<ActionResult> DeleteQuotation(int id)
        {
            var quotationInDb = await _context.Quotations
                                  .SingleOrDefaultAsync(s => s.Id == id
                                                            && s.IsDeleted == false);

            if (quotationInDb == null) return NotFound();

            quotationInDb.IsDeleted = true;
            return Ok(await _context.SaveChangesAsync() > 0);
        }
        [HttpPost("DeleteQuotationStatus")]
        public async Task<ActionResult> DeleteQuotationStatus(int id)
        {
            var productInDb = await _context.QuotationStatuses
                                  .SingleOrDefaultAsync(s => s.Id == id
                                                            && s.IsDeleted == false);

            if (productInDb == null) return NotFound();

            productInDb.IsDeleted = true;
            return Ok(await _context.SaveChangesAsync() > 0);
        }
    }
}