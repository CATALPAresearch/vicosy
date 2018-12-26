export const getRemoteScrubClient = sharedRoomData => {
  const clients = sharedRoomData.clients;

  const clientKeys = Object.keys(clients);

  for (let i = 0; i < clientKeys.length; i++) {
    const clientData = clients[clientKeys[i]];

    if (!clientData.remoteState) continue;

    const { scrubState } = clientData.remoteState;

    if (!scrubState || !scrubState.sync || scrubState.perc === -1) continue;

    return clientData;
  }

  return null;
};
