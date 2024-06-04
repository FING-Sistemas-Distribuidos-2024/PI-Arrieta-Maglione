import client  from "@/redisHelper";

export default async function handler(req, res) {
  const { method, body } = req;
  switch (method.toUpperCase()) {
    case 'PUT': {    
      if (!client.isOpen) {
        res.status(500).send("Client disconected");
        return;
      }

      const { option } = body;
      if (!option ) {
        res.status(400).send("Missing option");
        return;
      }

      const { err } = client.publish('vote', "vote:" + option);
      if (err) {
        res.status(500).send("Error publishing to redis");
        return;
      }
      
      res.status(200).send();
      break;
    }
    default: {
      res.status(405).end(`Method Not Allowed`);
    }
  }
}
