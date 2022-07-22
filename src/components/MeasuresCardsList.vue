<template>
  <div class="card-list">
    <MeasuresCardsListItem
      v-for="measuresItem of measuresCardsList"
      :key="measuresItem.id"
      :measure="measuresItem"
      :theme="theme"
    />
    <div>
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
