import { defineStore } from "pinia";
import {
  type userType,
  store,
  router,
  resetRouter,
  routerArrays,
  storageLocal
} from "../utils";
import {
  type LoginResult,
  getLogin,
  type UserResult,
  getInfo,
  logout
} from "@/api/user";
import { useMultiTagsStoreHook } from "./multiTags";
import {
  type DataInfo,
  setToken,
  getToken,
  removeToken,
  userKey
} from "@/utils/auth";

export const useUserStore = defineStore({
  id: "pure-user",
  state: (): userType => ({
    // 头像
    avatar: storageLocal().getItem<DataInfo<number>>(userKey)?.avatar ?? "",
    // 用户名
    userName: storageLocal().getItem<DataInfo<number>>(userKey)?.userName ?? "",
    // 昵称
    nickName: storageLocal().getItem<DataInfo<number>>(userKey)?.nickName ?? "",
    // 页面级别权限
    roles: storageLocal().getItem<DataInfo<number>>(userKey)?.roles ?? [],
    // 按钮级别权限
    permissions:
      storageLocal().getItem<DataInfo<number>>(userKey)?.permissions ?? [],
    // 是否勾选了登录页的免登录
    isRemembered: false,
    // 登录页的免登录存储几天，默认7天
    loginDay: 7
  }),
  actions: {
    /** 存储头像 */
    SET_AVATAR(avatar: string) {
      this.avatar = avatar;
    },
    /** 存储用户名 */
    SET_USERNAME(userName: string) {
      this.userName = userName;
    },
    /** 存储昵称 */
    SET_NICKNAME(nickName: string) {
      this.nickName = nickName;
    },
    /** 存储角色 */
    SET_ROLES(roles: Array<string>) {
      this.roles = roles;
    },
    /** 存储按钮级别权限 */
    SET_PERMS(permissions: Array<string>) {
      this.permissions = permissions;
    },
    /** 存储是否勾选了登录页的免登录 */
    SET_ISREMEMBERED(bool: boolean) {
      this.isRemembered = bool;
    },
    /** 设置登录页的免登录存储几天 */
    SET_LOGINDAY(value: number) {
      this.loginDay = Number(value);
    },
    /** 登入 */
    async loginByUsername(data) {
      return new Promise<LoginResult>((resolve, reject) => {
        getLogin(data)
          .then(res => {
            if (res?.code === 200)
              setToken({
                accessToken: res.token,
                expires: Date.now() + 3600 * 1000
              });
            resolve(res);
          })
          .catch(error => {
            reject(error);
          });
      });
    },
    /** 获取用户信息 */
    async getInfo() {
      return new Promise<UserResult>((resolve, reject) => {
        getInfo()
          .then(res => {
            if (res?.code === 200) {
              const { user, roles, permissions } = res;
              this.SET_AVATAR(user.avatar);
              this.SET_USERNAME(user.userName);
              this.SET_NICKNAME(user.nickName);
              this.SET_ROLES(roles);
              this.SET_PERMS(permissions);
              setToken({
                accessToken: getToken()?.accessToken,
                expires: getToken()?.expires,
                avatar: user.avatar,
                userName: user.userName,
                nickName: user.nickName,
                roles,
                permissions
              });
              resolve(res);
            }
          })
          .catch(error => {
            reject(error);
          });
      });
    },
    /** 前端登出（不调用接口） */
    async logOut() {
      await logout();
      this.userName = "";
      this.roles = [];
      this.permissions = [];
      removeToken();
      useMultiTagsStoreHook().handleTags("equal", [...routerArrays]);
      resetRouter();
      router.push("/login");
    }
    // /** 刷新`token` */
    // async handRefreshToken(data) {
    //   return new Promise<RefreshTokenResult>((resolve, reject) => {
    //     refreshTokenApi(data)
    //       .then(data => {
    //         if (data) {
    //           setToken(data.data);
    //           resolve(data);
    //         }
    //       })
    //       .catch(error => {
    //         reject(error);
    //       });
    //   });
    // }
  }
});

export function useUserStoreHook() {
  return useUserStore(store);
}
