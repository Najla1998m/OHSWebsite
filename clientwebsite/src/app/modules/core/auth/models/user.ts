import { JwtHelperService } from '@auth0/angular-jwt';

export class User {
  helper = new JwtHelperService();
  constructor(
    public email: string,
    public username: string,
    private _token: string
  ) {}

  public get token(): string | null {
    this.helper = new JwtHelperService();
    // const isExpired = helper.isTokenExpired(this.token);
    const isExpired = false;
    if (isExpired) {
      return null;
    }

    return this._token;
  }

  public getToken() {
    return this._token;
  }

  public getRole() {
    const decodedToken = this.helper.decodeToken(this._token);
    return decodedToken.role;
  }

  public isAdmin(): boolean {
    const decodedToken = this.helper.decodeToken(this._token);
    if (decodedToken.role == 'OHS Admin') {
      return true;
    } else {
      return false;
    }
  }

  public getUserId() {
    const decodedToken = this.helper.decodeToken(this._token);

    return decodedToken.nameid;
  }

  public getDecodedToken() {
    const decodedToken = this.helper.decodeToken(this._token);
    return decodedToken;
  }
}
