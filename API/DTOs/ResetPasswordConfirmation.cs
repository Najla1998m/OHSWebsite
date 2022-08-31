namespace API.DTOs
{
    public class ResetPasswordConfirmation
    {
        public string Email { get; set; }
        public string Code { get; set; }
        // public string Token { get; set; }
    }
}