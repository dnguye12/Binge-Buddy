import axios from "axios";

export async function syncUser() {
  try {
    const request = await axios.post("/api/sync-user");
    return request.data;
  } catch (error) {
    console.log(error);
    return null;
  }
}
