using System.Linq;
using System.Threading.Tasks;
using API.Data;
using API.DTOs;
using API.Entities;
using API.Helpers;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    public class OrdersControllers : BaseApiController
    {
        private readonly DataContext _context;
        private readonly IMapper _mapper;
        public OrdersControllers(DataContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }
        [HttpGet("GetAllOrders")]
        public async Task<ActionResult> GetAllOrders()
        {
            var orders = await _context.Orders
                                    .Where(s => s.IsDeleted == false)
                                    .ToListAsync();

            if (orders == null) return NotFound();

            return Ok(orders.Select(_mapper.Map<Order, OrderDto>));
        }
        [HttpGet("GetOrderById/{id}")]
        public async Task<ActionResult> GetOrderById(int id)
        {
            var orderInDb = await _context.Orders
                               .SingleOrDefaultAsync(s => s.Id == id && s.IsDeleted == false);

            if (orderInDb == null) return NotFound();

            return Ok(_mapper.Map<Order, OrderDto>(orderInDb));
        }
        [HttpGet("GetOrdersForCompany")]

        public async Task<ActionResult> GetOrdersForCompany(int companyId)
        {


            var orders = await _context.Orders
                                .Include(s => s.Owner)
                                .ThenInclude(s => s.Company)
                                .Where(s => s.Owner.CompanyId == companyId && s.IsDeleted == false)
                                .ToListAsync();

            if (orders == null) return NotFound();

            return Ok(orders.Select(_mapper.Map<Order, OrderDto>));
        }
        [HttpGet("GetOrdersByVendorId")]
        public async Task<ActionResult> GetOrdersByVendorId(string vendorId)
        {
            var orders = await _context.Orders
                                    .Where(s => s.IsDeleted == false && s.VendorId == vendorId)
                                    .ToListAsync();

            if (orders == null) return NotFound();

            return Ok(orders.Select(_mapper.Map<Order, OrderDto>));
        }
        [HttpGet("OrdersInManagment")]
        public async Task<ActionResult> OrdersInManagment(int ManagmentId)
        {
            var employess = await _context.UserDepartments.Where(x => x.DepartementId == ManagmentId).Distinct().Select(x => x.UserId).ToListAsync();
            var orders = await _context.Orders.Where(x => employess.Contains(x.OwnerId)).Include(x => x.AssignedUser).Include(x => x.Owner).ToListAsync();

            if (orders.Count == 0) return NoContent();

            return Ok(orders.Select(_mapper.Map<Order, OrderDto>));
        }
        [HttpGet("GetOrdersByOwnerId")]
        public async Task<ActionResult> GetOrdersByOwnerId(string ownerId)
        {
            var orders = await _context.Orders
                                    .Where(s => s.IsDeleted == false && s.OwnerId == ownerId)
                                    .ToListAsync();

            if (orders == null) return NotFound();

            return Ok(orders.Select(_mapper.Map<Order, OrderDto>));
        }
        [HttpGet("GetOrdersByAssignedTo")]
        public async Task<ActionResult> GetOrdersByAssignedTo(string assignedTo)
        {
            var orders = await _context.Orders
                                    .Where(s => s.IsDeleted == false && s.AssignedUserId == assignedTo)
                                    .ToListAsync();

            if (orders == null) return NotFound();

            return Ok(orders.Select(_mapper.Map<Order, OrderDto>));
        }
        [HttpPost("UpdateOrder")]
        public async Task<ActionResult> UpdateOrder(OrderDto orderDto)
        {
            if (!ModelState.IsValid)
                return BadRequest();

            var orderInDb = await _context.Orders
                                    .SingleOrDefaultAsync(s => s.Id == orderDto.Id && s.IsDeleted == false);

            if (orderInDb == null)
                return NotFound();

            _mapper.Map(orderDto, orderInDb);

            return Ok(await _context.SaveChangesAsync() > 0);
        }

        [HttpPost("CreateOrder")]
        public async Task<ActionResult> CreateOrder(OrderDto orderDto)
        {
            if (!ModelState.IsValid)
                return BadRequest();

            var order = _mapper.Map<OrderDto, Order>(orderDto);
            order.Date = CustomDateTimeConverter.Timezone();
            await _context.Orders.AddAsync(order);
            await _context.SaveChangesAsync();

            orderDto.Id = order.Id;

            return Ok(orderDto);
        }

        [HttpPost("DeleteOrder")]
        public async Task<ActionResult> DeleteOrder(int id)
        {
            var orderInDb = await _context.Orders
                                  .SingleOrDefaultAsync(s => s.Id == id
                                                            && s.IsDeleted == false);

            if (orderInDb == null) return NotFound();

            orderInDb.IsDeleted = true;
            return Ok(await _context.SaveChangesAsync() > 0);
        }
    }
}