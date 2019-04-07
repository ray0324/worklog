/* eslint-disable no-underscore-dangle */
/* eslint-disable camelcase */
/* eslint-disable radix */
import { message } from 'antd';
import moment from 'moment';
import * as api from '@/services/api';

export default {
  namespace: 'overtime',

  state: {
    records: [],
    selectedMonth: moment(),
  },

  effects: {
    *queryRecords(
      {
        payload: { selectedMonth },
      },
      { call, put }
    ) {
      const selected = selectedMonth.format('YYYY-MM');
      const { error_no, records } = yield call(api.querySelectedRecords, { selected });
      if (parseInt(error_no) !== 0) {
        message.error('查询失败');
        return;
      }
      yield put({
        type: 'query',
        payload: {
          records,
          selectedMonth,
        },
      });
    },
    *createRecord(
      {
        payload: { record },
      },
      { call, put }
    ) {
      const { error_no, record: newRecord } = yield call(api.createNewRecord, { record });
      if (parseInt(error_no) !== 0) {
        message.error('添加失败');
        return;
      }
      yield put({
        type: 'create',
        payload: { record: newRecord },
      });
    },
    *updateRecord(
      {
        payload: { record },
      },
      { call, put }
    ) {
      const { error_no, record: newRecord } = yield call(api.updateRecord, { record });
      if (parseInt(error_no) !== 0) {
        message.error('更新失败');
        return;
      }
      yield put({
        type: 'update',
        payload: { record: newRecord },
      });
    },
    *removeRecord(
      {
        payload: { record },
      },
      { call, put }
    ) {
      const { error_no } = yield call(api.removeRecord, { record });
      if (parseInt(error_no) !== 0) {
        message.error('删除失败');
        return;
      }
      yield put({
        type: 'removeRecord',
        payload: { record },
      });
    },
  },

  reducers: {
    query(
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
    create(
      state,
      {
        payload: { record },
      }
    ) {
      const { records: originRecords } = state;
      return {
        ...state,
        records: [].concat(originRecords, record),
      };
    },
    update(
      state,
      {
        payload: { record },
      }
    ) {
      const { records: originRecords } = state;
      const updatedRecords = originRecords.map(item => {
        if (item._id === record._id) {
          return { ...record };
        }
        return { ...item };
      });
      return {
        ...state,
        records: updatedRecords,
      };
    },
    remove(
      state,
      {
        payload: { record },
      }
    ) {
      const { records: originRecords } = state;
      const updatedRecords = originRecords.map(item => {
        if (item._id === record._id) {
          return { ...record };
        }
        return { ...item };
      });
      return {
        ...state,
        records: updatedRecords,
      };
    },
  },
};
