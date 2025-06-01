# TaleForge Backend

## Environment Variables

The application uses environment variables for sensitive configuration. Create a `.env` file in the root directory with the following variables:

```env
# Database Configuration
DB_URL=jdbc:h2:file:./taleforge;MODE=PostgreSQL;DATABASE_TO_LOWER=TRUE;CASE_INSENSITIVE_IDENTIFIERS=TRUE;DB_CLOSE_DELAY=-1;DB_CLOSE_ON_EXIT=FALSE
DB_USERNAME=sa
DB_PASSWORD=your-db-password

# JWT Configuration
JWT_SECRET=your-256-bit-secret
JWT_EXPIRATION=86400000

# Email Configuration
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=your-email@gmail.com
MAIL_PASSWORD=your-app-password

# Redis Configuration
REDIS_HOST=localhost
REDIS_PORT=6379

# Server Configuration
SERVER_PORT=8080
SERVER_CONTEXT_PATH=/api

# Security Configuration
ADMIN_USERNAME=admin
ADMIN_PASSWORD=your-admin-password
```

### Important Notes:

1. Never commit the `.env` file to version control
2. Keep your JWT secret secure and unique
3. Use strong passwords for all services
4. For production, use a proper database instead of H2
5. Configure email settings with valid credentials
6. Update Redis configuration if using a remote instance

### Default Values

If environment variables are not set, the application will use default values defined in `application.properties` and `application.yml`. However, it's recommended to set all environment variables in production.

### Security Best Practices

1. Use different credentials for development and production
2. Regularly rotate secrets and passwords
3. Use environment-specific configuration
4. Keep sensitive data out of version control
5. Use secure connection strings and credentials
