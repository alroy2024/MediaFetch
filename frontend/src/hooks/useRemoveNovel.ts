export default function useRemoveNovel() {
  return async (id: number, token: string) => {
    const response = await fetch(`http://localhost:8080/novels/remove/${id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Novel remove request failed: ${response.status}`);
    }
  };
}