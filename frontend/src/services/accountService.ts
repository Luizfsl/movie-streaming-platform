const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3000";

async function parseResponse<T>(response: Response): Promise<T> {
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message ?? "Erro inesperado");
  }

  return data;
}

export interface UserProfile {
  name: string;
  email: string;
  photo: string | null;
}

export interface UpdateProfileResponse {
  message: string;
  user: any;
}

export async function getProfile(id: string): Promise<UserProfile> {
  const response = await fetch(`${API_URL}/accounts/${id}`);
  return parseResponse<UserProfile>(response);
}

export async function updateProfile(
  id: string,
  data: { name?: string; email?: string; password?: string; photo?: { filename: string; sizeMB: number } }
): Promise<UpdateProfileResponse> {
  const response = await fetch(`${API_URL}/accounts/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  return parseResponse<UpdateProfileResponse>(response);
}

export async function updateEmail(id: string, email: string): Promise<UpdateProfileResponse> {
  const response = await fetch(`${API_URL}/accounts/${id}/email`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email }),
  });
  return parseResponse<UpdateProfileResponse>(response);
}

export async function updateName(id: string, name: string): Promise<UpdateProfileResponse> {
  const response = await fetch(`${API_URL}/accounts/${id}/name`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name }),
  });
  return parseResponse<UpdateProfileResponse>(response);
}

export async function updatePassword(id: string, password: string): Promise<UpdateProfileResponse> {
  const response = await fetch(`${API_URL}/accounts/${id}/password`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ password }),
  });
  return parseResponse<UpdateProfileResponse>(response);
}

export async function updatePhoto(id: string, filename: string, sizeMB: number): Promise<UpdateProfileResponse> {
  const response = await fetch(`${API_URL}/accounts/${id}/photo`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ filename, sizeMB }),
  });
  return parseResponse<UpdateProfileResponse>(response);
}
