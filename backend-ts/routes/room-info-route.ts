// * Module for room info route
import { Response, Request } from 'express';
import { Room } from '../models/room-model.js';
require('dotenv').config();

/**
 * Function that sends room information from db
 * @param req {Request} - express request object
 * @param res {Response} - express response object
 */
function getRoomInfo(req: Request, res: Response) {
  Room.findById((req.session as any).playerId, (error: any, data: any) => {
    if (error)
      console.error(error);
    else {
      res.json(data);
    }
  });
}

export { getRoomInfo };