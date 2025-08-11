import axios from "axios";

interface DataProps {
  name: string;
  lastname: string;
  email: string;
  tel: string;
  password: string;
}

interface PostResult<T> {
  loading: boolean;
  data: T | null;
  message: string | null;  // message es string o null
  error: string | null;
}

const postData = async <T extends { message?: string }>(
  url: string,
  data: DataProps
): Promise<PostResult<T>> => {
  let loading = true;
  try {
    const response = await axios.post<T>(url, data, {
      headers: { "Content-Type": "application/json" },
    });
    loading = false;
    return {
      loading,
      data: response.data,
      message: response.data.message || null,
      error: null,
    };
  } catch (error) {
    loading = false;
    if (axios.isAxiosError(error)) {
      return {
        loading,
        data: null,
        message: null,
        error: error.response?.data?.message || error.message,
      };
    }
    return { loading, data: null, message: null, error: "Error inesperado" };
  }
};

export default postData;
