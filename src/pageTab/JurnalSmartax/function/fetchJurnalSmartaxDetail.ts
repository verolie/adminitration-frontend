import axios from "axios";

export const fetchJurnalSmartaxDetail = async (id: string, token: string) => {
  try {
    const response = await axios.get(
      `http://127.0.0.1:5000/jurnal/detail/${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    const responseData = response.data;

    if (responseData.success === false) {
      throw new Error(responseData.message || "Fetch jurnal smartax detail gagal");
    }

    return responseData.data;
  } catch (error: any) {
    console.error("Error Response:", error.response?.data?.errors?.[0] || error.message);
    throw new Error(error.response?.data?.errors?.[0] || "Fetch jurnal smartax detail gagal");
  }
}; 