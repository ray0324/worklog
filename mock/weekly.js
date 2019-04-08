import mockjs from 'mockjs';

export default {
  // 查询当前月份的加班记录
  'POST /api/weekly': (req, res) => {
    res.json(
      mockjs.mock({
        error_no: 0,
        'records|0-10': [
          {
            '_id|+1': 1,
            week: '2019-16周',
            'summary|2-5': ['@sentence'],
            'plan|2-5': ['@sentence'],
          },
        ],
      })
    );
  },
};
