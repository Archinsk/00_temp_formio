<template>
  <div>
    <ApplicationsCardsListItem
      v-for="(appsItem, index) of appsCardsList.content"
      :key="index ? appsItem.id + '-' + index : appsItem.id"
      :application="appsItem"
      :index="index"
      :theme="theme"
      @get-app-form="$emit('get-app-form', appsItem.id)"
    />
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
</template>

<script>
import ApplicationsCardsListItem from "@/components/ApplicationsCardsListItem";
import Pagination from "./universal/Pagination";

export default {
  name: "ApplicationsCardsList",
  components: {
    ApplicationsCardsListItem,
    Pagination,
  },
  props: ["appsCardsList", "itemsTotal", "page", "pageSize", "itemsPerPage", "theme"],
};
</script>
