// JSON web token can be used across multiple domains.
// JWTs can be signed using a secret (only key only)
// or public/private keys. Used mainly for authorization with REST APIs.
// Made out of three parts: Header, Payload, Signature, separated by dots.

const jwt = require('jsonwebtoken'),
	mySecret = 'some-secret-key';

// Encode the token
const secret = mySecret; // Secret
const payload = { message: 'Hi' }; // Payload
const options = { expiresIn: '2d' }; // Options will become part of the payload.
const token = jwt.sign(payload, secret, options);

// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.
// eyJfaWQiOiIwMDAwMDA4IiwidXNlcm5hbWUiOiJQZXRlciIsImlhdCI6MTYyMzI2Nzc1MSwiZXhwIjoxNjIzNDQwNTUxfQ.
// PO6ujwp_cWZYJ22N4U51kBCaYVzU1i2tUUOBnDQiQ_g

// Decode the token
console.log(jwt.decode(token)); // No verification
console.log(jwt.verify(token, mySecret)); // Exception is thrown if not verified => JsonWebTokenError: invalid signature
