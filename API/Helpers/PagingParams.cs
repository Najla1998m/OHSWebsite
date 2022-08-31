namespace API.Helpers
{
    public class PagingParams
    {
        private const int MaxPageSize = 50;
        public int PageNumber { get; set; } = 1;
        private int _pgaeSize = 10;

        public int PageSize
        {
            get => _pgaeSize;
            set => _pgaeSize = (value > MaxPageSize) ? MaxPageSize : value;
        }
    }
}