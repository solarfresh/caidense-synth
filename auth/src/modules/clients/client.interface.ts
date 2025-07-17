export interface Client {
  clientId: string;
  clientSecret: string; // ⚠️ In production, hash this!
  name: string;
  allowedGrantTypes: string[]; // e.g., ['client_credentials', 'authorization_code']
  // Add other OAuth 2.0 related fields like redirect URIs, scopes, etc.
}