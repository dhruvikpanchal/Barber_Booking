export const PASSWORD_STRENGTH = [
  {
    label: "Weak",
    color: "bg-red-500",
  },
  {
    label: "Fair",
    color: "bg-yellow-500",
  },
  {
    label: "Good",
    color: "bg-blue-500",
  },
  {
    label: "Strong",
    color: "bg-green-500",
  },
];

export const getPasswordStrength = (password = "") => {
  if (password.length === 0) return -1;
  if (password.length < 5) return 0;
  if (password.length < 8) return 1;
  if (password.length < 12) return 2;
  return 3;
};

export const getPasswordChecks = (password = "") => ({
  length: password.length >= 8,
  uppercase: /[A-Z]/.test(password),
  lowercase: /[a-z]/.test(password),
  number: /[0-9]/.test(password),
  special: /[^A-Za-z0-9]/.test(password),
});
