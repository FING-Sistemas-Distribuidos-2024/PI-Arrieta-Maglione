export default async function handler(req, res) {
    res.status(200).json({ wsUrl: process.env.WS_URL });
}