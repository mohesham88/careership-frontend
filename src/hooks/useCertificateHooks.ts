import {
  useMutation,
  useQuery,
  type UseMutationResult,
  type UseQueryResult,
} from "@tanstack/react-query";
import api from "../services/api";
import { useNavigate } from "react-router-dom";

type RequestCertificateResponse = {
  detail?: string;
  certificate_id?: string;
};

const checkCertificateAvailability = async (
  projectId: number
): Promise<boolean> => {
  const response = await api.get(
    `/projects/${projectId}/certificates/available/`
  );
  return response.data.available;
};

const requestCertificate = async (
  projectId: number
): Promise<RequestCertificateResponse> => {
  const { data } = await api.post<RequestCertificateResponse>(
    `/projects/${projectId}/certificates/request/`
  );
  if (!data.certificate_id) {
    throw new Error("Failed to request certificate");
  }
  return data;
};

type Certificate = {
  id: number;
  no: string;
  project_id: number;
  user_id: number;
  created_at: Date;
};

const getCertificate = async (certificate_no: string): Promise<Certificate> => {
  const { data } = await api.get<Certificate>(
    `/certificates/${certificate_no}/`
  );
  return data;
};

const downloadCertificate = async (certificate_no: string): Promise<Blob> => {
  console.log("downloading certificate", certificate_no);
  const { data } = await api.post(
    `/certificates/${certificate_no}/download/`,
    {},
    {
      responseType: "blob",
    }
  );
  return data;
};

export const useGetCertificate = (
  certificate_no: string
): UseQueryResult<Certificate, Error> => {
  return useQuery({
    queryKey: ["certificate", certificate_no],
    queryFn: () => getCertificate(certificate_no),
    enabled: !!certificate_no,
  });
};

export const usePreviewCertificate = (): UseMutationResult<
  Blob,
  Error,
  string
> => {
  return useMutation({
    mutationFn: (certificate_no: string) => downloadCertificate(certificate_no),
  });
};

export const useDownloadCertificate = (
  certificate_no: string
): UseMutationResult<Blob, Error, void> => {
  return useMutation({
    mutationFn: () => downloadCertificate(certificate_no),
    onSuccess: (blob) => {
      // Create download link and trigger download
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `certificate-${certificate_no}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      console.log("Certificate downloaded successfully");
    },
    onError: (error) => {
      console.error("Failed to download certificate:", error);
    },
  });
};

export const useCertificateAvailability = (
  projectId: number
): UseQueryResult<boolean, Error> => {
  return useQuery({
    queryKey: ["certificate", "available", projectId],
    queryFn: () => checkCertificateAvailability(projectId),
    enabled: !!projectId,
  });
};

export const useRequestCertificate = (): UseMutationResult<
  RequestCertificateResponse,
  Error,
  number
> => {
  const navigate = useNavigate();
  return useMutation({
    mutationFn: (projectId: number) => requestCertificate(projectId),
    onSuccess: ({ certificate_id, detail }) => {
      console.log("Certificate requested successfully:", certificate_id);
      console.log(
        "redirecting to:",
        `/certificates/${certificate_id}`,
        " in 5 seconds"
      );
      setTimeout(() => {
        navigate(`/certificates/${certificate_id}`);
      }, 5000); // 5 second delay
    },
    onError: (error) => {
      console.error("Failed to request certificate:", error);
    },
  });
};
