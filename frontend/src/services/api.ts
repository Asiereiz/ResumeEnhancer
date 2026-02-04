const API_URL = "http://127.0.0.1:8000";

export const enhanceResume = async (text: string) => {
    const token = localStorage.getItem("token");
    const res = await fetch(`${API_URL}/enhance`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ text }),
    });

    if (!res.ok) throw new Error("Failed to process resume");
    return await res.json();
};

export const getHistory = async () => {
    const token = localStorage.getItem("token");
    const res = await fetch(`${API_URL}/history`, {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${token}`
        }
    });
    if (!res.ok) throw new Error("Failed to fetch history");
    return await res.json();
};
