namespace Backend.Classes
{
    public class User
    {
        public int Id { get; set; }
        public string? Username { get; set; }
        public string? Email { get; set; }
        // Remove plain Password property for security
        public string PasswordHash { get; set; }
    }

    public class UserUpdateDto
    {
        public string? Username { get; set; }
        public string? Email { get; set; }
        public string? PasswordHash { get; set; }
    }

    public class RegisterDto {
    public string Username { get; set; }
    public string Email { get; set; }
    public string Password { get; set; }
}

    
}