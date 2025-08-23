import { axiosInstance } from "./axios";

export async function signup(signupData) {
  const response = await axiosInstance.post("/auth/signup", signupData);
  return response.data;
}

export async function login(loginData) {
  const response = await axiosInstance.post("/auth/login", loginData);
  return response.data;
}

export async function logout() {
  const response = await axiosInstance.post("/auth/logout");
  return response.data;
}

export const getAuthUser =  async () => {

  try {

    const res = await axiosInstance.get("/auth/me");
  return res.data;
    
  } catch (error) {

    return null
    
  }
  
}

export const completeOnboarding = async (userData) => {
  const response = await axiosInstance.post("/auth/onboarding" , userData);
  return response.data
} 

export const getUserFriends = async() => {
const res = await axiosInstance.get("/users/friends");
return res.data;
}

export const getRecommendedUsere = async() => {
const res = await axiosInstance.get("/users");
// console.log(res.data.recommendedUsere);
return res.data.recommendedUsere
// return res.data;
}

export const getOutgoingFriendReq = async() => {
const res = await axiosInstance.get("/users/outgoingFriendRequests");
return res.data;
}

export const sendFriendRequest = async(userId) => {
const res = await axiosInstance.post(`/users/friendRequest/${userId}`);
return res.data;
}

export const getFriendRequests = async() => {
const res = await axiosInstance.get(`/users/friendRequests`);
return res.data;
}

export const acceptFriendRequest = async(requestId) => {
const res = await axiosInstance.put(`/users/friendRequest/${requestId}/accept`);
return res.data;
}

export async function getStreamToken() {
  const response = await axiosInstance.get("/chat/token");
  return response.data ;
}

