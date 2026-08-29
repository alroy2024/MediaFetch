import { API_BASE_URL } from '../config';

export async function authenticate(
    username: string,
    password: string,
    email: string,
    login: boolean
) {
    const endpoint = login ? `${API_BASE_URL}/auth/login` : `${API_BASE_URL}/auth/register`
    const params = login ? { username, password } : { username, password, email }

    const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(params)
    })

    const data = await response.json();

    return { response, data };
}
