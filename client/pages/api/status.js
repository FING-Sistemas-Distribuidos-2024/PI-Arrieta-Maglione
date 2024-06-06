import { baseUrl } from "@/constants"

export default async function handler(req, res) {
    try {
        const response = await fetch(`${baseUrl}/votes`, {
            method: 'GET',  // Use the DELETE HTTP method
            mode: 'cors',
        })

        if (!response.ok) {
            throw new Error(`Failed to fetch data: ${response.status}`);
        }

        const data = await response.json();
        res.status(200).json(data);
    } catch (error) {
        console.error(error)
        return res.status(error.status || 500).end(error.message)
    }
}