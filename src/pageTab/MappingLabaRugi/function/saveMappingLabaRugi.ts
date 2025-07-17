import { API_BASE_URL } from "@/utils/config";

interface MappingLabaRugiData {
  akunPerkiraan1: string;
  // operator: string;
  akunPerkiraan2: (string | number)[];
}

export const saveMappingLabaRugi = async (
  data: MappingLabaRugiData,
  token: string,
  companyId: string
): Promise<any> => {
  try {
    const response = await fetch(`${API_BASE_URL}/laporan-laba-rugi/${companyId}/mapping`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        ...data,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error saving mapping laba rugi:', error);
    throw error;
  }
}; 