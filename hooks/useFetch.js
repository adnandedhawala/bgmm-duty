import { message } from "antd";
import { useState, useEffect } from "react";

const isValidJSON = string_ => {
  try {
    JSON.parse(string_);
    return true;
  } catch {
    return false;
  }
};

export const useFetch = (url, options, initialData, refetch) => {
  const [data, setData] = useState(initialData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (refetch !== null) {
      setLoading(true);
      const queryRequest = fetch(url, options);

      queryRequest
        .then(async statusResp => {
          const queryData = await statusResp.text();
          const resultData = isValidJSON(queryData)
            ? JSON.parse(queryData)
            : queryData;
          if (statusResp.ok) {
            return resultData;
          } else {
            if (statusResp === 401) {
              localStorage.removeItem("user");
              message.info("unauthorized user");
            } else if (statusResp === 403) {
              localStorage.removeItem("user");
              message.info("Session timeout!!");
            }
            throw new Error(queryData);
          }
        })
        .then(response => {
          setData(response);
          setError(false);
        })
        .catch(error => {
          setData(null);
          setError(error.message);
        })
        .finally(() => setLoading(false));
    }
  }, [options, refetch, url]);

  return { data, loading, error };
};
