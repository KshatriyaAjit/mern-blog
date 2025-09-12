export const patchData = async (endpoint, body = null, confirmMessage) => {
  if (confirmMessage && !window.confirm(confirmMessage)) return false;
  try {
    const res = await fetch(endpoint, {
      method: "PATCH",
      credentials: "include",
      headers: body ? { "Content-Type": "application/json" } : undefined,
      body: body ? JSON.stringify(body) : undefined,
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || res.statusText);
    return data; // return server payload
  } catch (err) {
    console.error(err);
    return false;
  }
};
