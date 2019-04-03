import mockjs from 'mockjs';

export default {
  // 查询当前月份的加班记录
  'POST /api/records/list': (req, res) => {
    res.json(
      mockjs.mock({
        error_no: 0,
        'records|0-10': [
          {
            '_id|+1': 1,
            date: '@date("yyyy-MM-dd")',
            time: '@time("H:m")',
            desc: '@sentence',
          },
        ],
      })
    );
  },
  // 创建新的记录
  'POST /api/records/create': (req, res) => {
    res.json(
      mockjs.mock({
        error_no: 0,
        record: [
          {
            _id: 1,
            date: '@date("yyyy-MM-dd")',
            time: '@time("H:m")',
            desc: '@sentence',
          },
        ],
      })
    );
  },
  // 更新
  'POST /api/records/update': (req, res) => {
    res.json(
      mockjs.mock({
        error_no: 0,
        record: [
          {
            _id: 1,
            date: '@date("yyyy-MM-dd")',
            time: '@time("H:m")',
            desc: '@sentence',
          },
        ],
      })
    );
  },
  // 删除
  'POST /api/records/remove': {
    error_no: 0,
    error_message: '删除成功',
  },
};
