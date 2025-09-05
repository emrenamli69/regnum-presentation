# CRM Connection Diagnostic Guide

## Summary of Changes Made

1. **Enhanced Error Logging**: Added detailed logging to `/api/crm/route.ts` including:
   - Full error stack traces
   - Request/response timing
   - Network error detection
   - Environment-specific error details

2. **Retry Logic**: Implemented automatic retry with exponential backoff (3 attempts)

3. **Timeout Protection**: Added 30-second timeout for CRM requests

4. **Health Check Endpoint**: Created `/api/health/crm` for testing connectivity

## How to Diagnose the Issue on Your Deployed Server

### 1. Check Server Logs
After deploying, monitor the server logs when the error occurs:
```bash
# Check the server logs for detailed error messages
# The enhanced logging will show:
# - The exact URL being called
# - The specific error type (network_error vs request_error)
# - Full error stack trace
```

### 2. Use the Health Check Endpoint
Test CRM connectivity directly using the health check:

```bash
# Replace with your actual CRM URL and credentials
curl -X POST https://regnum-presentation.sixtynine.dev/api/health/crm \
  -H "Content-Type: application/json" \
  -d '{
    "url": "YOUR_CRM_WEBHOOK_URL",
    "username": "YOUR_USERNAME",
    "password": "YOUR_PASSWORD"
  }'
```

Or test without authentication first:
```bash
curl "https://regnum-presentation.sixtynine.dev/api/health/crm?url=YOUR_CRM_WEBHOOK_URL"
```

### 3. Common Issues and Solutions

#### Network Restrictions
**Symptom**: `ECONNREFUSED`, `ETIMEDOUT`, or `ENETUNREACH` errors in logs

**Solutions**:
- Check if your server can reach the CRM endpoint:
  ```bash
  # SSH into your server and test connectivity
  curl -I YOUR_CRM_WEBHOOK_URL
  ```
- Verify firewall rules allow outbound HTTPS connections
- Check if CRM webhook requires IP whitelisting

#### SSL/TLS Certificate Issues
**Symptom**: Certificate verification errors in logs

**Solutions**:
- If CRM uses self-signed certificates, you may need to configure Node.js to accept them
- Ensure the server has updated CA certificates

#### DNS Resolution
**Symptom**: `ENOTFOUND` errors

**Solutions**:
- Verify the CRM hostname resolves on your server:
  ```bash
  nslookup YOUR_CRM_HOSTNAME
  ```
- Check for any DNS configuration issues

#### Private Network Access
**Symptom**: Timeout errors despite CRM being accessible locally

**Solutions**:
- If CRM is on a private network, ensure your deployed server has VPN/VPC access
- Consider using a reverse proxy or API gateway

### 4. Environment Variable Check
Verify environment variables are correctly set on the server:
```bash
# Check if the environment variables are properly loaded
echo $YOUR_ENV_VAR_NAME
```

### 5. Next Steps Based on Error Type

The enhanced error logging will show you the specific error type:

- **`network_error`**: Focus on connectivity, firewall, and network configuration
- **`request_error`**: Check authentication, URL format, and CRM endpoint status
- **503 status**: Indicates network-level issues
- **500 status**: Could be CRM endpoint issues or request format problems

## Testing Locally vs Production

To replicate production environment locally:
```bash
# Test with production CRM URL from local
NODE_ENV=production npm run dev

# Or build and run production build locally
npm run build
npm start
```

## Additional Debugging

If issues persist, the detailed logs will now show:
1. Exact timestamp of request
2. Full URL being called (without sensitive query params)
3. Response status and timing
4. Retry attempts
5. Complete error stack trace

This information will help identify whether the issue is:
- Network connectivity
- Authentication
- SSL/TLS
- DNS resolution
- Firewall/security group rules
- CRM endpoint availability