export class SendTokenCommand {
  constructor(public readonly userId: string, public readonly token: string) {}
}
