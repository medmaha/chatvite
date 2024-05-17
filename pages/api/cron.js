import axios from "axios"

export default async function handler(req, res) {
  try{ 
    await axios.get("https://websocket-chatvite.glitch.me/health/")
  }
  catch(error){}
  res.status(204).end();
}
