using System.Linq;
using System.Threading.Tasks;
using API.Data;
using API.DTOs;
using API.Entities;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    public class VendorController : BaseApiController
    {
        private readonly DataContext _context;
        private readonly IMapper _mapper;
        public VendorController(DataContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }
        [HttpGet("GetVendorStock")]
        public async Task<ActionResult> GetVendorStock(string companyVendor)
        {
            var products = await _context.StockProducts
                                    .Include(s => s.Product)
                                    .ThenInclude(s=>s.Category)
                                    .Include(s => s.Stock)
                                    .Where(s => s.Stock.UserId == companyVendor
                                            && s.Stock.User.UserRoles.Any(urm => urm.Role.Name == "Company Vendor"))
                                    .Select(s => new ProductsWithQuantityDto
                                    {
                                        Product = _mapper.Map<Product, ProductDto>(s.Product),
                                        Quantity = s.Quantity
                                    })
                                    .ToListAsync();

            if (products == null || products.Count == 0) return NotFound();

            return Ok(products);
        }
        [HttpGet("GetVendorsForSpecificCategory")]
        public async Task<ActionResult> GetVendorsForSpecificCategory(int categoryId)
        {
            var vendors = await _context.StockProducts
                                    .Include(s => s.Product)
                                    .Include(s => s.Stock)
                                    .ThenInclude(s => s.User)
                                    .ThenInclude(s => s.Company)
                                    .Where(s => s.Product.CategoryId == categoryId
                                            && s.Stock.User.UserRoles.Any(urm => urm.Role.Name == "Company Vendor"))
                                    .Select(s => new CompanyWithProductDto
                                    {
                                        ProductDto = _mapper.Map<Product, ProductDto>(s.Product),
                                        Quantity = s.Quantity,
                                        CompanyDto = _mapper.Map<Company, CompanyDto>(s.Stock.User.Company)
                                    })
                                    .ToListAsync();

            if (vendors == null || vendors.Count == 0) return NotFound();

            return Ok(vendors);
        }
    }
}