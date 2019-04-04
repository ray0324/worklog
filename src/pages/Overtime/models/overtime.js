/* eslint-disable camelcase */
/* eslint-disable radix */
import { message } from 'antd';
import moment from 'moment';
import {
  querySelectedRecords,
  // createRecord
} from '@/services/api';

export default {
  namespace: 'overtime',

  state: {
    records: [],
    selectedMonth: moment(),
  },

  effects: {
    *querySelectedRecords(
      {
        payload: { selectedMonth },
      },
      { call, put }
    ) {
      const selected = selectedMonth.format('YYYY-MM');
      console.log(selected);

      const { error_no, records } = yield call(querySelectedRecords, { selected });
      if (parseInt(error_no) !== 0) {
        message.error('查询失败');
        return;
      }
      yield put({
        type: 'queryRecords',
        payload: {
          records,
          selectedMonth,
        },
      });
    },
    // *newReacd({ payload }, { call, put }) {
    //   const { error_no, record: newRecord } = yield call(createRecord, payload);
    //   if(parseInt(error_no) !== 0) {
    //     message.error('创建失败');
    //     // return;
    //   }
    //   // const {record:{ key }}
    //   // yield put({ type: 'newRecord', payload: record });
    // },
  },

  reducers: {
    queryRecords(
      state,
      {
        payload: { records, selectedMonth },
      }
    ) {
      return {
        ...state,
        records,
        selectedMonth,
      };
    },
  },
};
