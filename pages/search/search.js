Page({
  data: {
    inputVal: "", //用户输入的搜索内容
    searchedKeywords: [], //搜索历史记录
    hotSearchProducts: [], //热搜产品关键词
    suggestKeywords: [], //搜索联想关键词
    isNoMoreData: false, //记录是否已加载完所有分页数据
    inputFocused: false, //是否焦点在搜索输入框
  },
})
