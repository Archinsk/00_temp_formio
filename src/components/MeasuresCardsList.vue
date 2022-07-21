<template>
  <div class="card-list row row-cols-1">
    <div
      v-for="measuresItem of measuresCardsList"
      :key="measuresItem.id"
      class="col"
    >
      <MeasuresCardsListItem :measure="measuresItem" :theme="theme" />
    </div>
    <div class="col">
      <Pagination
        v-show="itemsTotal > pageSize"
        :items-total="itemsTotal"
        :page="page"
        :page-size="pageSize"
        :items-per-page="itemsPerPage"
        :theme="theme"
        @change-page-size="$emit('change-page-size', $event)"
        @change-page="$emit('change-page', $event)"
      ></Pagination>
    </div>
  </div>
</template>

<script>
import MeasuresCardsListItem from "@/components/MeasuresCardsListItem";
import Pagination from "./universal/Pagination";

export default {
  name: "MeasuresCardsList",
  components: {
    MeasuresCardsListItem,
    Pagination,
  },
  props: [
    "measuresCardsList",
    "itemsTotal",
    "page",
    "pageSize",
    "itemsPerPage",
    "theme",
  ],
};
</script>
