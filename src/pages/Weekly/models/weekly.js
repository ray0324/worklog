/* eslint-disable no-underscore-dangle */
/* eslint-disable camelcase */
/* eslint-disable radix */
// import { message } from 'antd';
import moment from 'moment';
import * as api from '@/services/api';

export default {
  namespace: 'weekly',

  state: {
    records: [],
    selectedMonth: moment(),
  },

  effects: {
    *queryRecords(param, { call }) {
      const { error_no, records } = yield call(api.queryWeekly);
      console.log({ error_no, records });
    },
  },

  reducers: {},
};
