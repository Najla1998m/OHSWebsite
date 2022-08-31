using System.Linq;
using System.Threading.Tasks;
using API.Data;
using API.DTOs;
using API.Entities;
using API.Helpers;
using API.Interfaces;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    public class ProductController : BaseApiController
    {
        private readonly DataContext _context;
        private readonly IMapper _mapper;
        private readonly IImageConversion _imageConversion;
        public ProductController(DataContext context, IMapper mapper, IImageConversion imageConversion)
        {
            _context = context;
            _mapper = mapper;
            _imageConversion = imageConversion;
        }
        [HttpGet("GetAllProduct")]
        public async Task<ActionResult> GetAllProduct()
        {
            var products = await _context.Products
                                    .Where(s => s.IsDeleted == false)
                                    .ToListAsync();

            if (products == null) return NotFound();

            var result = products
                            .Select(_mapper.Map<Product, ProductDto>)
                            .ToList();

            result.ForEach(s =>
                    {
                        s.Image = s.Image != null
                                    ? _imageConversion.GetImagePath(ImagesPath.Products, s.Image)
                                    : null;
                    });


            return Ok(result);

        }
        [HttpGet("GetProductById/{id}")]

        public async Task<ActionResult> GetProductById(int id)
        {
            var productInDb = await _context.Products
                                .SingleOrDefaultAsync(s => s.Id == id && s.IsDeleted == false);


            if (productInDb == null) return NotFound();

            var productDto = _mapper.Map<Product, ProductDto>(productInDb);

            productDto.Image = productDto.Image != null
                                    ? _imageConversion.GetImagePath(ImagesPath.Products, productDto.Image)
                                    : null;
            return Ok(productDto);
        }
        [HttpPost("UpdateProduct")]
        public async Task<ActionResult> UpdateProduct(int id, ProductDto productDto)
        {
            if (!ModelState.IsValid)
                return BadRequest();

            var productInDb = await _context.Products
                                    .SingleOrDefaultAsync(s => s.Id == id && s.IsDeleted == false);

            if (productInDb == null)
                return NotFound();




            productDto.Image = _imageConversion.SaveImageToPath(productDto.Image, ImagesPath.Products, productDto.ImageName);
            productDto.Id = id;

            var sliderImage = _mapper.Map(productDto, productInDb);

            var result = await _context.SaveChangesAsync() > 0 ? productDto : null;

            result.Image = _imageConversion.GetImagePath(ImagesPath.Products, productDto.Image);

            return Ok(result);

        }

        [HttpPost("CreateProduct")]
        public async Task<ActionResult> CreateProduct(CreateProductDto productDto)
        {
            if (!ModelState.IsValid)
                return BadRequest();


            productDto.Image = _imageConversion.SaveImageToPath(productDto.Image, ImagesPath.Products, productDto.ImageName);

            var product = _mapper.Map<CreateProductDto, Product>(productDto);

            await _context.Products.AddAsync(product);
            await _context.SaveChangesAsync();

            // productDto.Id = product.Id;
            productDto.Image = _imageConversion.GetImagePath(ImagesPath.Products, productDto.Image);

            return Ok(productDto);

        }

        [HttpPost("DeleteProduct")]
        public async Task<ActionResult> DeleteProduct(int id)
        {
            var productInDb = await _context.Products
                                  .SingleOrDefaultAsync(s => s.Id == id
                                                            && s.IsDeleted == false);

            if (productInDb == null) return NotFound();

            productInDb.IsDeleted = true;
            return Ok(await _context.SaveChangesAsync() > 0);
        }
    }
}