import { api } from "./api";

export const loadUserData = async () => {
  const response = await api.get("/users/me");

  return response.data;
};

export const changePassword = async (token: string, password: string) => {
  const response = await api.put(
    "/users",
    {
      password: password,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  console.log(response);
  return response;
};
