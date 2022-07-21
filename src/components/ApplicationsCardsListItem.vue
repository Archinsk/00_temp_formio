<template>
  <div class="card request-card">
    <div class="card-body d-flex justify-content-between align-items-center">
      <h5 class="card-title mb-0">
        <span :class="'badge badge-' + theme + ' mr-2'"
          >№{{ application.id }}</span
        >
        {{ application ? application.servName : "Наименование меры поддержки" }}
      </h5>
      <router-link
        :to="appLink"
        :class="'btn btn-outline-' + theme"
        role="button"
        >Открыть</router-link
      >
      <!--      <b-button-->
      <!--        v-b-modal.edit-app-->
      <!--        @click="$emit('get-app-form')"-->
      <!--        :variant="'outline-' + theme"-->
      <!--      >-->
      <!--        Открыть-->
      <!--      </b-button>-->
    </div>
    <div class="card-footer bg-transparent">
      <p>Текущий статус: {{ application.status }}</p>
      <p>Дата начала: {{ startDate }}</p>
      <p style="visibility: hidden">Статус обновлен: 19.01.2022</p>
    </div>
  </div>
</template>

<script>
export default {
  name: "ApplicationsCardsListItem",

  props: ["application", "index", "theme"],

  data() {
    return {};
  },

  computed: {
    appLink: function () {
      return (
        "/application_view/model/" +
        this.application.servId +
        "/app/" +
        this.application.id
      );
    },

    startDate: function () {
      const options = {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      };
      if (this.application.startDate) {
        return new Intl.DateTimeFormat("ru-RU", options).format(
          new Date(this.application.startDate)
        );
      } else {
        return "";
      }
    },
  },
};
</script>
