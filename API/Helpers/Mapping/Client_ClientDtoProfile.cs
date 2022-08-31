using API.DTOs;
using API.Entities;
using AutoMapper;

namespace API.Helpers.Mapping
{
    public class Client_ClientDtoProfile : Profile
    {
        public Client_ClientDtoProfile()
        {
            CreateMap<Client, ClientDto>()
               .ReverseMap()
               .ForMember(m => m.Id, opt => opt.Ignore());

        }
    }
}