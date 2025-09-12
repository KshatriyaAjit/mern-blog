import { useEffect, useState } from "react";
import api from "@/utils/api";

export const useFetch = (url, options = {}, dependencies = []) => {
  const [data, setData] = useState();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const method = options.method?.toLowerCase() || "get";
        const response = await api.request({
          url,
          method,
          ...options,
        });

        setData(response.data);
        setError(undefined);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, dependencies);

  return { data, loading, error };
};
