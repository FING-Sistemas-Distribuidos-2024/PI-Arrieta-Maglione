

export default async function handler(req, res) {
  const { method, body } = req;
  switch (method.toUpperCase()) {
    case 'GET': {    
        if (!client.isOpen) {
            res.status(500).send("Client disconected");
            return;
        }

        const {err} = client.publish('status', "status");
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
