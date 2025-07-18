export interface JwtPayload {
  sub: string;       // User ID or Client ID (subject)
  username?: string; // For user tokens
  roles?: string[];  // For user tokens
  client_id?: string; // For machine tokens
  scope?: string;    // For machine tokens
  // Add any other claims you expect, e.g., 'iat', 'exp', 'aud', 'iss'
}