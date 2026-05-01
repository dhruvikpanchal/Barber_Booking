import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES = process.env.JWT_EXPIRES || '7d'; // you can change

// Generate Token
export const generateToken = ({ id, role }) => {
  return jwt.sign({ id, role }, JWT_SECRET, { expiresIn: JWT_EXPIRES });
};

// Verify Token
export const verifyToken = ({ token }) => {
  return jwt.verify(token, JWT_SECRET);
};
