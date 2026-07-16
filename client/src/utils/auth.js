// Save token
export const saveToken = (token) => {
  localStorage.setItem("token", token);
};

// Get token
export const getToken = () => {
  return localStorage.getItem("token");
};

// Save logged in user
export const saveUser = (user) => {
  localStorage.setItem("user", JSON.stringify(user));
};

// Get logged in user
export const getUser = () => {
  return JSON.parse(localStorage.getItem("user"));
};

// Logout
export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
};