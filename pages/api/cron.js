import axios from "axios"

export default async function handler(req, res) {
  return new Promise(resolve=>{
    try{ 
      axios.get("https://websocket-chatvite.glitch.me/health/").then(resolve).catch(_){}
    }
    catch(error){}
    res.status(204).end();
  })
}
