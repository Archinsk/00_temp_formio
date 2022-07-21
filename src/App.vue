<template>
  <div id="app">
    <router-view
      :url="url"
      :user="user"
      :unread-messages="unreadMessages"
      :theme="theme"
      @assign-user="assignUser($event)"
      @select-role="user.selectedRole = $event"
      @change-user-short-info="user.shortInfo = $event"
    />
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "App",
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

  methods: {
    // Проверка пользователя на предмет авторизации
    getLogin() {
      axios(this.url + "auth/get-login", {
        withCredentials: true,
      })
        .then((response) => {
          console.log(response);
        })
        .catch((error) => {
          if (error.response && error.response.status === 406) {
            console.log("Пользователь уже авторизован");
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
          this.signInWithRole(response.data.roles[0]);
          console.groupCollapsed(
            "Пользователь авторизован с первой имеющейся ролью"
          );
          console.log(response.data.roles[0]);
          console.groupEnd();
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
        .then(() => {
          this.$emit("assign-user", this.userInfoFromResponse);
          this.$refs["nav-sidebar"].hide();
        })
        .catch((error) => {
          if (error.response.status === 401) {
            this.authError.type = "password";
            this.authError.text = "Неверно указан пароль!";
          }
          if (error.response.status === 404) {
            this.authError.type = "login";
            this.authError.text =
              "Пользователь с указанным логином не зарегистрирован!";
          }
        });
    },

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

    // Выбор роли пользователя при авторизации по логину/паролю
    signInWithRole(role, hideModal) {
      axios
        .put(this.url + "core/put-metadata?orgId=0&roleId=" + role.id, "", {
          withCredentials: true,
        })
        .then((response) => {
          this.userInfoFromResponse.shortInfo = response.data;
          this.userInfoFromResponse.selectedRole = role;
          if (hideModal) {
            this.$refs["modal-auth"].hide();
          }
          this.cleanSignInForm();
          console.log('Пользователь авторизован с ролью "' + role.label + '"');
        });
    },

    cleanSignInForm() {
      this.login = "";
      this.password = "";
      this.authError.type = "";
      this.authError.text = "";
    },

    signOut() {
      if (this.user.shortInfo.typeAuth === "local") {
        this.signOutLocal();
      }
      if (this.user.shortInfo.typeAuth === "esia") {
        this.getLogout();
      }
    },

    signOutLocal() {
      axios(this.url + "auth/local-logout", {
        withCredentials: true,
      })
        .then((response) => {
          if (response.status === 200) {
            const guestUser = {
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
            this.$emit("assign-user", guestUser);
            console.log("Выход пользователя из системы");
          }
        })
        .then(() => {
          this.$refs["nav-sidebar"].hide();
          if (this.$route.path !== "/") {
            this.$router.push("/");
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

    // Выход через ЕСИА
    getLogout() {
      axios(this.url + "auth/get-logout", {
        withCredentials: true,
      })
        .then((response) => {
          console.log("Ссылка на выход ЕСИА");
          console.log(response);
          // location.href = response.data.url;
          this.esiaLogoutLink = response.data.url;
          this.shortInfo = {
            userId: null,
            userName: "",
            typeAuth: "",
          };
          this.fullInfo = {
            roles: [],
          };
          this.signOutEsia();
        })
        .catch((error) => {
          console.log("Ошибка выхода есиа");
          console.log(error);
        })
        .then(() => {
          this.$router.push("/");
        });
    },
    signOutEsia() {
      axios(this.esiaLogoutLink, {
        withCredentials: true,
      }).then((response) => {
        this.$refs["nav-sidebar"].hide();
        console.log("Ответ на запрос о выходе из ЕСИА");
        console.log(response);
      });
    },

    assignUser(user) {
      this.user = user;
    },
  },

  mounted: function () {
    this.getLogin();
    // this.signInLocal();
  },
};
</script>
