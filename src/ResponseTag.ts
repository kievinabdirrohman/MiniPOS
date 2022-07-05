export const ResponseTag = (result: any, error: any, type: string) => {
    if (error && error.status === 401) {
      document.cookie = "secure-access=; Max-Age=0";
      window.location.reload();
      return false;
    }
    return [
      { type: type, id: "LIST" },
      ...result.ids.map((id: any) => ({ type: type, id })),
    ];
}