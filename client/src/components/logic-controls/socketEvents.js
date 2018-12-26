// dispatched by window.socketEvents

// join & leave requests
export const JOIN_ROOM = "JOIN_ROOM"; // roomId
export const LEAVE_ROOM = "LEAVE_ROOM"; // roomId

// dispatched by room reducer
export const ROOM_LEFT = "ROOM_LEFT"; // roomId
export const ROOM_JOINED = "ROOM_JOINED"; // roomId
export const USER_LEFT_ROOM = "USER_LEFT_ROOM"; // roomId, clientId
export const USER_JOINED_ROOM = "USER_JOINED_ROOM"; // roomId, clientId

export const GENERIC_ROOM_MESSAGE = "GENERIC_ROOM_MESSAGE"; // roomId
