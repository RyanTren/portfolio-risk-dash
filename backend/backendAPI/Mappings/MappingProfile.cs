using AutoMapper;
using backend.backendAPI.DTO.Responses;
using backend.backendAPI.Models;

namespace backend.backendAPI.Mappings
{
    /// <summary>
    /// AutoMapper profile that defines mappings between domain entities and DTOs.
    /// </summary>
    public class MappingProfile : Profile
    {
        /// <summary>
        /// Initializes mappings for entity-to-DTO and DTO-to-entity conversions.
        /// </summary>
        public MappingProfile()
        {
            // Entity → Response DTO
            CreateMap<Portfolio, PortfolioResponse>()
                .ForMember(dest => dest.PositionCount,
                           opt => opt.MapFrom(src => src.Positions.Count));

            CreateMap<Position, PositionResponse>();

            CreateMap<RiskResult, RiskResult>();
        }
    }
}
