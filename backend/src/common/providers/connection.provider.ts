import { Injectable } from '@nestjs/common';
import { disconnectionSubject } from '../constants';
import { Observable } from 'rxjs';
import { Context } from 'graphql-ws';

export type SubscriptionConnection = Context<
  {
    Authorization: string; // connectionParams
    isStatus: boolean;
    isTracking: boolean;
  },
  {
    authorization: string; // extra
    isStatus: boolean;
    isTracking: boolean;
    socket: {
      _closeFrameReceived: boolean;
    };
  }
> & {
  userId: string;
};

@Injectable()
export class ConnectionProvider {
  disconnection$: Observable<SubscriptionConnection>;
  constructor() {
    this.disconnection$ = disconnectionSubject.asObservable();
  }
}
