export class LinkAlreadyExists extends Error {
  constructor() {
    super('Link encurtado já existe.')
  }
}