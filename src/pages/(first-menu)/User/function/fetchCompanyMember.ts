import axios from "axios";

export const fetchCompanyMember = async (token: string, companyId: string | null) => {
  return await fetchCompanyMemberBackend(token, companyId);
};

const fetchCompanyMemberBackend = async (token: string, companyId: string | null) => {
  try {
    const response = await axios.get(
      `http://127.0.0.1:5000/companies/get-members`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        params: {
          company_id: companyId
        }
      }
    );

    const responseData = response.data;

    console.log(responseData.data);

    if (responseData.success === false) {
      throw new Error(responseData);
    }

    return responseData.data;
  } catch (error: any) {
    console.error("Error Response:", error.response?.data?.errors[0]);
    throw new Error(error.response?.data?.errors[0] || "Company failed");
  }
};
