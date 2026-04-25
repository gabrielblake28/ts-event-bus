
interface EventMap {
  userLogin: { userId: string; timestamp: number };
  logout: void;
  dataReceived: { content: string; length: number };
  error: { message: string; code: number };
}
