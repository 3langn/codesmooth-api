export class ResponseDefault {
  message: string;
  data: any;

  constructor(message?: string, data?: any) {
    this.message = message ? message : "Success";
    this.data = data ? data : null;
  }
}
