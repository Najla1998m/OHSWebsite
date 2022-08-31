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
    public class StockProductsController : BaseApiController
    {
        private readonly DataContext _context;
        private readonly IMapper _mapper;
        public StockProductsController(DataContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }
        [HttpGet("GetAllStock")]
        public async Task<ActionResult> GetAllStockProducts()
        {
            var result = await _context.StockProducts
                                    .Where(s => s.IsDeleted == false)
                                    .ToListAsync();

            if (result == null) return NotFound();

            return Ok(result.Select(_mapper.Map<StockProducts, StockProductsDto>));
        }
        [HttpGet("GetStockProductsById/{id}")]

        public async Task<ActionResult> GetStockProductsById(int id)
        {
            var stockInDb = await _context.StockProducts
                                .SingleOrDefaultAsync(s => s.Id == id && s.IsDeleted == false);

            if (stockInDb == null) return NotFound();

            return Ok(_mapper.Map<StockProducts, StockProductsDto>(stockInDb));
        }
        [HttpPost("UpdateStockProducts")]
        public async Task<ActionResult> UpdateStockProducts(int id, StockProductsDto stockDto)
        {
            if (!ModelState.IsValid)
                return BadRequest();

            var stockInDb = await _context.StockProducts
                                    .SingleOrDefaultAsync(s => s.Id == id && s.IsDeleted == false);

            if (stockInDb == null)
                return NotFound();

            _mapper.Map(stockDto, stockInDb);

            return Ok(await _context.SaveChangesAsync() > 0);
        }

        [HttpPost("CreateStockProducts")]
        public async Task<ActionResult> CreateStockProducts(StockProductsDto stockDto)
        {
            if (!ModelState.IsValid)
                return BadRequest();

            var stock = _mapper.Map<StockProductsDto, StockProducts>(stockDto);
            await _context.StockProducts.AddAsync(stock);
            await _context.SaveChangesAsync();

            stockDto.Id = stock.Id;

            return Ok(stockDto);
        }

        [HttpPost("DeleteStockProducts")]
        public async Task<ActionResult> DeleteStockProducts(int id)
        {
            var stockInDb = await _context.StockProducts
                                  .SingleOrDefaultAsync(s => s.Id == id
                                                            && s.IsDeleted == false);

            if (stockInDb == null) return NotFound();

            stockInDb.IsDeleted = true;
            return Ok(await _context.SaveChangesAsync() > 0);
        }
    }
}