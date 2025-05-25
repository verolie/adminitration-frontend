import axios from "axios";

export const deleteJurnalSmartax = async (companyId: string, id: string, token: string) => {
  const response = await axios.post(
    `http://127.0.0.1:5000/jurnal/${companyId}/delete-one`,
    { id },
    {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    }
  );
  return response.data;
}; 