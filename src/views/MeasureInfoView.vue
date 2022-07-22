<template>
  <section class="support">
    <div class="container pt-1">
      <h5 class="support-name text-center pb-0">
        {{ measure.name }}
      </h5>

      <div class="card measure-card mb-2">
        <div
          class="card-body d-flex justify-content-between align-items-center"
        >
          <div>
            <div :class="{ 'text-danger': !user.shortInfo.userId }">
              Пользователь {{ user.shortInfo.userId ? "" : "не" }} авторизован
            </div>
            <div :class="{ 'text-danger': !measure.available }">
              Мера поддержки {{ measure.available ? "" : "не" }}доступна
            </div>
            <div
              v-if="user.shortInfo.userId"
              :class="{ 'text-danger': !availabilityByRole }"
            >
              Первая форма {{ availabilityByRole ? "" : "не" }} доступна для
              роли "{{ user.selectedRole.label }}"
            </div>
          </div>

          <router-link
            v-if="
              user.shortInfo.userId && measure.available && availabilityByRole
            "
            :to="appLink"
            :class="'btn btn-' + theme"
            role="button"
            >Подать заявку</router-link
          >
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import axios from "axios";

export default {
  name: "MeasureInfoView",
  props: ["url", "theme", "user", "authUser"],

  data() {
    return {
      measure: {},
    };
  },

  computed: {
    appLink: function () {
      return "/application_view/model/" + this.$route.params.modelId + "/app/0";
    },
    availabilityByRole: function () {
      if (!this.measure.id) {
        return false;
      } else {
        for (let i = 0; i < this.measure.roles.length; i++) {
          if (this.user.selectedRole.id === this.measure.roles[i].id) {
            return true;
          }
        }
        return false;
      }
    },
  },

  methods: {
    // Информация о мере поддержки
    getMeasure() {
      axios
        .get(this.url + "serv/get-model?id=" + this.$route.params.modelId)
        .then((response) => {
          this.measure = response.data;
          console.groupCollapsed("Информация о мере поддержки");
          console.log(response.data);
          console.groupEnd();
        });
    },
  },

  mounted: function () {
    this.getMeasure();
  },
};
</script>
