
async function isAdmin(req, res, next) {
    try {
      const sessionToken = req.headers['x-parse-session-token']; 
  
      if (!sessionToken) {
          return res.status(401).json({ error: 'Unauthorized: No session token' });
      }
  
      const query = new Parse.Query(Parse.Session);
      query.equalTo('sessionToken', sessionToken);
      const session = await query.first({ useMasterKey: true });
  
      if (!session) {
          return res.status(401).json({ error: 'Unauthorized: Invalid session token' });
      }
  
      const user = session.get('user')
  
      req.user = user;
  
      next(); 
    } catch (error) {
      return res.status(401).json({ error: 'Unauthorized: Invalid session token' });
    }
  }
  
  module.exports = isAdmin;