<template>
  <div id="app">
    <Header
      :auth-user="authUser"
      @sign-action="authUser ? signOutLocal() : signInLocal()"
    />
    <router-view
      :url="url"
      :user="user"
      :auth-user="authUser"
      :theme="theme"
      @select-role="user.selectedRole = $event"
      @change-user-short-info="user.shortInfo = $event"
    />
  </div>
</template>

<script>
import axios from "axios";
import Header from "@/components/Header";

export default {
  name: "App",
  components: { Header },
  data() {
    return {
      url: "https://open-newtemplate.isands.ru/api/",
      user: {
        shortInfo: {
          userId: null,
          userName: "",
          typeAuth: "",
        },
        fullInfo: {
          roles: [],
        },
        selectedRole: {
          id: null,
          key: "",
          label: "",
        },
      },
      theme: "warning",
    };
  },

  computed: {
    authUser: function () {
      return !!this.user.shortInfo.userId;
    },
  },

  methods: {
    // Проверка пользователя на предмет авторизации
    getLogin() {
      axios(this.url + "auth/get-login", {
        withCredentials: true,
      })
        .then(() => {
          console.log("Пользователь не авторизован при певичной проверке");
          this.signInLocal();
        })
        .catch((error) => {
          if (error.response && error.response.status === 406) {
            console.log("При певичной проверке пользователь уже авторизован");
          }
          this.getUserId();
          this.getUserInfo();
        });
    },
    // Получение идентификатора пользователя
    getUserId() {
      axios(this.url + "auth/get-user", {
        withCredentials: true,
      }).then((response) => {
        console.groupCollapsed("Идентификатор пользователя");
        console.log(response.data);
        console.groupEnd();
        this.user.shortInfo = response.data;
      });
    },
    // Получение детальной информации о пользователе
    getUserInfo() {
      axios(this.url + "core/get-user", {
        withCredentials: true,
      }).then((response) => {
        console.groupCollapsed("Данные пользователя");
        console.log(response.data);
        console.groupEnd();
        this.user.fullInfo = response.data;
        if (response.data.roles.length === 0) {
          console.log("У пользователя отсутствуют роли");
        } else {
          if (this.user.shortInfo.roleId) {
            this.user.selectedRole = this.selectRoleById(
              response.data.roles,
              this.user.shortInfo.roleId
            );
            console.groupCollapsed(
              "Пользователь был ранее авторизован с ролью"
            );
            console.log(this.user.selectedRole);
            console.groupEnd();
          } else {
            this.signInWithRole(response.data.roles[0]);
            this.user.selectedRole = response.data.roles[0];
            console.groupCollapsed(
              "Пользователь авторизован с первой имеющейся ролью"
            );
            console.log(response.data.roles[0]);
            console.groupEnd();
          }
        }
      });
    },

    // Вход по логину и паролю
    signInLocal() {
      const request = {
        login: "mihail",
        password: "12345",
      };
      axios
        .post(this.url + "auth/local-login", request, {
          withCredentials: true,
        })
        .then(() => {
          this.getUserId();
          this.getUserInfo(false);
        })
        .catch((error) => {
          if (error.response.status === 401) {
            console.log("Неверно указан пароль при попытке авторизации");
          }
          if (error.response.status === 404) {
            console.log(
              "Указан логин несуществующего пользователя при попытке авторизации"
            );
          }
        });
    },

    // Выбор роли из списка по id
    selectRoleById(roles, roleId) {
      for (let i = 0; i < roles.length; i++) {
        if (roleId === roles[i].id) {
          console.groupCollapsed("Пользователь уже авторизован с ролью");
          console.log(roles[i]);
          console.groupEnd();
          return roles[i];
        }
      }
    },

    // Выбор роли пользователя
    signInWithRole(role) {
      axios
        .put(this.url + "core/put-metadata?orgId=0&roleId=" + role.id, "", {
          withCredentials: true,
        })
        .then(() => {
          console.log('Пользователь авторизован с ролью "' + role.label + '"');
        });
    },

    // Выход по логину и паролю
    signOutLocal() {
      axios(this.url + "auth/local-logout", {
        withCredentials: true,
      })
        .then((response) => {
          if (response.status === 200) {
            this.user = {
              shortInfo: {
                userId: null,
                userName: "",
                typeAuth: "",
              },
              fullInfo: {
                roles: [],
              },
              selectedRole: {
                id: null,
                key: "",
                label: "",
              },
            };
            console.log("Выход пользователя из системы");
          }
        })
        .catch((error) => {
          if (error.response && error.response.status === 401) {
            console.log(
              "Попытка неавторизованного пользователя осуществить выход из системы"
            );
          }
        });
    },
  },

  mounted: function () {
    this.getLogin();
  },
};
</script>
