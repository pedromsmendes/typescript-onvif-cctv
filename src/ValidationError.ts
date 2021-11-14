class ValidationError extends Error {
  constructor(message: string | string[]) {
    if (Array.isArray(message)) {
      super(`\n\t${message.join('\n\t')}\n`);
    } else {
      super(message);
    }

    this.name = 'ValidationError';
  }
}

export default ValidationError;
