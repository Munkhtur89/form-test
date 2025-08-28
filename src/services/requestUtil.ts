interface ApiResponse {
  result: boolean;
  data?: unknown;
  message?: string;
  doLogout?: boolean;
}

function processResponse(promise: Promise<Response>): Promise<ApiResponse> {
  console.log(promise);
  return promise
    .then((response: Response): Promise<ApiResponse> => {
      switch (response.status) {
        case 200:
          return response.text().then((text: string): ApiResponse => {
            try {
              return { result: true, data: JSON.parse(text) };
            } catch {
              return { result: true, data: text };
            }
          });
        case 401:
          return response.text().then(
            (text: string): ApiResponse => ({
              result: false,
              message: text,
              doLogout: true,
            })
          );
        default:
          return response
            .text()
            .then(
              (body: string): ApiResponse => ({ result: false, message: body })
            );
      }
    })
    .catch((e: Error): ApiResponse => ({ result: false, message: e.message }));
}

function buildFetch(
  url: string,
  method: string,
  headers: Headers,
  body: string | null
) {
  const requestOptions = Object.assign(
    {},
    { headers },
    {
      method,
      body,
    }
  );
  return fetch(url, requestOptions);
}

export async function apiRequest(url: string, method: string, body: unknown) {
  const headers = new Headers({
    "Content-Type": "application/json",
  });

  return processResponse(
    buildFetch(url, method, headers, body ? JSON.stringify(body) : null)
  );
}

export async function apiRequestWithToken(
  url: string,
  method: string,
  token: string,
  body: unknown
) {
  const headers = new Headers({
    "X-Openerp-Token": token,
  });

  return processResponse(
    buildFetch(url, method, headers, body ? JSON.stringify(body) : null)
  );
}
