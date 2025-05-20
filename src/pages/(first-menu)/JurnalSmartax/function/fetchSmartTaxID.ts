import axios from "axios";

export const fetchSmartTaxID = async (companyId: string, id: string, token: string) => {
  const response = await axios.get(
    `http://127.0.0.1:5000/jurnal/${companyId}/${id}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data.data;
};