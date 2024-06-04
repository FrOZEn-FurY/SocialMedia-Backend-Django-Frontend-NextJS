'use server'
import axios from 'axios';
import { cookies } from 'next/headers';

const api = axios.create({
    baseURL: 'http://localhost:8000',
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    }
})

export async function getCSRFToken() {
    return cookies().get("csrftoken")?.value;
}

export async function getPostByID(id: string) {
    const cookie = cookies();
    const response = await fetch(
      "http://localhost:8000/posts/?id=" + id,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": cookie.get("csrftoken"),
          Cookie: `sessionid=${cookie.get("sessionid")?.value}`,
        } as any,
        credentials: "include",
        cache: 'no-store',
      }
    );
    const data = await response.json();
    return data;
}

export default api;

