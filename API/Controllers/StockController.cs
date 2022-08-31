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
    public class StockController : BaseApiController
    {
        private readonly DataContext _context;
        private readonly IMapper _mapper;
        public StockController(DataContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }
        [HttpGet("GetAllStock")]
        public async Task<ActionResult> GetAllStock()
        {
            var result = await _context.Stocks
                                    .Where(s => s.IsDeleted == false)
                                    .ToListAsync();

            if (result == null) return NotFound();

            return Ok(result.Select(_mapper.Map<Stock, StockDto>));
        }
        [HttpGet("GetStockById/{id}")]

        public async Task<ActionResult> GetStockById(int id)
        {
            var stockInDb =   _context.StockProducts
                                .Include(s => s.Product)
                                .ThenInclude(s => s.Category)
                                .Include(s => s.Stock)
                                .Where(s => s.StockId == id)
                                .ToList()
                                .GroupBy(s => s.Stock)
                                .Select(grp => new
                                {
                                    Stock = _mapper.Map<Stock, StockDto>(grp.Key),
                                    Products = grp.ToList().Select(_mapper.Map<StockProducts, StockProductsForStockDto>)
                                });


            if (stockInDb == null) return NotFound();

            return Ok(stockInDb);
        }
        [HttpGet("GetStockByUserId/{id}")]

        public ActionResult GetStockByUserId(string id)
        {
            var stockInDb = _context.StockProducts
                                .Include(s => s.Product)
                                .ThenInclude(s => s.Category)
                                .Include(s => s.Stock)
                                .Where(s => s.Stock.UserId == id)
                                .ToList()
                                .GroupBy(s => s.Stock)
                                .Select(grp => new
                                {
                                    Stock = _mapper.Map<Stock, StockDto>(grp.Key),
                                    Products = grp.ToList().Select(_mapper.Map<StockProducts, StockProductsForStockDto>)
                                });


            if (stockInDb == null) return NotFound();

            return Ok(stockInDb);
        }
        [HttpPost("UpdateStock")]
        public async Task<ActionResult> UpdateStock(int id, StockDto stockDto)
        {
            if (!ModelState.IsValid)
                return BadRequest();

            var stockInDb = await _context.Stocks
                                    .SingleOrDefaultAsync(s => s.Id == id && s.IsDeleted == false);

            if (stockInDb == null)
                return NotFound();

            _mapper.Map(stockDto, stockInDb);

            return Ok(await _context.SaveChangesAsync() > 0);
        }

        [HttpPost("CreateStock")]
        public async Task<ActionResult> CreateStock(StockDto stockDto)
        {
            if (!ModelState.IsValid)
                return BadRequest();

            var stock = _mapper.Map<StockDto, Stock>(stockDto);
            await _context.Stocks.AddAsync(stock);
            await _context.SaveChangesAsync();

            stockDto.Id = stock.Id;

            return Ok(stockDto);
        }

        [HttpPost("DeleteStock")]
        public async Task<ActionResult> DeleteStock(int id)
        {
            var stockInDb = await _context.Stocks
                                  .SingleOrDefaultAsync(s => s.Id == id
                                                            && s.IsDeleted == false);

            if (stockInDb == null) return NotFound();

            stockInDb.IsDeleted = true;
            return Ok(await _context.SaveChangesAsync() > 0);
        }
    }
}