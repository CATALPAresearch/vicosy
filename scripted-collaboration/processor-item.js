// base class for a phase
module.exports = class SessionProcessorItem {
  constructor(sessionData, sessionProcessor, phaseId, onCompleteCb) {
    this.sessionProcessor = sessionProcessor;
    this.phaseId = phaseId;
    this.onCompleteCb = onCompleteCb;
    this.sessionData = sessionData;
    this.completed = false;
    this.ignoreSessionDataChanges = false;

    this.isActive = false;
  }

  /**
   * public
   */
  execute() {
    this.sessionProcessor.adjustRoomData("collabScript.phaseData", {
      phaseId: this.phaseId,
      uniqueStepId: this.phaseId + Math.random(),
      payload: this.getPayload(),
      rolesReady: this.setupRolesReadyState()
    });

    this.isActive = true;
  }

  dispose() {
    this.isActive = false;
  }

  // do not override this => override onPeerMemberMessage instead!
  onPeerScriptMessage(nick, data) {
    if (!this.isActive) return;

    // check for ready
    console.log(`${nick} sent data ${data}`);

    const role = this.sessionData.getAtPath(`collabScript.roles.${nick}`);

    if (data.type === "readyState") {
      const readyRequiredRoles = this.getRolesRequiredReady();
      if (readyRequiredRoles && readyRequiredRoles.includes(role)) {
        this.sessionProcessor.adjustRoomData(
          `collabScript.phaseData.rolesReady.${role}`,
          !!data.value
        );
      }
    } else {
      this.onPeerMemberMessage(data, nick, role);
    }
  }

  // do not override this => override onSessionDataChangedInternal instead!
  // session data may be manipulated as a result of completion
  onSessionDataChanged() {
    if (!this.ignoreSessionDataChanges && this.isActive)
      this.onSessionDataChangedInternal();
  }

  /**
   * protected
   */
  complete() {
    this.ignoreSessionDataChanges = true;
    this.completed = true;
    this.onCompleteCb();
    this.onCompleteCb = null;
  }

  onSessionDataChangedInternal() {
    console.log(
      "Something changed in the session data. Override this and check for condition in subclass"
    );
  }

  onPeerMemberMessage(data, nick, role) {}

  getPayload() {
    return null;
  }

  // returns an array of roles that must indicate ready state
  // to continue to next phase
  getRolesRequiredReady() {
    return null;
  }

  areAllRolesReady() {
    // TODO: check
    const reqRoles = this.getRolesRequiredReady();
    if (!reqRoles) return true;

    const rolesReadyValues = this.sessionData.collabScript.phaseData.rolesReady;

    console.log("roles ready?", rolesReadyValues, reqRoles);

    for (const reqRole in reqRoles) {
      if (!rolesReadyValues[reqRoles[reqRole]]) return false;
    }

    return true;
  }

  /**
   * private
   */

  setupRolesReadyState() {
    const requiredRoles = this.getRolesRequiredReady();

    var initialReadyStates = {};

    if (requiredRoles) {
      for (var role in requiredRoles) {
        initialReadyStates[requiredRoles[role]] = false;
      }
    }

    return initialReadyStates;
  }
};
