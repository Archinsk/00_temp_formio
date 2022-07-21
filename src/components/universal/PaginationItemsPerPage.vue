<template>
  <div class="paginator__items-per-page d-none d-lg-block">
    <button
      v-for="valuePerPage of itemsPerPage"
      :key="valuePerPage"
      type="button"
      :class="'page-size btn btn-' + theme"
      @click="$emit('change-page-size', valuePerPage)"
    >
      {{ valuePerPage }}
    </button>
  </div>
</template>

<script>
export default {
  name: "PaginationItemsPerPage",
  props: ["itemsPerPage", "pageSize", "theme"],
};
</script>
