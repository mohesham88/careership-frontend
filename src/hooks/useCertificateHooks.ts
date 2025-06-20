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
