<template>
  <section class="measures">
    <div class="container pt-1">
      <h5 class="title-primary text-center">
        Меры поддержки
        <span :class="'badge badge-' + theme">{{ itemsTotal }}</span>
      </h5>
      <div class="row">
        <div class="col">
          <MeasuresCardsList
            :measures-cards-list="measuresCardsList"
            :items-total="itemsTotal"
            :page="page"
            :page-size="pageSize"
            :items-per-page="itemsPerPage"
            :theme="theme"
            @change-page-size="changePageSize($event)"
            @change-page="changePage"
          ></MeasuresCardsList>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import MeasuresCardsList from "@/components/MeasuresCardsList";
import axios from "axios";

export default {
  name: "MeasuresView",

  components: {
    MeasuresCardsList,
  },

  props: ["url", "theme", "user", "authUser"],

  data() {
    return {
      measuresCardsList: [],
      itemsTotal: 0,
      page: 1,
      pageSize: 10,
      itemsPerPage: [10, 25, 50],
    };
  },

  methods: {
    // Получение списка мер
    getServises() {
      axios
        .get(this.url + "serv/get-services" + this.queryParams)
        .then((response) => {
          this.measuresCardsList = response.data.content;
          this.itemsTotal = response.data.totalElements;
          console.groupCollapsed("Список мер поддержки");
          console.log(response.data);
          console.groupEnd();
          window.scrollTo(0, 0);
        });
    },

    // Пагинация
    changePageSize(newPageInfo) {
      this.page = newPageInfo[0];
      this.pageSize = newPageInfo[1];
      this.getServises();
      console.log(
        "Количество записей на странице изменено на " + newPageInfo[1]
      );
    },
    changePage(page) {
      this.page = page;
      console.log("Номер страницы изменено на " + page);
      this.getServises();
    },
  },

  computed: {
    queryParams: function () {
      let query =
        "?pageNum=" +
        (this.page - 1) +
        "&pageSize=" +
        this.pageSize +
        "&sortCol=id&sortDesc=false&active=true";
      return query;
    },
  },

  mounted: function () {
    this.getServises();
  },
};
</script>
