#!/usr/bin/env node
/**
 * This script subscribes all members of a collective (core contributors)
 * to the `group.monthlyreport` notification (for all collectives)
 */
import Promise from 'bluebird';
import models from '../server/models';

const debug = require('debug')('subscribe');

const UserGroup = models.UserGroup;
const Notification = models.Notification;

const processRows = (rows) => {
    return Promise.map(rows, processRow);
};

const init = () => {
  UserGroup.findAll()
  .then(processRows)
  .then(() => process.exit(0));
}

const processRow = (row) => {
  const lists = {};
  lists['BACKER'] = 'backers';
  lists['MEMBER'] = 'members';
  const type = `mailinglist.${lists[row.role]}`;
  debug(`Subscribing UserId ${row.UserId} to ${type} of GroupId ${row.GroupId}`);
  return Notification.create({
    UserId: row.UserId,
    GroupId: row.GroupId,
    type
  }).catch(() => console.error(`UserId ${row.UserId} already subscribed to ${type} of GroupId ${row.GroupId}`));
};


init();
