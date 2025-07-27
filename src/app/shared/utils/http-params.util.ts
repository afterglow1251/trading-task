import { HttpParams } from '@angular/common/http';

export class HttpParamsBuilder {
  private params = new HttpParams();

  set(key: string, value: string | number): this {
    this.params = this.params.set(key, value.toString());
    return this;
  }

  setIfDefined(key: string, value?: string | number | null): this {
    if (value != null) {
      this.params = this.params.set(key, value.toString());
    }
    return this;
  }

  build(): HttpParams {
    return this.params;
  }
}

export function setHttpParamIfDefined(
  params: HttpParams,
  key: string,
  value?: string | number | null,
): HttpParams {
  if (value != null) {
    return params.set(key, value.toString());
  }
  return params;
}
