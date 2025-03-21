import { http } from "@/utils/http";
import { baseUrlApi } from "@/api/utils";

// 查询字典类型列表
export const listType = query => {
  return http.request("get", baseUrlApi("system/dict/type/list"), {
    params: query
  });
};

// 查询字典类型详细
export const getType = dictId => {
  return http.request("get", baseUrlApi(`system/dict/type/${dictId}`));
};

// 新增字典类型
export const addType = data => {
  return http.request("post", baseUrlApi("system/dict/type"), {
    data
  });
};

// 修改字典类型
export const updateType = data => {
  return http.request("put", baseUrlApi("system/dict/type"), {
    data
  });
};

// 删除字典类型
export const delType = dictId => {
  return http.request("delete", baseUrlApi(`system/dict/type/${dictId}`));
};

// 刷新字典缓存
export const refreshCache = () => {
  return http.request("delete", baseUrlApi("system/dict/type/refreshCache"));
};

// 获取字典选择框列表
export const optionselect = () => {
  return http.request("get", baseUrlApi("system/dict/type/optionselect"));
};
