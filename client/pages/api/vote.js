const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

export default async function handler(req, res) {
    const teamId = req.query.teamId;

    try {
        const data = await fetch(`${baseUrl}/vote/${teamId}`, {
            method: 'POST',  // Use the DELETE HTTP method
            mode: 'cors',
        })

        res.status(200).json(data)
    } catch (error) {
        console.error(error)
        return res.status(error.status || 500).end(error.message)
    }
}