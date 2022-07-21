<template>
  <div class="container">
    <Header :theme="theme" />
    <article class="profile">
      <h4 class="title-primary text-center">Личный кабинет</h4>
      <section class="user-info">
        <div class="user-info__details">
          <div class="user-text">
            <div class="user-text__name">
              {{ userFullName ? userFullName : "ФИО не указаны" }}
            </div>
            <div class="user-text__snils">
              {{
                user.fullInfo.userData && user.fullInfo.userData.snils
                  ? "СНИЛС: " + user.fullInfo.userData.snils
                  : "СНИЛС не указан"
              }}
            </div>
          </div>
        </div>
      </section>

      <b-tabs>
        <b-tab title="Заявления" active>
          <Applications :url="url" :theme="theme" />
        </b-tab>
        <b-tab title="Личные данные">
          <h4 class="text-center">Личные данные</h4>
          <section>
            <h5 class="secondary-title">Основная информация</h5>
            <div>
              <div class="term">
                <div class="term-title">
                  Телефон:
                  <span class="dotted-line"></span>
                </div>
                <div>не указан</div>
              </div>
              <div class="term">
                <div class="term-title">
                  E-mail:
                  <span class="dotted-line"></span>
                </div>
                <div>
                  {{
                    user.fullInfo.contacts && user.fullInfo.contacts[0].value
                      ? user.fullInfo.contacts[0].value
                      : "не указан"
                  }}
                </div>
              </div>
              <div class="term align-items-center">
                <label class="term-title" for="exampleFormControlSelect1">
                  Текущая роль:
                </label>
                <select
                  v-model="selectedUserRole"
                  class="form-control"
                  id="exampleFormControlSelect1"
                  @change="
                    setRole(
                      selectRoleById(user.fullInfo.roles, selectedUserRole)
                    )
                  "
                >
                  <option
                    v-for="role of user.fullInfo.roles"
                    :key="role.id"
                    :value="role.id"
                    :selected="role.id === user.selectedRole.roleId"
                  >
                    {{ role.label }}
                  </option>
                </select>
              </div>
            </div>
          </section>
        </b-tab>
      </b-tabs>
    </article>
  </div>
</template>

<script>
import Applications from "@/components/Applications";
import axios from "axios";
import Header from "../components/Header";

export default {
  name: "AccountInfoView",

  components: {
    Header,
    Applications,
  },

  props: ["url", "user", "theme"],

  data() {
    return {
      xhrResponse: [],
      page: 1,
      pageSize: 10,
      selectedUserRole: this.user.selectedRole.id,
    };
  },

  computed: {
    userFullName: function () {
      let fullName = "";
      if (this.user.fullInfo.userData && this.user.fullInfo.userData.lastName) {
        fullName += this.user.fullInfo.userData.lastName;
      }
      if (
        this.user.fullInfo.userData &&
        this.user.fullInfo.userData.firstName
      ) {
        fullName += " " + this.user.fullInfo.userData.firstName;
      }
      if (
        this.user.fullInfo.userData &&
        this.user.fullInfo.userData.middleName
      ) {
        fullName += " " + this.user.fullInfo.userData.middleName;
      }
      return fullName;
    },
  },

  methods: {
    changePageSize(itemsPerPage) {
      console.log(itemsPerPage);
      this.pageSize = itemsPerPage;
      this.changeItemsCount();
    },
    changePage(page) {
      console.log(page);
      this.page = page;
      this.changeItemsCount();
    },
    changeItemsCount() {
      console.log("Апдейт");
      const xhr = new XMLHttpRequest();
      let request =
        "https://www.d-skills.ru/40_subsidy_bootstrapvue/requests.php?page=" +
        this.page +
        "&pageSize=" +
        this.pageSize;
      xhr.open("GET", request);
      xhr.responseType = "json";
      xhr.onload = () => {
        console.log(xhr.response);
        this.xhrResponse = xhr.response;
      };
      xhr.send();
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

    setRole(role) {
      axios
        .put(this.url + "core/put-metadata?orgId=0&roleId=" + role.id, "", {
          withCredentials: true,
        })
        .then((response) => {
          this.$emit("change-user-short-info", response.data);
          this.$emit("select-role", role);
          console.log('Роль пользователя изменена на "' + role.label + '"');
        });
    },
  },

  updated() {
    this.selectedUserRole = this.user.selectedRole.id;
  },
};
</script>
