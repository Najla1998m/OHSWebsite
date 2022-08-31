using System;
using System.IO;
using System.Linq;
using System.Text.RegularExpressions;
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
    //
    public class ClientsController : BaseApiController
    {
        private readonly DataContext _context;
        private readonly IMapper _mapper;
        private readonly IWebHostEnvironment _appEnvironment;
        private readonly IImageConversion _imageConversion;
        public ClientsController(DataContext context,
                                IMapper mapper,
                                IWebHostEnvironment hostingEnvironment,
                                IImageConversion imageConversion)
        {
            _context = context;
            _mapper = mapper;
            _appEnvironment = hostingEnvironment;
            _imageConversion = imageConversion;
        }
        [HttpGet("GetAllClient")]
        public async Task<ActionResult> GetAllClient()
        {
            var clients = await _context.Clients
                                    .Where(s => s.IsDeleted == false
                                                && s.IsVisible == true)
                                    .OrderBy(s => s.Order)
                                    .ToListAsync();

            if (clients == null) return NotFound();

            var result = clients
                            .Select(_mapper.Map<Client, ClientDto>)
                            .ToList();

            result.ForEach(s =>
                    {
                        s.Image = s.Image != null
                                    ? _imageConversion.GetImagePath(ImagesPath.Clients, s.Image)
                                    : null;
                    });


            return Ok(result);
        }
        [HttpGet("GetClientById/{id}")]

        public async Task<ActionResult> GetClientById(int id)
        {
            var clientInDb = await _context.Clients
                                .SingleOrDefaultAsync(s => s.Id == id
                                                        && s.IsDeleted == false
                                                        && s.IsVisible == true);

            if (clientInDb == null) return NotFound();

            var clientDto = _mapper.Map<Client, ClientDto>(clientInDb);

            clientDto.Image = clientDto.Image != null
                                    ? _imageConversion.GetImagePath(ImagesPath.Clients, clientDto.Image)
                                    : null;
            return Ok(clientDto);
        }
        [HttpPost("UpdateClient")]
        public async Task<ActionResult> UpdateClient(int id, ClientDto clientDto)
        {
            if (!ModelState.IsValid)
                return BadRequest();

            var clientInDb = await _context.Clients
                                    .SingleOrDefaultAsync(s => s.Id == id
                                                            && s.IsDeleted == false);

            if (clientInDb == null)
                return NotFound();

            var clientInDbByOrder = await _context.Clients
                                     .SingleOrDefaultAsync(s => s.Order == clientDto.Order
                                                             && s.Order != clientInDb.Order
                                                             && s.IsDeleted == false);

            if (clientInDbByOrder != null)
                return BadRequest("Enter another order");

            clientDto.Image = _imageConversion.SaveImageToPath(clientDto.Image, ImagesPath.Clients, clientDto.ImageName);
            clientDto.Id = id;

            var client = _mapper.Map(clientDto, clientInDb);

            var result = await _context.SaveChangesAsync() > 0 ? clientDto : null;

            result.Image = _imageConversion.GetImagePath(ImagesPath.Clients, clientDto.Image);

            return Ok(result);
        }
        [HttpPost("CreateClient")]
        public async Task<ActionResult> CreateClient(ClientDto clientDto)
        {
            if (!ModelState.IsValid)
                return BadRequest();

            var clientInDb = await _context.Clients
                                     .SingleOrDefaultAsync(s => s.Order == clientDto.Order
                                                             && s.IsDeleted == false);

            if (clientInDb != null)
                return BadRequest("Enter another order");

            clientDto.Image = _imageConversion.SaveImageToPath(clientDto.Image, ImagesPath.Clients, clientDto.ImageName);

            var client = _mapper.Map<ClientDto, Client>(clientDto);

            await _context.Clients.AddAsync(client);
            await _context.SaveChangesAsync();

            clientDto.Image = _imageConversion.GetImagePath(ImagesPath.Clients, clientDto.Image);
            clientDto.Id = client.Id;

            return Ok(clientDto);
        }
        [HttpPost("DeleteClient")]
        public async Task<ActionResult> DeleteClient(int id)
        {
            var clientInDb = await _context.Clients
                                  .SingleOrDefaultAsync(s => s.Id == id
                                                        && s.IsDeleted == false);

            if (clientInDb == null) return NotFound();

            clientInDb.IsDeleted = true;
            return Ok(await _context.SaveChangesAsync() > 0);
        }
    }
}