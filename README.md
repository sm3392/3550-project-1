JWKS Server Project
About This Project
This was my first time setting up a server in Node.js for my cyber security class.
The goal of the project was to create a JWKS (JSON Web Key Set) server that can:
Make an RSA key pair (public and private).
Share the public key at a special endpoint.
Use the private key to sign a JWT (JSON Web Token).
Also show how an expired token works when you try to use it.
I followed the instructions step by step and learned how keys, tokens, and endpoints work together.
What I Used
Node.js (v22 on my computer)
npm (comes with Node)
Packages: express, jsonwebtoken, and jwks-rsa
How To Run It
Go into the project folder:
cd jwks-server
Install everything:
npm install
Start the server:
node server.js


the erver will run at:
http://localhost:8080

Endpoints
1. JWKS Endpoint

Shows the public key (only the ones not expired).

curl http://localhost:8080/.well-known/jwks.json


Example:

{
  "keys": [
    {
      "kty": "RSA",
      "kid": "1758302913564",
      "use": "sig",
      "alg": "RS256",
      "n": "...",
      "e": "AQAB"
    }
  ]
}

2. Auth Endpoint

Makes a JWT signed with the private key.
Normal token:

curl.exe -X POST http://localhost:8080/auth


Expired token:

curl.exe -X POST "http://localhost:8080/auth?expired"

What I Learned
Since this is my first cyber class, I learned a lot from just doing this:
How servers can share public keys so other systems can check tokens.
How JWTs are signed and why expired tokens are important.
How to use PowerShell and GitHub to manage a project.
It was a bit confusing at first (especially with curl in PowerShell), but after trying it step by step, it made more sense.