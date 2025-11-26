export const isAuthenticated = () => {
  const stored = localStorage.getItem("user");
  return !!stored;
};
