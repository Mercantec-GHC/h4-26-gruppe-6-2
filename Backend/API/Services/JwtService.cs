using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Backend.Classes;

namespace API.Services
{
    /// <summary>
    /// Service til håndtering af JWT tokens - generering, validering og decoding
    /// </summary>
    public class JwtService
    {
        private readonly IConfiguration _configuration;
        private readonly string _secretKey;
        private readonly string _issuer;
        private readonly string _audience;
        private readonly int _expiryMinutes;

        public JwtService(IConfiguration configuration)
        {
            _configuration = configuration;
	          _secretKey = _configuration["Jwt:SecretKey"] 
	          ?? Environment.GetEnvironmentVariable("JWT_SECRET_KEY");

            _issuer = _configuration["Jwt:Issuer"] 
            ?? Environment.GetEnvironmentVariable("JWT_ISSUER");
            
            _audience = _configuration["Jwt:Audience"] 
            ?? Environment.GetEnvironmentVariable("JWT_AUDIENCE");
            
            _expiryMinutes = int.Parse(_configuration["Jwt:ExpiryMinutes"] 
            ?? Environment.GetEnvironmentVariable("JWT_EXPIRY_MINUTES"));
        }

        /// <summary>
        /// Genererer en JWT token for en bruger
        /// </summary>
        /// <param name="user">Brugeren der skal have en token</param>
        /// <returns>JWT token som string</returns>
        public string GenerateToken(User user)
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes(_secretKey);

            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new Claim(ClaimTypes.Email, user.Email),
                new Claim(ClaimTypes.Name, user.Username),
                new Claim("userId", user.Id.ToString()),
                new Claim("username", user.Username),
                new Claim("email", user.Email)
            };

           

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(claims),
                Expires = DateTime.UtcNow.AddMinutes(_expiryMinutes),
                Issuer = _issuer,
                Audience = _audience,
                SigningCredentials = new SigningCredentials(
                    new SymmetricSecurityKey(key), 
                    SecurityAlgorithms.HmacSha256Signature)
            };

            var token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);
        }     
    }
}