const generateSessionId = function(sessions) {
  const lastSession = sessions[sessions.length - 1];
  console.log(lastSession);
  return lastSession ? lastSession.SID * Math.random() : 1000 * Math.random();
};

class Session {
  constructor() {
    this.sessions = [];
    this.sessionId = generateSessionId;
  }

  createSession(userName) {
    const SID = this.sessionId(this.sessions);
    const session = {
      SID,
      userName
    };
    this.sessions.push(session);
    return SID;
  }

  isValidSession(sessionId) {
    return this.sessions.find(session => session.SID === sessionId);
  }

  removeSession(sessionId) {
    const sessionIndex = this.sessions.findIndex(
      session => session.SID === sessionId
    );
    this.sessions.splice(sessionIndex, 1);
  }
}

module.exports = new Session();
