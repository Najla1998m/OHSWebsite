using API.DTOs.Polls;
using API.Entities.Polls;
using AutoMapper;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.Helpers.Mapping.Polls
{
    public class PollMaping
    {
    }
    public class PollProfile : Profile
    {
        public PollProfile()
        {
            CreateMap<Poll, PollDto>().ReverseMap();
        }
    }
    public class PollItemProfile : Profile
    {
        public PollItemProfile()
        {
            CreateMap<PollItem, PollItemDto>().ReverseMap();
        }
    }
    public class PollActionProfile : Profile
    {
        public PollActionProfile()
        {
            CreateMap<PollItemAction, PollItemActionDto>().ReverseMap();
        }
    }
    public class PollDetailsProfile : Profile
    {
        public PollDetailsProfile()
        {
            CreateMap<PollDetail, PollDetailDto>().ReverseMap();
        }
    }
    public class PollItemAprovalProfile : Profile
    {
        public PollItemAprovalProfile()
        {
            CreateMap<PollApproval, PollApprovalDto>().ReverseMap();
        }
    }
}
