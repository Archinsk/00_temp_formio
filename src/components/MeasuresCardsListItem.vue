<template>
  <div class="card measure-card">
    <div class="card-body row">
      <h5 class="card-title">
        <span :class="'badge badge-' + theme">{{ measure.id }}</span
        >{{ measure.name }}
      </h5>
      <div class="measure-buttons col">
        <router-link
          :to="'/subsidy_info/model/' + measure.id"
          :class="'btn btn-outline-' + theme"
          role="button"
          >Получить поддержку</router-link
        >
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "MeasuresCardsListItem",

  props: ["measure", "theme"],

  computed: {
    measurePeriod() {
      let period = "";
      const options = {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      };
      if (this.measure.startDate) {
        period +=
          "c " +
          new Intl.DateTimeFormat("ru-RU", options).format(
            new Date(this.measure.startDate)
          ) +
          " ";
      }
      if (this.measure.endDate) {
        period +=
          "по " +
          new Intl.DateTimeFormat("ru-RU", options).format(
            new Date(this.measure.endDate)
          );
      }
      if (!this.measure.startDate && !this.measure.endDate) {
        period = "даты не указаны";
      }
      return period;
    },
    isActive() {
      return this.measure.active ? "активна" : "не активна";
    },
  },
};
</script>
