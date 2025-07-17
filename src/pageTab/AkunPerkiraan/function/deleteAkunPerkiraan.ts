import axios from "axios";
import { AkunPerkiraan } from "../model/AkunPerkiraanModel";
import { API_BASE_URL } from "@/utils/config";
export const deleteAkunPerkiraan = async (
  data: AkunPerkiraan, 
  token: string,
  showAlert: (message: string, type: "success" | "error" | "info") => void
) => {
  return await deleteAkunPerkiraanBackend(data, token, showAlert);
};

const deleteAkunPerkiraanBackend = async (
  data: AkunPerkiraan, 
  token: string,
  showAlert: (message: string, type: "success" | "error" | "info") => void
) => {
  try {
    const requestData = {
      id: data.id,
    };

    const response = await axios.post(
      `${API_BASE_URL}/akun-perkiraan/${data.kode_akun}/${data.companyId}/delete-one`,
      requestData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      }
    );

    const responseData = response.data;

    console.log(responseData.data);

    if (responseData.success === false) {
      showAlert(responseData.message, "error");
      return false;
    }

    return responseData.message;
  } catch (error: any) {
    const errorMessage = error.response?.data?.errors?.[0] || "Company failed";
    showAlert(errorMessage, "error");
    throw new Error(errorMessage);
  }
};
