/* eslint-disable camelcase */
/* eslint-disable radix */
import { message } from 'antd';
import moment from 'moment';
import {
  fakeSubmitForm,
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
    *submitOvertimeRecords({ payload }, { call }) {
      yield call(fakeSubmitForm, payload);
      message.success('提交成功');
    },
    *querySelectedRecords({ payload }, { call, put }) {
      const { error_no, records } = yield call(querySelectedRecords, payload);
      if (parseInt(error_no) !== 0) {
        message.error('查询失败');
        return;
      }
      yield put({ type: 'updateRecords', payload: records });
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
    updateRecords(state, { payload }) {
      return {
        ...state,
        records: payload,
      };
    },
  },
};
