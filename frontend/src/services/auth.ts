export async function authenticate(
    username: string,
    password: string,
    email: string,
    login: boolean
) {
    const endpoint = login ? 'http://localhost:8080/auth/login' : 'http://localhost:8080/auth/register'
    const params = login ? { username, password } : { username, password, email }

    console.log('Welcome ', username)

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