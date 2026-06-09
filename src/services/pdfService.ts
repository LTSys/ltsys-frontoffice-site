import { api } from "./api";

// export const getPdfContent = async (fileName: string): Promise<string> => {
//  const response = await api.get<{ content: string }>(`/pdf/${encodeURIComponent(fileName)}`);
//   return response.data.content; // base64
// };

export const getSignedURL = async (filename: String, token: String) => {
  const response = await api.get<{ url: string }>(
    `/pdf/presigned-url/download?filename=${filename}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/pdf",
      },
    },
  );
  return response.data.url;
};
