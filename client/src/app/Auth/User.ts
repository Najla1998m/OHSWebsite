import { JwtHelperService } from '@auth0/angular-jwt';
export class User {
  constructor(
    public email: string,
    public username: string,
    private _token: string,
    public roles: any
  ) {}

  public get token(): string | null {
    const helper = new JwtHelperService();
    // const isExpired = helper.isTokenExpired(this.token);
    const isExpired = false;
    if (isExpired) {
      return null;
    }

    return this._token;
  }

  public isAdmin(): boolean {
    const helper = new JwtHelperService();
    const decodedToken = helper.decodeToken(this.token);
    if (decodedToken.role == 'OHS Admin') {
      return true;
    } else {
      return false;
    }
  }
  helper = new JwtHelperService();
  public getUserId() {
    const decodedToken = this.helper.decodeToken(this._token);
    console.log('dec token', decodedToken);

    return decodedToken.nameid;
  }
}
